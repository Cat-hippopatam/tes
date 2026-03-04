export type PaymentType = 'annuity' | 'differentiated';
export type InsuranceType = 'none' | 'life' | 'property' | 'both';

export interface MortgageParams {
  propertyPrice: number;        // стоимость недвижимости (₽)
  initialPayment: number;       // первоначальный взнос (₽)
  initialPaymentPercent: number; // % от стоимости (для слайдера)
  term: number;                 // срок в годах (1-30)
  interestRate: number;         // годовая ставка (%)
  paymentType: PaymentType;     // тип платежа
  insurance: InsuranceType;     // страхование
}

export interface MonthlyPayment {
  month: number;
  payment: number;              // общий платеж
  principal: number;            // основной долг
  interest: number;             // проценты
  remainingDebt: number;        // остаток долга
  insurancePayment?: number;    // страхование (если есть)
}

export interface MortgageResult {
  monthlyPayment: number;       // средний/первый платеж
  totalPayment: number;         // общая выплата
  totalInterest: number;        // переплата по процентам
  totalInsurance: number;       // всего страховка
  overpayment: number;          // общая переплата
  loanAmount: number;           // сумма кредита
  schedule: MonthlyPayment[];   // график по месяцам
  monthlyMin?: number;          // мин платеж (для дифф.)
  monthlyMax?: number;          // макс платеж (для дифф.)
}
