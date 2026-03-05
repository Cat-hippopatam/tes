// app/(public)/profile/subscription/components/CancelSubscription.tsx
'use client'

import { useState } from "react"
import { Card, CardBody } from "@heroui/react"
import { AlertCircle, XCircle } from "lucide-react"
import ConfirmationModal from "@/components/UI/modals/ConfirmModal"

interface CancelSubscriptionProps {
  cancelAtPeriodEnd: boolean
  status: string
}

export function CancelSubscription({ cancelAtPeriodEnd, status }: CancelSubscriptionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Если подписка уже отменена или неактивна
  if (cancelAtPeriodEnd || status === 'canceled') {
    return (
      <Card className="border-none shadow-sm bg-orange-50">
        <CardBody>
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-orange-800 mb-1">
                Подписка будет отменена
              </h3>
              <p className="text-sm text-orange-700">
                Ваша подписка активна до конца текущего периода. 
                После этого вы потеряете доступ к платным материалам.
              </p>
              <button 
                className="mt-3 text-sm text-orange-700 hover:text-orange-800 underline"
                onClick={() => {/* Возобновить подписку */}}
              >
                Возобновить подписку
              </button>
            </div>
          </div>
        </CardBody>
      </Card>
    )
  }

  const handleCancelSubscription = async () => {
    setIsLoading(true)
    try {
      // Здесь будет API запрос
      await new Promise(resolve => setTimeout(resolve, 1500))
      console.log('Подписка отменена')
      setIsModalOpen(false)
      // Обновить страницу или показать сообщение
    } catch (error) {
      console.error('Ошибка при отмене подписки:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Card className="border-none shadow-sm border border-red-100">
        <CardBody>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-50 rounded-lg">
                <XCircle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-medium text-[#264653] mb-1">
                  Отмена подписки
                </h3>
                <p className="text-sm text-[#6C757D] max-w-2xl">
                  После отмены подписки вы потеряете доступ к платным материалам 
                  в конце текущего расчетного периода. Все сохраненные данные останутся 
                  в вашем аккаунте.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:text-white bg-red-50 hover:bg-red-600 rounded-lg transition-colors"
            >
              Отменить подписку
            </button>
          </div>
        </CardBody>
      </Card>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleCancelSubscription}
        title="Отмена подписки"
        message="Вы уверены, что хотите отменить подписку? Вы потеряете доступ ко всем платным материалам в конце текущего периода."
        confirmText="Да, отменить"
        cancelText="Нет, оставить"
        variant="danger"
        isLoading={isLoading}
      />
    </>
  )
}