import { CreditParams, CreditResult, MonthlyPayment } from './types';

export function calculateCredit(params: CreditParams): CreditResult {
  const {
    amount,
    term,
    interestRate,
    paymentType,
    earlyRepayment
  } = params;

  const monthlyRate = interestRate / 100 / 12;
  const months = term;

  // Расчет графика платежей
  let schedule: MonthlyPayment[] = [];
  let totalInterest = 0;

  if (paymentType === 'annuity') {
    schedule = calculateAnnuitySchedule(amount, monthlyRate, months);
  } else {
    schedule = calculateDifferentiatedSchedule(amount, monthlyRate, months);
  }

  // Если есть досрочное погашение
  if (earlyRepayment && earlyRepayment.amount > 0) {
    const result = applyEarlyRepayment(schedule, earlyRepayment, monthlyRate);
    schedule = result.schedule;
    totalInterest = result.totalInterest;
  } else {
    totalInterest = schedule.reduce((sum, p) => sum + p.interest, 0);
  }

  const totalPayment = amount + totalInterest;
  const monthlyPayment = schedule[0]?.payment || 0;
  
  // Эффективная ставка (упрощенно)
  const effectiveRate = (totalInterest / amount / (term / 12)) * 100;

  const result: CreditResult = {
    monthlyPayment,
    totalPayment,
    totalInterest,
    overpayment: totalInterest,
    effectiveRate: Math.round(effectiveRate * 100) / 100,
    schedule
  };

  // Для дифференцированных добавляем min/max
  if (paymentType === 'differentiated') {
    result.monthlyMin = schedule[schedule.length - 1]?.payment;
    result.monthlyMax = schedule[0]?.payment;
  }

  // Если было досрочное погашение
  if (earlyRepayment && earlyRepayment.amount > 0) {
    const originalTotal = calculateCredit({ ...params, earlyRepayment: undefined });
    result.earlyRepayment = {
      savedInterest: originalTotal.totalInterest - totalInterest,
      newTerm: schedule.length,
      newPayment: schedule[0]?.payment
    };
  }

  return result;
}

function calculateAnnuitySchedule(
  amount: number,
  monthlyRate: number,
  months: number
): MonthlyPayment[] {
  const schedule: MonthlyPayment[] = [];
  
  // Аннуитетный платеж
  const annuityPayment = monthlyRate === 0 
    ? amount / months
    : amount * (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
      (Math.pow(1 + monthlyRate, months) - 1);
  
  let remainingDebt = amount;
  
  for (let month = 1; month <= months; month++) {
    const interestPayment = remainingDebt * monthlyRate;
    const principalPayment = annuityPayment - interestPayment;
    remainingDebt -= principalPayment;
    
    schedule.push({
      month,
      payment: annuityPayment,
      principal: principalPayment,
      interest: interestPayment,
      remainingDebt: Math.max(0, remainingDebt)
    });
  }
  
  return schedule;
}

function calculateDifferentiatedSchedule(
  amount: number,
  monthlyRate: number,
  months: number
): MonthlyPayment[] {
  const schedule: MonthlyPayment[] = [];
  const principalPart = amount / months;
  let remainingDebt = amount;
  
  for (let month = 1; month <= months; month++) {
    const interestPayment = remainingDebt * monthlyRate;
    const totalPayment = principalPart + interestPayment;
    remainingDebt -= principalPart;
    
    schedule.push({
      month,
      payment: totalPayment,
      principal: principalPart,
      interest: interestPayment,
      remainingDebt: Math.max(0, remainingDebt)
    });
  }
  
  return schedule;
}

function applyEarlyRepayment(
  originalSchedule: MonthlyPayment[],
  earlyRepayment: { month: number; amount: number; type: string },
  monthlyRate: number
): { schedule: MonthlyPayment[]; totalInterest: number } {
  const { month, amount, type } = earlyRepayment;
  
  // Находим месяц досрочного погашения
  const earlyMonth = originalSchedule[month - 1];
  if (!earlyMonth) return { schedule: originalSchedule, totalInterest: 0 };
  
  // Уменьшаем остаток долга
  const newRemainingDebt = earlyMonth.remainingDebt - amount;
  
  // Пересчитываем оставшиеся платежи
  const remainingMonths = originalSchedule.length - month;
  let newSchedule: MonthlyPayment[] = [];
  
  if (type === 'reduceTerm') {
    // Уменьшаем срок, платеж тот же
    newSchedule = calculateAnnuitySchedule(
      newRemainingDebt,
      monthlyRate,
      Math.ceil(remainingMonths * 0.8) // Примерно уменьшаем срок
    );
  } else {
    // Уменьшаем платеж, срок тот же
    newSchedule = calculateAnnuitySchedule(
      newRemainingDebt,
      monthlyRate,
      remainingMonths
    );
  }
  
  // Собираем полный график
  const fullSchedule = [
    ...originalSchedule.slice(0, month),
    ...newSchedule.map((p, idx) => ({
      ...p,
      month: month + idx + 1,
      isEarlyRepayment: idx === 0
    }))
  ];
  
  const totalInterest = fullSchedule.reduce((sum, p) => sum + p.interest, 0);
  
  return { schedule: fullSchedule, totalInterest };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}