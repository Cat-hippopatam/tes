// types/subscription.ts
export type SubscriptionStatus = 'active' | 'trialing' | 'past_due' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'unpaid'
export type SubscriptionPlan = 'basic' | 'pro' | 'business'

export interface Subscription {
  id: string
  status: SubscriptionStatus
  plan: SubscriptionPlan
  currentPeriodStart: Date
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
  trialStart?: Date | null
  trialEnd?: Date | null
  paymentMethod?: PaymentMethod | null
}

export interface PaymentMethod {
  id: string
  brand: string
  last4: string
  expMonth: number
  expYear: number
  isDefault: boolean
}

export interface PaymentHistoryItem {
  id: string
  date: Date
  amount: number
  currency: string
  status: 'succeeded' | 'pending' | 'failed'
  description: string
  invoiceUrl?: string
}

export interface PlanDetails {
  id: SubscriptionPlan
  name: string
  price: number
  interval: 'month' | 'year'
  features: string[]
  recommended?: boolean
}