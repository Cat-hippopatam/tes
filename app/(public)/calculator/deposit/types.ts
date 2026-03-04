export type CapitalizationPeriod = 'monthly' | 'quarterly' | 'yearly' | 'none';

export type TaxRate = 0 | 13 | 15; // 0 - нерезидент, 13% - резидент, 15% - >5млн

export interface DepositInput {
  initialAmount: number;        // начальная сумма
  monthlyAddition: number;       // ежемесячное пополнение
  interestRate: number;          // годовая ставка (%)
  term: number;                  // срок (месяцев)
  capitalization: CapitalizationPeriod;
  taxRate: TaxRate;              // ставка налога
  enablePartialWithdrawals?: boolean; // разрешить частичные снятия
}

export interface DepositMonth {
  month: number;
  date: string;
  startBalance: number;
  addition: number;
  interest: number;
  tax: number;
  endBalance: number;
  totalInterest: number;
  totalTax: number;
}

export interface DepositResult {
  months: DepositMonth[];
  finalAmount: number;
  totalInterest: number;
  totalTax: number;
  totalAdded: number;
  effectiveRate: number;         // эффективная ставка с учетом капитализации
  profit: number;                // чистая прибыль
}