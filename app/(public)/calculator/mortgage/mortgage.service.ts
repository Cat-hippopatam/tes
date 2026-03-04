import { MortgageParams, MortgageResult, MonthlyPayment, PaymentType } from './types';

export function calculateMortgage(params: MortgageParams): MortgageResult {
  const {
    propertyPrice,
    initialPayment,
    term,
    interestRate,
    paymentType,
    insurance
  } = params;

  const loanAmount = propertyPrice - initialPayment;
  const monthlyRate = interestRate / 100 / 12;
  const months = term * 12;

  // Расчет графика платежей
  const schedule: MonthlyPayment[] = [];
  let totalInterest = 0;
  let totalInsurance = 0;

  if (paymentType === 'annuity') {
    // Аннуитетный платеж (равными суммами)
    const annuityPayment = calculateAnnuityPayment(loanAmount, monthlyRate, months);
    
    let remainingDebt = loanAmount;
    for (let month = 1; month <= months; month++) {
      const interestPayment = remainingDebt * monthlyRate;
      const principalPayment = annuityPayment - interestPayment;
      remainingDebt -= principalPayment;
      
      // Страховка (упрощенно: 0.1% от остатка в месяц)
      const insurancePayment = calculateInsurance(insurance, remainingDebt + principalPayment);
      totalInsurance += insurancePayment;

      schedule.push({
        month,
        payment: annuityPayment,
        principal: principalPayment,
        interest: interestPayment,
        remainingDebt: Math.max(0, remainingDebt),
        insurancePayment
      });

      totalInterest += interestPayment;
    }

    return {
      monthlyPayment: annuityPayment,
      totalPayment: annuityPayment * months,
      totalInterest,
      totalInsurance,
      overpayment: totalInterest + totalInsurance,
      loanAmount,
      schedule
    };

  } else {
    // Дифференцированный платеж (уменьшается)
    const principalPart = loanAmount / months;
    let remainingDebt = loanAmount;
    let maxPayment = 0;
    let minPayment = Infinity;

    for (let month = 1; month <= months; month++) {
      const interestPayment = remainingDebt * monthlyRate;
      const totalPayment = principalPart + interestPayment;
      
      maxPayment = Math.max(maxPayment, totalPayment);
      minPayment = Math.min(minPayment, totalPayment);

      const insurancePayment = calculateInsurance(insurance, remainingDebt);
      totalInsurance += insurancePayment;

      schedule.push({
        month,
        payment: totalPayment,
        principal: principalPart,
        interest: interestPayment,
        remainingDebt: remainingDebt - principalPart,
        insurancePayment
      });

      totalInterest += interestPayment;
      remainingDebt -= principalPart;
    }

    return {
      monthlyPayment: schedule[0].payment,
      monthlyMin: minPayment,
      monthlyMax: maxPayment,
      totalPayment: loanAmount + totalInterest,
      totalInterest,
      totalInsurance,
      overpayment: totalInterest + totalInsurance,
      loanAmount,
      schedule
    };
  }
}

function calculateAnnuityPayment(loanAmount: number, monthlyRate: number, months: number): number {
  if (monthlyRate === 0) return loanAmount / months;
  
  return loanAmount * 
    (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
    (Math.pow(1 + monthlyRate, months) - 1);
}

function calculateInsurance(type: string, debt: number): number {
  switch(type) {
    case 'life':
      return debt * 0.0005; // 0.05% от остатка
    case 'property':
      return debt * 0.0003; // 0.03% от остатка
    case 'both':
      return debt * 0.0007; // 0.07% от остатка
    default:
      return 0;
  }
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}