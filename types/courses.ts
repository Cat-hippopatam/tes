// types/courses.ts
export type CourseStatus = 'not_started' | 'in_progress' | 'completed'

export interface UserCourse {
  id: string
  courseId: string
  title: string
  description: string
  imageUrl?: string
  status: CourseStatus
  progress: number  // 0-100
  lessonsCompleted: number
  totalLessons: number
  lastAccessedAt: Date
  completedAt?: Date | null
  certificate?: Certificate | null
}

export interface Certificate {
  id: string
  courseName: string
  issuedAt: Date
  imageUrl: string
  pdfUrl: string
}

export interface ContinueLearningItem {
  courseId: string
  title: string
  imageUrl?: string
  lastLesson: string
  progress: number
  timeRemaining: string // например, "2 часа осталось"
}

export interface CourseStat {
  totalCourses: number
  completedCourses: number
  inProgressCourses: number
  totalCertificates: number
  totalHoursSpent: number
}