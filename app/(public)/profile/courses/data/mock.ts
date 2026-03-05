// app/(public)/profile/courses/data/mock.ts
import { UserCourse, Certificate, ContinueLearningItem, CourseStat } from "@/types/courses"

export const mockUserCourses: UserCourse[] = [
  {
    id: '1',
    courseId: 'course_1',
    title: 'Основы финансовой грамотности',
    description: 'Научитесь управлять личными финансами, составлять бюджет и планировать расходы',
    imageUrl: '/images/courses/finance-basics.jpg',
    status: 'in_progress',
    progress: 75,
    lessonsCompleted: 6,
    totalLessons: 8,
    lastAccessedAt: new Date(2024, 2, 4),
    completedAt: null,
    certificate: null
  },
  {
    id: '2',
    courseId: 'course_2',
    title: 'Инвестиции для начинающих',
    description: 'Разберитесь в основах инвестирования: акции, облигации, ETF и диверсификация',
    imageUrl: '/images/courses/investing.jpg',
    status: 'in_progress',
    progress: 30,
    lessonsCompleted: 3,
    totalLessons: 10,
    lastAccessedAt: new Date(2024, 2, 3),
    completedAt: null,
    certificate: null
  },
  {
    id: '3',
    courseId: 'course_3',
    title: 'Налоговая грамотность',
    description: 'Как законно экономить на налогах, оформлять вычеты и подавать декларации',
    imageUrl: '/images/courses/taxes.jpg',
    status: 'completed',
    progress: 100,
    lessonsCompleted: 12,
    totalLessons: 12,
    lastAccessedAt: new Date(2024, 1, 28),
    completedAt: new Date(2024, 1, 28),
    certificate: {
      id: 'cert_1',
      courseName: 'Налоговая грамотность',
      issuedAt: new Date(2024, 1, 28),
      imageUrl: '/images/certificates/taxes.jpg',
      pdfUrl: '/certificates/taxes.pdf'
    }
  },
  {
    id: '4',
    courseId: 'course_4',
    title: 'Пенсионные накопления',
    description: 'Как обеспечить достойную пенсию и использовать государственные программы',
    imageUrl: '/images/courses/pension.jpg',
    status: 'not_started',
    progress: 0,
    lessonsCompleted: 0,
    totalLessons: 6,
    lastAccessedAt: new Date(2024, 2, 1),
    completedAt: null,
    certificate: null
  }
]

export const mockContinueLearning: ContinueLearningItem[] = [
  {
    courseId: 'course_1',
    title: 'Основы финансовой грамотности',
    imageUrl: '/images/courses/finance-basics.jpg',
    lastLesson: 'Урок 6: Инвестиционные инструменты',
    progress: 75,
    timeRemaining: '2 часа'
  },
  {
    courseId: 'course_2',
    title: 'Инвестиции для начинающих',
    imageUrl: '/images/courses/investing.jpg',
    lastLesson: 'Урок 3: Акции и облигации',
    progress: 30,
    timeRemaining: '5 часов'
  }
]

export const mockCertificates: Certificate[] = [
  {
    id: 'cert_1',
    courseName: 'Налоговая грамотность',
    issuedAt: new Date(2024, 1, 28),
    imageUrl: '/images/certificates/taxes.jpg',
    pdfUrl: '/certificates/taxes.pdf'
  }
]

export const mockCourseStats: CourseStat = {
  totalCourses: 8,
  completedCourses: 1,
  inProgressCourses: 2,
  totalCertificates: 1,
  totalHoursSpent: 18
}