// app/(public)/profile/courses/data/courses-service.ts
import { auth } from "@/auth/auth";
import { prisma } from "@/utils/lib/prisma";
import { UserCourse, Certificate, ContinueLearningItem, CourseStat } from "@/types/courses";
import { ContentType } from "@prisma/client";

/**
 * Получение статистики курсов пользователя
 */
export async function getCourseStats(userId: string): Promise<CourseStat> {
  // Получаем профиль пользователя
  const profile = await prisma.profile.findUnique({
    where: { userId },
    select: {
      id: true
    }
  });

  if (!profile) {
    throw new Error("Профиль пользователя не найден");
  }

  // Получаем все курсы пользователя с прогрессом
  const progresses = await prisma.progress.findMany({
    where: {
      profileId: profile.id,
      content: {
        type: ContentType.COURSE
      }
    },
    include: {
      content: {
        select: {
          id: true,
          title: true,
          description: true,
          coverImage: true,
          publishedAt: true
        }
      }
    }
  });

  // Подсчитываем статистику
  const totalCourses = progresses.length;
    const completedCourses = progresses.filter(p => p.status === "completed" as const).length;
    const inProgressCourses = progresses.filter(p => p.status === "in_progress" as const).length;

  // Получаем количество сертификатов
  const totalCertificates = await prisma.content.findMany({
    where: {
      authorProfileId: profile.id,
      type: ContentType.COURSE,
      progress: {
        some: {
          profileId: profile.id,
          status: "completed"
        }
      }
    }
  }).then(courses => courses.length);

  // Вычисляем общее время обучения (приближенно)
  const totalHoursSpent = progresses.reduce((sum, progress) => {
    // Приблизительное время на основе прогресса и предполагаемой длительности
    return sum + Math.floor(progress.progressPercent / 10);
  }, 0);

  return {
    totalCourses,
    completedCourses,
    inProgressCourses,
    totalCertificates,
    totalHoursSpent
  };
}

/**
 * Получение курсов пользователя
 */
export async function getUserCourses(userId: string): Promise<UserCourse[]> {
  const session = await auth();
  if (!session) {
    throw new Error("Пользователь не авторизован");
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    select: {
      id: true
    }
  });

  if (!profile) {
    throw new Error("Профиль пользователя не найден");
  }

  // Получаем все курсы с прогрессом пользователя
  const progresses = await prisma.progress.findMany({
    where: {
      profileId: profile.id,
      content: {
        type: ContentType.COURSE
      }
    },
    include: {
      content: {
        include: {
          modules: {
            include: {
               lessons: {
                 where: {
                   status: "PUBLISHED" as const
                 },
                select: {
                  id: true
                }
              }
            }
          }
        }
      }
    }
  });

  // Преобразуем данные в формат UserCourse
  return progresses.map(progress => {
    const course = progress.content;
    const totalLessons = course.modules.reduce((sum, module) => sum + module.lessonsCount, 0);
    const completedLessons = progress.completedLessons;

    // Определяем статус курса
    let status: 'not_started' | 'in_progress' | 'completed' = 'not_started';
    if (progress.status === 'completed' as const) {
      status = 'completed';
    } else if (progress.status === 'in_progress' as const) {
      status = 'in_progress';
    } else if (completedLessons > 0) {
      status = 'in_progress';
    }

    return {
      id: progress.id,
      courseId: course.id,
      title: course.title,
      description: course.description || "",
      imageUrl: course.coverImage || undefined,
      status,
      progress: progress.progressPercent,
      lessonsCompleted: completedLessons,
      totalLessons,
      lastAccessedAt: progress.lastViewedAt,
      completedAt: progress.completedAt || null,
      certificate: null // Пока без сертификатов, можно добавить позже
    };
  });
}

/**
 * Получение списка для продолжения обучения
 */
export async function getContinueLearning(userId: string): Promise<ContinueLearningItem[]> {
  const session = await auth();
  if (!session) {
    throw new Error("Пользователь не авторизован");
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    select: {
      id: true
    }
  });

  if (!profile) {
    throw new Error("Профиль пользователя не найден");
  }

  // Получаем курсы и модули, на которых пользователь остановился
  const progresses = await prisma.progress.findMany({
    where: {
      profileId: profile.id,
      content: {
        type: ContentType.COURSE
      },
      status: "in_progress" as const
    },
    include: {
      content: {
        select: {
          id: true,
          title: true,
          coverImage: true
        }
      }
    },
    take: 2 // Ограничиваем двумя последними
  });

  // Возвращаем только базовую информацию для отображения
  return progresses.map(progress => ({
    courseId: progress.content.id,
    title: progress.content.title,
    imageUrl: progress.content.coverImage || undefined,
    lastLesson: "Последний пройденный урок", // Можно улучшить, добавив информацию о последнем уроке
    progress: progress.progressPercent,
    timeRemaining: `${Math.max(1, 10 - Math.floor(progress.progressPercent / 10))} часов` // Приблизительно
  }));
}

/**
 * Получение сертификатов пользователя
 */
export async function getUserCertificates(userId: string): Promise<Certificate[]> {
  const session = await auth();
  if (!session) {
    throw new Error("Пользователь не авторизован");
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    select: {
      id: true
    }
  });

  if (!profile) {
    throw new Error("Профиль пользователя не найден");
  }

  // Находим завершенные курсы пользователя
  const completedCourses = await prisma.progress.findMany({
    where: {
      profileId: profile.id,
      status: "completed" as const,
      content: {
        type: ContentType.COURSE
      }
    },
    include: {
      content: {
        select: {
          id: true,
          title: true
        }
      }
    }
  });

  // Возвращаем сертификаты (в реальной реализации нужно хранить сертификаты отдельно)
  return completedCourses.map((course, index) => ({
    id: `cert_${course.content.id}`,
    courseName: course.content.title,
    issuedAt: course.completedAt || new Date(),
    imageUrl: `/images/certificates/${course.content.id}.jpg`,
    pdfUrl: `/certificates/${course.content.id}.pdf`
  }));
}