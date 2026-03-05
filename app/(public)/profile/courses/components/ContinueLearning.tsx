// app/(public)/profile/courses/components/ContinueLearning.tsx
'use client'

import { Card, CardBody, CardHeader, Progress } from "@heroui/react"
import { PlayCircle, Clock } from "lucide-react"
import { ContinueLearningItem } from "@/types/courses"

interface ContinueLearningProps {
  items: ContinueLearningItem[]
}

export function ContinueLearning({ items }: ContinueLearningProps) {
  if (items.length === 0) {
    return (
      <Card className="border-none shadow-sm">
        <CardBody className="p-8 text-center">
          <PlayCircle className="w-12 h-12 text-[#6C757D] mx-auto mb-3" />
          <h3 className="text-[#264653] font-medium mb-1">
            Нет активных курсов
          </h3>
          <p className="text-[#6C757D] text-sm">
            Начните обучение с любого курса в каталоге
          </p>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-[#264653]">
          Продолжить обучение
        </h2>
        <button className="text-sm text-[#F4A261] hover:text-[#E76F51] transition-colors">
          Все курсы →
        </button>
      </CardHeader>
      <CardBody className="pt-0">
        <div className="space-y-4">
          {items.map((item) => (
            <div 
              key={item.courseId}
              className="flex items-center gap-4 p-4 bg-[#F8F9FA] rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              {/* Превью курса */}
              <div className="w-16 h-16 bg-gradient-to-br from-[#F4A261] to-[#E76F51] rounded-lg flex items-center justify-center text-white font-bold text-xl shrink-0">
                {item.title[0]}
              </div>

              {/* Информация о курсе */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-[#264653] mb-1 truncate">
                  {item.title}
                </h3>
                <p className="text-sm text-[#6C757D] mb-2 truncate">
                  {item.lastLesson}
                </p>
                
                {/* Прогресс */}
                <div className="flex items-center gap-3">
                  <Progress 
                    value={item.progress} 
                    className="flex-1"
                    size="sm"
                    classNames={{
                      indicator: "bg-[#F4A261]"
                    }}
                  />
                  <span className="text-xs text-[#6C757D] whitespace-nowrap">
                    {item.progress}%
                  </span>
                </div>
              </div>

              {/* Время */}
              <div className="flex items-center gap-1 text-sm text-[#6C757D] shrink-0">
                <Clock className="w-4 h-4" />
                <span>{item.timeRemaining}</span>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  )
}