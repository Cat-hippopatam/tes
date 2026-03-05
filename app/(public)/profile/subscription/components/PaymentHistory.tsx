// app/(public)/profile/subscription/components/PaymentHistory.tsx
'use client'

import { Card, CardBody, CardHeader } from "@heroui/react"
import { 
  History, 
  Download, 
  CheckCircle, 
  XCircle, 
  Clock,
  FileText 
} from "lucide-react"
import { PaymentHistoryItem } from "@/types/subscription"

// Мок-данные для истории платежей
const mockPayments: PaymentHistoryItem[] = [
  {
    id: '1',
    date: new Date(2024, 1, 15),
    amount: 2990,
    currency: 'RUB',
    status: 'succeeded',
    description: 'Подписка Pro - март 2024',
    invoiceUrl: '#'
  },
  {
    id: '2',
    date: new Date(2024, 0, 15),
    amount: 2990,
    currency: 'RUB',
    status: 'succeeded',
    description: 'Подписка Pro - февраль 2024',
    invoiceUrl: '#'
  },
  {
    id: '3',
    date: new Date(2023, 11, 15),
    amount: 2990,
    currency: 'RUB',
    status: 'succeeded',
    description: 'Подписка Pro - январь 2024',
    invoiceUrl: '#'
  },
  {
    id: '4',
    date: new Date(2023, 10, 15),
    amount: 990,
    currency: 'RUB',
    status: 'succeeded',
    description: 'Подписка Basic - декабрь 2023',
    invoiceUrl: '#'
  }
]

const statusIcons = {
  succeeded: CheckCircle,
  pending: Clock,
  failed: XCircle
}

const statusColors = {
  succeeded: 'text-green-600 bg-green-50',
  pending: 'text-yellow-600 bg-yellow-50',
  failed: 'text-red-600 bg-red-50'
}

const statusText = {
  succeeded: 'Оплачено',
  pending: 'В обработке',
  failed: 'Ошибка'
}

export function PaymentHistory() {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date)
  }

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-[#F4A261]/10">
          <History className="w-6 h-6 text-[#F4A261]" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-[#264653]">История платежей</h2>
          <p className="text-sm text-[#6C757D]">
            Последние 10 транзакций по вашей подписке
          </p>
        </div>
      </CardHeader>
      <CardBody className="pt-0">
        <div className="space-y-3">
          {mockPayments.map((payment) => {
            const StatusIcon = statusIcons[payment.status]
            
            return (
              <div 
                key={payment.id}
                className="flex items-center justify-between p-4 bg-[#F8F9FA] rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${statusColors[payment.status]}`}>
                    <StatusIcon className="w-4 h-4" />
                  </div>
                  
                  <div>
                    <p className="font-medium text-[#264653]">
                      {payment.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-[#6C757D]">
                        {formatDate(payment.date)}
                      </span>
                      <span className="w-1 h-1 bg-[#6C757D] rounded-full" />
                      <span className={`text-sm font-medium ${
                        payment.status === 'succeeded' ? 'text-green-600' :
                        payment.status === 'pending' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {statusText[payment.status]}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-semibold text-[#264653]">
                    {formatAmount(payment.amount, payment.currency)}
                  </span>
                  
                  {payment.invoiceUrl && (
                    <button 
                      className="p-2 hover:bg-white rounded-lg transition-colors"
                      title="Скачать чек"
                    >
                      <Download className="w-4 h-4 text-[#6C757D]" />
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {mockPayments.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-[#6C757D] mx-auto mb-3" />
            <h3 className="text-[#264653] font-medium mb-1">История платежей пуста</h3>
            <p className="text-[#6C757D] text-sm">
              Здесь будут отображаться все ваши транзакции
            </p>
          </div>
        )}
      </CardBody>
    </Card>
  )
}
