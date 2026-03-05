// app/(public)/profile/subscription/components/SubscriptionStatus.tsx
'use client'

import { Card, CardBody, CardHeader } from "@heroui/react"
import { 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  CreditCard,
  Zap,
  Briefcase,
  Star,
  XCircle,
  AlertTriangle
} from "lucide-react"
import { Subscription, SubscriptionPlan } from "@/types/subscription"

interface SubscriptionStatusProps {
  subscription: Subscription
}

const planIcons = {
  basic: Star,
  pro: Zap,
  business: Briefcase
}

const planColors = {
  basic: "text-blue-600 bg-blue-50",
  pro: "text-[#F4A261] bg-[#F4A261]/10",
  business: "text-green-600 bg-green-50"
}

// ✅ Теперь здесь ВСЕ возможные статусы
const statusConfig = {
  active: {
    icon: CheckCircle,
    color: "text-green-600 bg-green-50",
    text: "Активна"
  },
  trialing: {
    icon: Clock,
    color: "text-blue-600 bg-blue-50",
    text: "Пробный период"
  },
  past_due: {
    icon: AlertCircle,
    color: "text-red-600 bg-red-50",
    text: "Просрочена"
  },
  canceled: {
    icon: XCircle,
    color: "text-gray-600 bg-gray-50",
    text: "Отменена"
  },
  incomplete: {
    icon: AlertTriangle,
    color: "text-yellow-600 bg-yellow-50",
    text: "Требуется оплата"
  },
  incomplete_expired: {
    icon: XCircle,
    color: "text-red-600 bg-red-50",
    text: "Платеж не прошел"
  },
  unpaid: {
    icon: AlertCircle,
    color: "text-red-600 bg-red-50",
    text: "Не оплачено"
  }
} as const

export function SubscriptionStatus({ subscription }: SubscriptionStatusProps) {
  const StatusIcon = statusConfig[subscription.status]?.icon || AlertCircle
  const PlanIcon = planIcons[subscription.plan]

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return 'Не указано'
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(new Date(date))
  }

  const getPlanName = (plan: SubscriptionPlan) => {
    const plans = {
      basic: 'Базовый',
      pro: 'Профессиональный',
      business: 'Бизнес'
    }
    return plans[plan]
  }

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="flex gap-3">
        <div className={`p-3 rounded-xl ${planColors[subscription.plan]}`}>
          <PlanIcon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-[#264653]">
            Тариф {getPlanName(subscription.plan)}
          </h2>
          <p className="text-sm text-[#6C757D]">
            Ваш текущий тарифный план
          </p>
        </div>
        <div className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 ${statusConfig[subscription.status]?.color}`}>
          <StatusIcon className="w-4 h-4" />
          <span className="text-sm font-medium">
            {statusConfig[subscription.status]?.text}
          </span>
        </div>
      </CardHeader>
      <CardBody className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-[#6C757D] shrink-0" />
              <span className="text-[#6C757D]">Действует до:</span>
              <span className="font-medium text-[#264653]">
                {formatDate(subscription.currentPeriodEnd)}
              </span>
            </div>
            
            {subscription.trialEnd && (
              <div className="flex items-center gap-2 text-sm">
                <Star className="w-4 h-4 text-[#6C757D] shrink-0" />
                <span className="text-[#6C757D]">Пробный период до:</span>
                <span className="font-medium text-[#264653]">
                  {formatDate(subscription.trialEnd)}
                </span>
              </div>
            )}

            {subscription.cancelAtPeriodEnd && (
              <div className="mt-3 p-3 bg-orange-50 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                <p className="text-sm text-orange-700">
                  Подписка будет отменена после окончания текущего периода. 
                  Вы сможете пользоваться всеми функциями до {formatDate(subscription.currentPeriodEnd)}.
                </p>
              </div>
            )}
          </div>

          {subscription.paymentMethod && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CreditCard className="w-4 h-4 text-[#6C757D] shrink-0" />
                <span className="text-[#6C757D]">Способ оплаты:</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-[#F8F9FA] rounded-lg">
                <div className="w-10 h-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-white uppercase">
                    {subscription.paymentMethod.brand === 'visa' ? 'Visa' : 
                     subscription.paymentMethod.brand === 'mastercard' ? 'MC' : 'Card'}
                  </span>
                </div>
                <span className="font-mono text-[#264653]">
                  •••• {subscription.paymentMethod.last4}
                </span>
                <span className="text-sm text-[#6C757D]">
                  {subscription.paymentMethod.expMonth}/{subscription.paymentMethod.expYear}
                </span>
              </div>
              <button className="text-sm text-[#F4A261] hover:text-[#E76F51] transition-colors">
                Изменить способ оплаты
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100">
          <h3 className="text-sm font-medium text-[#264653] mb-3">Возможности тарифа:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              'Доступ ко всем курсам',
              'Персональные консультации',
              'Экспорт отчетов',
              'Приоритетная поддержка',
              'Доступ к вебинарам',
              'Сертификация'
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                <span className="text-[#6C757D]">{feature}</span>
              </div>
            ))}
          </div>
          <button className="mt-4 text-sm text-[#F4A261] hover:text-[#E76F51] transition-colors">
            Сравнить все тарифы →
          </button>
        </div>
      </CardBody>
    </Card>
  )
}