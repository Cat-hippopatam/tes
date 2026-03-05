// app/(public)/profile/subscription/page.tsx
import { auth } from "@/auth/auth"
import { redirect } from "next/navigation"
import { SubscriptionStatus } from "./components/SubscriptionStatus"
import { PaymentHistory } from "./components/PaymentHistory"
import { CancelSubscription } from "./components/CancelSubscription"
import { Subscription } from "@/types/subscription"

// Функция для получения даты на сервере (чистая функция)
function getFutureDate(days: number): Date {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date
}

export default async function SubscriptionPage() {
  const session = await auth()
  
  if (!session) {
    redirect("/login")
  }

  // Здесь потом будет запрос к базе
  // Пока используем мок-данные с правильными типами
  const subscriptionData: Subscription = {
    id: 'sub_123',
    status: 'active',
    plan: 'pro',
    currentPeriodStart: new Date(), // сегодня
    currentPeriodEnd: getFutureDate(30), // через 30 дней (чистая функция)
    cancelAtPeriodEnd: false,
    trialStart: null,
    trialEnd: null,
    paymentMethod: {
      id: 'pm_123',
      brand: 'visa',
      last4: '4242',
      expMonth: 12,
      expYear: 2025,
      isDefault: true
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#264653]">Управление подпиской</h1>
        <p className="text-[#6C757D] mt-1">
          Управляйте своей подпиской, способами оплаты и просматривайте историю платежей
        </p>
      </div>

      <div className="grid gap-6">
        <SubscriptionStatus subscription={subscriptionData} />
        <PaymentHistory />
        <CancelSubscription 
          cancelAtPeriodEnd={subscriptionData.cancelAtPeriodEnd}
          status={subscriptionData.status}
        />
      </div>
    </div>
  )
}