import { DepositInput, DepositResult, DepositMonth, CapitalizationPeriod } from './types';

export class DepositCalculator {
  static calculate(input: DepositInput): DepositResult {
    const months: DepositMonth[] = [];
    let balance = input.initialAmount;
    let totalInterest = 0;
    let totalTax = 0;
    let totalAdded = 0;

    const monthlyRate = input.interestRate / 100 / 12;
    const today = new Date();

    for (let month = 1; month <= input.term; month++) {
      const startBalance = balance;
      
      // Добавляем пополнение (в начале месяца)
      const addition = input.monthlyAddition;
      balance += addition;
      totalAdded += addition;

      // Расчет процентов за месяц
      const monthlyInterest = balance * monthlyRate;
      
      // Капитализация процентов
      const shouldCapitalize = this.shouldCapitalize(month, input.term, input.capitalization);
      
      // Расчет налога (только если процентный доход превышает лимит)
      // Упрощенно: налог на весь процентный доход по ставке
      const monthlyTax = monthlyInterest * (input.taxRate / 100);
      
      if (shouldCapitalize) {
        // Проценты прибавляются к телу вклада
        balance += monthlyInterest - monthlyTax;
      }
      
      totalInterest += monthlyInterest;
      totalTax += monthlyTax;

      const monthData: DepositMonth = {
        month,
        date: new Date(today.getFullYear(), today.getMonth() + month, today.getDate()).toLocaleDateString('ru-RU'),
        startBalance: Math.round(startBalance * 100) / 100,
        addition: Math.round(addition * 100) / 100,
        interest: Math.round(monthlyInterest * 100) / 100,
        tax: Math.round(monthlyTax * 100) / 100,
        endBalance: Math.round(balance * 100) / 100,
        totalInterest: Math.round(totalInterest * 100) / 100,
        totalTax: Math.round(totalTax * 100) / 100,
      };
      
      months.push(monthData);
    }

    // Расчет эффективной ставки
    const effectiveRate = this.calculateEffectiveRate(input, totalInterest);
    
    return {
      months,
      finalAmount: Math.round(balance * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      totalTax: Math.round(totalTax * 100) / 100,
      totalAdded: Math.round(totalAdded * 100) / 100,
      effectiveRate: Math.round(effectiveRate * 100) / 100,
      profit: Math.round((totalInterest - totalTax) * 100) / 100,
    };
  }

  private static shouldCapitalize(month: number, totalMonths: number, period: CapitalizationPeriod): boolean {
    switch (period) {
      case 'monthly':
        return true; // каждый месяц
      case 'quarterly':
        return month % 3 === 0;
      case 'yearly':
        return month % 12 === 0;
      case 'none':
        return month === totalMonths; // только в конце срока
      default:
        return false;
    }
  }

  private static calculateEffectiveRate(input: DepositInput, totalInterest: number): number {
    // Упрощенный расчет эффективной ставки
    const averageBalance = (input.initialAmount + input.initialAmount + input.monthlyAddition * input.term) / 2;
    if (averageBalance === 0) return 0;
    return (totalInterest / averageBalance) * 12 / input.term * 100;
  }

  // Сохранение расчета в историю (для BusinessEvent)
  static async saveToHistory(profileId: string, input: DepositInput, result: DepositResult) {
    // Здесь будет вызов API для сохранения в BusinessEvent
    console.log('Сохранение расчета:', { profileId, input, result });
  }
}