// types/courses.ts
import { Content, Module, Progress, Certificate } from "@prisma/client"

export type { Certificate }

// Статусы курса
export type CourseStatus = 'not_started' | 'in_progress' | 'completed'

// Тип для списка курсов пользователя
export type UserCourse = {
  id: string
  courseId: string
  title: string
  description?: string
  imageUrl?: string | null
  status: CourseStatus
  progress: number
  lessonsCompleted: number
  totalLessons: number
  lastAccessedAt?: Date | null
  completedAt?: Date | null
  certificate?: MockCertificate | null
}

// Моковый сертификат с дополнительными полями для UI
export interface MockCertificate {
  id: string
  courseName?: string
  issuedAt: Date
  imageUrl: string
  pdfUrl?: string
  // Дополнительные поля из Prisma (опционально)
  createdAt?: Date
  updatedAt?: Date
  contentId?: string
  profileId?: string
  content?: any
  profile?: any
  completedAt?: Date | null
  certificateNumber?: string
  metadata?: Record<string, any> | null
}

export type ModuleWithLessons = Module & {
  lessons: Content[]
}

export type ContentWithModules = Content & {
  modules: ModuleWithLessons[]
  progress: Progress[]
  certificates: Certificate[]
}

export type CourseWithProgress = ContentWithModules & {
  totalLessons: number
  completedLessons: number
  progressPercent: number
  certificate?: Certificate | null
}

export type ContinueLearningItem = {
  id?: string
  courseId: string
  title: string
  image?: string | null
  imageUrl?: string | null
  lastModuleId?: string
  lastLessonId?: string
  lastLesson?: string
  progress: number
  timeRemaining?: string
  updatedAt: Date
}

export type CoursesStats = {
  totalCourses: number
  completedCourses: number
  inProgressCourses: number
  totalCertificates: number
  totalLessons: number
  completedLessons: number
}

// Алиас для совместимости
export type CourseStat = CoursesStats & {
  totalHoursSpent?: number
}