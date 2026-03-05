// types/courses.ts
import { Content, Module, Progress, Certificate } from "@prisma/client"

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
  id: string
  title: string
  image?: string | null
  lastModuleId: string
  lastLessonId: string
  progress: number
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