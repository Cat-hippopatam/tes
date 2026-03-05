// app/(public)/profile/courses/components/Certificates.tsx
'use client'

import { Card, CardBody, CardHeader } from "@heroui/react"
import { Award, Download, ExternalLink } from "lucide-react"
import { Certificate } from "@/types/courses"

interface CertificatesProps {
  certificates: Certificate[]
}

export function Certificates({ certificates }: CertificatesProps) {
  if (certificates.length === 0) {
    return (
      <Card className="border-none shadow-sm">
        <CardBody className="p-8 text-center">
          <Award className="w-12 h-12 text-[#6C757D] mx-auto mb-3" />
          <h3 className="text-[#264653] font-medium mb-1">
            Пока нет сертификатов
          </h3>
          <p className="text-[#6C757D] text-sm">
            Завершите курс, чтобы получить сертификат
          </p>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <h2 className="text-lg font-semibold text-[#264653]">
          Мои сертификаты
        </h2>
      </CardHeader>
      <CardBody className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certificates.map((cert) => (
            <div 
              key={cert.id}
              className="flex gap-4 p-4 bg-[#F8F9FA] rounded-lg hover:bg-gray-100 transition-colors"
            >
              {/* Иконка */}
              <div className="p-3 bg-gradient-to-br from-[#F4A261] to-[#E76F51] rounded-lg">
                <Award className="w-6 h-6 text-white" />
              </div>

              {/* Информация */}
              <div className="flex-1">
                <h3 className="font-medium text-[#264653] mb-1">
                  {cert.courseName}
                </h3>
                <p className="text-sm text-[#6C757D] mb-2">
                  Выдан: {new Intl.DateTimeFormat('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  }).format(new Date(cert.issuedAt))}
                </p>

                {/* Кнопки */}
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-1 text-sm text-[#F4A261] hover:text-[#E76F51] transition-colors">
                    <Download className="w-4 h-4" />
                    Скачать PDF
                  </button>
                  <button className="flex items-center gap-1 text-sm text-[#F4A261] hover:text-[#E76F51] transition-colors">
                    <ExternalLink className="w-4 h-4" />
                    Посмотреть
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  )
}
