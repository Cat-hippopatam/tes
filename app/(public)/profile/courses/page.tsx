// app/(public)/profile/courses/page.tsx
import { auth } from "@/auth/auth"
import { redirect } from "next/navigation"
import { CourseStats } from "./components/CourseStats"
import { ContinueLearning } from "./components/ContinueLearning"
import { CourseList } from "./components/CourseList"
import { Certificates } from "./components/Certificates"
import { 
  mockUserCourses, 
  mockContinueLearning, 
  mockCertificates,
  mockCourseStats 
} from "./data/mock"

export default async function CoursesPage() {
  const session = await auth()
  
  if (!session) {
    redirect("/login")
  }

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div>
        <h1 className="text-2xl font-semibold text-[#264653]">Мои курсы</h1>
        <p className="text-[#6C757D] mt-1">
          Отслеживайте прогресс обучения и получайте сертификаты
        </p>
      </div>

      {/* Статистика */}
      <CourseStats stats={mockCourseStats} />

      {/* Продолжить обучение */}
      <ContinueLearning items={mockContinueLearning} />

      {/* Список курсов */}
      <CourseList courses={mockUserCourses} />

      {/* Сертификаты */}
      <Certificates certificates={mockCertificates} />
    </div>
  )
}