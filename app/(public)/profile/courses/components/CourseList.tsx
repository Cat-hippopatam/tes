// app/(public)/profile/courses/components/CourseList.tsx
'use client'

import { useState } from "react"
import { Card, CardBody, Progress, Chip, Tabs, Tab } from "@heroui/react"
import { 
  BookOpen, 
  CheckCircle, 
  Clock,
  Award,
  ChevronRight 
} from "lucide-react"
import { UserCourse, CourseStatus } from "@/types/courses"

interface CourseListProps {
  courses: UserCourse[]
}

const statusFilters: { key: CourseStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'Все курсы' },
  { key: 'in_progress', label: 'В процессе' },
  { key: 'completed', label: 'Завершенные' },
  { key: 'not_started', label: 'Не начатые' }
]

const statusConfig = {
  not_started: {
    icon: BookOpen,
    color: 'text-gray-600 bg-gray-50',
    label: 'Не начат'
  },
  in_progress: {
    icon: Clock,
    color: 'text-[#F4A261] bg-[#F4A261]/10',
    label: 'В процессе'
  },
  completed: {
    icon: CheckCircle,
    color: 'text-green-600 bg-green-50',
    label: 'Завершен'
  }
}

export function CourseList({ courses }: CourseListProps) {
  const [selectedFilter, setSelectedFilter] = useState<CourseStatus | 'all'>('all')

  const filteredCourses = courses.filter(course => 
    selectedFilter === 'all' ? true : course.status === selectedFilter
  )

  const getStatusColor = (status: CourseStatus) => {
    switch(status) {
      case 'not_started': return 'default'
      case 'in_progress': return 'warning'
      case 'completed': return 'success'
      default: return 'default'
    }
  }

  return (
    <Card className="border-none shadow-sm">
      <CardBody>
        {/* Фильтры */}
        <div className="mb-6">
          <Tabs 
            aria-label="Фильтр курсов"
            selectedKey={selectedFilter}
            onSelectionChange={(key) => setSelectedFilter(key as typeof selectedFilter)}
            color="warning"
            variant="light"
          >
            {statusFilters.map((filter) => (
              <Tab key={filter.key} title={filter.label} />
            ))}
          </Tabs>
        </div>

        {/* Список курсов */}
        <div className="space-y-4">
          {filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-[#6C757D] mx-auto mb-3" />
              <h3 className="text-[#264653] font-medium mb-1">
                Курсы не найдены
              </h3>
              <p className="text-[#6C757D] text-sm">
                Попробуйте изменить фильтр или выберите курс в каталоге
              </p>
            </div>
          ) : (
            filteredCourses.map((course) => {
              const StatusIcon = statusConfig[course.status].icon
              
              return (
                <div 
                  key={course.id}
                  className="flex items-start gap-4 p-4 bg-[#F8F9FA] rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group"
                >
                  {/* Превью */}
                  <div className="w-20 h-20 bg-gradient-to-br from-[#264653] to-[#1a353f] rounded-lg flex items-center justify-center text-white font-bold text-2xl shrink-0">
                    {course.title[0]}
                  </div>

                  {/* Информация */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold text-[#264653]">
                        {course.title}
                      </h3>
                      <Chip 
                        size="sm"
                        color={getStatusColor(course.status)}
                        variant="flat"
                        startContent={<StatusIcon className="w-3 h-3" />}
                      >
                        {statusConfig[course.status].label}
                      </Chip>
                    </div>

                    <p className="text-sm text-[#6C757D] mb-3 line-clamp-2">
                      {course.description}
                    </p>

                    {/* Прогресс */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#6C757D]">
                          Прогресс: {course.lessonsCompleted}/{course.totalLessons} уроков
                        </span>
                        <span className="font-medium text-[#264653]">
                          {course.progress}%
                        </span>
                      </div>
                      <Progress 
                        value={course.progress} 
                        size="sm"
                        classNames={{
                          indicator: course.status === 'completed' ? 'bg-green-500' : 'bg-[#F4A261]'
                        }}
                      />
                    </div>

                    {/* Сертификат для завершенных */}
                    {course.certificate && (
                      <div className="mt-3 flex items-center gap-2">
                        <Award className="w-4 h-4 text-purple-500" />
                        <span className="text-sm text-purple-600">
                          Сертификат получен
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Стрелка */}
                  <ChevronRight className="w-5 h-5 text-[#6C757D] group-hover:text-[#F4A261] transition-colors shrink-0" />
                </div>
              )
            })
          )}
        </div>
      </CardBody>
    </Card>
  )
}
