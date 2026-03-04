export type PaymentType = 'annuity' | 'differentiated';
export type EarlyRepaymentType = 'reduceTerm' | 'reducePayment';

export interface CreditParams {
  amount: number;              // сумма кредита (₽)
  term: number;                // срок в месяцах
  interestRate: number;        // годовая ставка (%)
  paymentType: PaymentType;    // тип платежа
  earlyRepayment?: {
    month: number;             // месяц досрочного погашения
    amount: number;            // сумма досрочного погашения
    type: EarlyRepaymentType;  // уменьшить срок или платеж
  };
}

export interface MonthlyPayment {
  month: number;
  payment: number;              // общий платеж
  principal: number;            // основной долг
  interest: number;             // проценты
  remainingDebt: number;        // остаток долга
  isEarlyRepayment?: boolean;   // был ли досрочный платеж
}

export interface CreditResult {
  monthlyPayment: number;       // средний/первый платеж
  monthlyMin?: number;          // мин платеж (для дифф.)
  monthlyMax?: number;          // макс платеж (для дифф.)
  totalPayment: number;         // общая выплата
  totalInterest: number;        // переплата по процентам
  overpayment: number;          // общая переплата
  effectiveRate: number;        // эффективная ставка
  schedule: MonthlyPayment[];   // график по месяцам
  earlyRepayment?: {
    savedInterest: number;      // сэкономленные проценты
    newTerm: number;            // новый срок (если уменьшали срок)
    newPayment: number;         // новый платеж (если уменьшали платеж)
  };
}