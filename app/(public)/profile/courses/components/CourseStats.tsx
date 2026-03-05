// app/(public)/profile/courses/components/CourseStats.tsx
'use client'

import { Card, CardBody } from "@heroui/react"
import { 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Award,
  TrendingUp 
} from "lucide-react"
import { CourseStat } from "@/types/courses"

interface CourseStatsProps {
  stats: CourseStat
}

export function CourseStats({ stats }: CourseStatsProps) {
  const statItems = [
    {
      label: 'Всего курсов',
      value: stats.totalCourses,
      icon: BookOpen,
      color: 'text-blue-600 bg-blue-50'
    },
    {
      label: 'В процессе',
      value: stats.inProgressCourses,
      icon: TrendingUp,
      color: 'text-[#F4A261] bg-[#F4A261]/10'
    },
    {
      label: 'Завершено',
      value: stats.completedCourses,
      icon: CheckCircle,
      color: 'text-green-600 bg-green-50'
    },
    {
      label: 'Сертификатов',
      value: stats.totalCertificates,
      icon: Award,
      color: 'text-purple-600 bg-purple-50'
    },
    {
      label: 'Часов обучения',
      value: stats.totalHoursSpent,
      icon: Clock,
      color: 'text-gray-600 bg-gray-50'
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {statItems.map((item) => {
        const Icon = item.icon
        return (
          <Card key={item.label} className="border-none shadow-sm">
            <CardBody className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-[#264653]">
                    {item.value}
                  </p>
                  <p className="text-xs text-[#6C757D]">
                    {item.label}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        )
      })}
    </div>
  )
}