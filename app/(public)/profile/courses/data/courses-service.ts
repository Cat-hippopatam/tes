import { auth } from "@/auth/auth";
import { prisma } from "@/utils/lib/prisma";
import { UserCourse, ContinueLearningItem, CourseStat, MockCertificate } from "@/types/courses";
import { ContentType } from "@prisma/client";

/**
 * Получение статистики курсов пользователя
 */
export async function getCourseStats(): Promise<CourseStat> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Пользователь не авторизован");
  }

  // Получаем профиль пользователя
  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    select: { id: true }
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
  const completedCourses = progresses.filter(p => p.status === "completed").length;
  const inProgressCourses = progresses.filter(p => p.status === "in_progress").length;

  // Получаем количество сертификатов
  const completedCoursesIds = progresses
    .filter(p => p.status === "completed")
    .map(p => p.content.id);
  
  const totalCertificates = await prisma.certificate.count({
    where: {
      profileId: profile.id,
      contentId: { in: completedCoursesIds }
    }
  });

  // Вычисляем общее время обучения (приближенно)
  const totalHoursSpent = progresses.reduce((sum: number, progress) => {
    return sum + Math.floor(progress.progressPercent / 10);
  }, 0);

  return {
    totalCourses,
    completedCourses,
    inProgressCourses,
    totalCertificates,
    totalLessons: 0, // TODO: рассчитать реальное значение
    completedLessons: 0, // TODO: рассчитать реальное значение
    totalHoursSpent
  };
}

/**
 * Получение курсов пользователя
 */
export async function getUserCourses(): Promise<UserCourse[]> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Пользователь не авторизован");
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    select: { id: true }
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
          courseModules: {
            include: {
              lessons: {
                where: {
                  status: "PUBLISHED"
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
    const course = progress.content as any;
    
    // Считаем общее количество уроков через courseModules
    const courseModules = course.courseModules || [];
    let totalLessons = 0;
    for (const mod of courseModules) {
      totalLessons += mod.lessons?.length || 0;
    }
    
    const completedLessons = progress.completedLessons;

    // Определяем статус курса
    let status: 'not_started' | 'in_progress' | 'completed' = 'not_started';
    if (progress.status === 'completed') {
      status = 'completed';
    } else if (progress.status === 'in_progress' || completedLessons > 0) {
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
      completedAt: progress.completedAt,
      certificate: null
    };
  });
}

/**
 * Получение списка для продолжения обучения
 */
export async function getContinueLearning(): Promise<ContinueLearningItem[]> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Пользователь не авторизован");
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    select: { id: true }
  });

  if (!profile) {
    throw new Error("Профиль пользователя не найден");
  }

  // Получаем курсы, на которых пользователь остановился
  const progresses = await prisma.progress.findMany({
    where: {
      profileId: profile.id,
      content: {
        type: ContentType.COURSE
      },
      status: "in_progress"
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
    take: 2,
    orderBy: {
      lastViewedAt: 'desc'
    }
  });

  return progresses.map(progress => ({
    courseId: progress.content.id,
    title: progress.content.title,
    imageUrl: progress.content.coverImage || undefined,
    lastLesson: "Продолжить обучение",
    progress: progress.progressPercent,
    timeRemaining: `${Math.max(1, 10 - Math.floor(progress.progressPercent / 10))} ч`,
    updatedAt: progress.lastViewedAt || new Date()
  }));
}

/**
 * Получение сертификатов пользователя
 */
export async function getUserCertificates(): Promise<MockCertificate[]> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Пользователь не авторизован");
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    select: { id: true }
  });

  if (!profile) {
    throw new Error("Профиль пользователя не найден");
  }

  // Получаем сертификаты пользователя
  const certificates = await prisma.certificate.findMany({
    where: {
      profileId: profile.id
    },
    include: {
      content: {
        select: {
          title: true
        }
      }
    },
    orderBy: {
      issuedAt: 'desc'
    }
  });

  return certificates.map(cert => ({
    id: cert.id,
    courseName: cert.content.title,
    issuedAt: cert.issuedAt,
    imageUrl: cert.imageUrl || `/images/certificates/default.jpg`,
    pdfUrl: cert.pdfUrl || '#'
  }));
}