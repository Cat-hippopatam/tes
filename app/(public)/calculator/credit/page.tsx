'use client';

import { useState } from 'react';
import { CreditForm } from './components/CreditForm';
import { PaymentSchedule } from './components/PaymentSchedule';
import { CreditChart } from './components/CreditChart';
import { calculateCredit } from './credit.service';
import { CreditParams, CreditResult } from './types';
import { Button } from '@/components/common';

export default function CreditPage() {
  const [result, setResult] = useState<CreditResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCalculate = (params: CreditParams) => {
    setIsLoading(true);
    
    // Имитация загрузки
    setTimeout(() => {
      const calculationResult = calculateCredit(params);
      setResult(calculationResult);
      setIsLoading(false);
    }, 500);
  };

  const handleExportCSV = () => {
    if (!result) return;
    
    // Формируем CSV
    const headers = ['Месяц', 'Дата', 'Платеж', 'Основной долг', 'Проценты', 'Остаток', 'Досрочно'];
    const rows = result.schedule.map(p => [
      p.month,
      new Date(new Date().setMonth(new Date().getMonth() + p.month)).toLocaleDateString('ru-RU'),
      p.payment,
      p.principal,
      p.interest,
      p.remainingDebt,
      p.isEarlyRepayment ? 'Да' : 'Нет'
    ]);
    
    const csv = [headers, ...rows]
      .map(row => row.join(','))
      .join('\n');
    
    // Скачиваем
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `credit-payments-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleExportPDF = () => {
    if (!result) return;
    
    const printContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Кредитный калькулятор - Economikus</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; color: #264653; }
    h1 { color: #264653; border-bottom: 2px solid #F4A261; padding-bottom: 10px; }
    .summary { display: flex; gap: 20px; margin: 20px 0; }
    .summary-item { background: #F8F6F3; padding: 15px; border-radius: 8px; flex: 1; }
    .summary-item strong { display: block; font-size: 24px; color: #F4A261; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { border: 1px solid #E8E4DE; padding: 10px; text-align: center; }
    th { background: #457B9D; color: white; }
    tr:nth-child(even) { background: #F8F6F3; }
    .footer { margin-top: 30px; text-align: center; color: #6C757D; font-size: 12px; }
  </style>
</head>
<body>
  <h1>💰 Кредитный калькулятор</h1>
  <p>Дата расчёта: ${new Date().toLocaleDateString('ru-RU')}</p>
  
  <div class="summary">
    <div class="summary-item">
      <span>Ежемесячный платёж</span>
      <strong>${formatCurrency(result.monthlyPayment)}</strong>
    </div>
    <div class="summary-item">
      <span>Переплата</span>
      <strong>${formatCurrency(result.totalInterest)}</strong>
    </div>
    <div class="summary-item">
      <span>Эффективная ставка</span>
      <strong>${result.effectiveRate}%</strong>
    </div>
  </div>
  
  <h2>График платежей</h2>
  <table>
    <thead>
      <tr>
        <th>Месяц</th>
        <th>Дата</th>
        <th>Платёж</th>
        <th>Основной долг</th>
        <th>Проценты</th>
        <th>Остаток</th>
      </tr>
    </thead>
    <tbody>
      ${result.schedule.map(p => `
        <tr>
          <td>${p.month}</td>
          <td>${new Date(new Date().setMonth(new Date().getMonth() + p.month)).toLocaleDateString('ru-RU')}</td>
          <td>${formatCurrency(p.payment)}</td>
          <td>${formatCurrency(p.principal)}</td>
          <td>${formatCurrency(p.interest)}</td>
          <td>${formatCurrency(p.remainingDebt)}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
  
  <div class="footer">
    <p>Рассчитано на сайте Economikus - economikus.ru</p>
  </div>
</body>
</html>`;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleSaveImage = () => {
    // Создаём canvas с графиком
    const chartContainer = document.querySelector('.credit-chart-container');
    if (!chartContainer) return;
    
    // Просто提示 пользователю использовать скриншот
    alert('Для сохранения графика используйте функцию скриншота (PrintScreen) или расширение браузера');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Шапка */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#264653]">
                Кредитный калькулятор
              </h1>
              <p className="text-gray-600 mt-1">
                Рассчитайте ежемесячные платежи и переплату по кредиту
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Button
                variant="outline"
                onClick={handleExportPDF}
                disabled={!result}
              >
                📄 PDF
              </Button>
              <Button
                variant="outline"
                onClick={handleExportCSV}
                disabled={!result}
              >
                📥 CSV
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Основной контент */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Левая колонка - форма */}
          <div>
            <CreditForm onCalculate={handleCalculate} />
            
            {/* Полезные подсказки */}
            <div className="mt-6 bg-white p-6 rounded-xl shadow-sm">
              <h4 className="font-medium text-[#264653] mb-3">💡 Полезно знать</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-[#F4A261]">•</span>
                  <span>
                    <strong className="text-[#264653]">Аннуитетные платежи</strong> — 
                    одинаковые каждый месяц, удобно для планирования бюджета
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#F4A261]">•</span>
                  <span>
                    <strong className="text-[#264653]">Дифференцированные платежи</strong> — 
                    уменьшаются со временем, общая переплата меньше
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#F4A261]">•</span>
                  <span>
                    <strong className="text-[#264653]">Досрочное погашение</strong> — 
                    можно уменьшить срок или ежемесячный платеж
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#F4A261]">•</span>
                  <span>
                    <strong className="text-[#264653]">Эффективная ставка</strong> — 
                    реальная стоимость кредита с учетом всех комиссий
                  </span>
                </li>
              </ul>
            </div>

            {/* Рекомендации по кредитам */}
            <div className="mt-6 bg-gradient-to-r from-[#2A9D8F] to-[#F4A261] p-6 rounded-xl shadow-sm text-white">
              <h4 className="font-medium mb-2">🏆 Лучшие предложения</h4>
              <p className="text-sm opacity-90 mb-4">
                Сравните условия в разных банках и выберите лучшее
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/20 rounded-lg p-3">
                  <p className="text-xs opacity-75">Сбербанк</p>
                  <p className="text-lg font-bold">от 13.9%</p>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                  <p className="text-xs opacity-75">ВТБ</p>
                  <p className="text-lg font-bold">от 14.2%</p>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                  <p className="text-xs opacity-75">Тинькофф</p>
                  <p className="text-lg font-bold">от 12.9%</p>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                  <p className="text-xs opacity-75">Альфа-банк</p>
                  <p className="text-lg font-bold">от 13.5%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Правая колонка - результаты */}
          <div className="space-y-6">
            {isLoading ? (
              <div className="bg-white p-12 rounded-xl shadow-sm flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#F4A261] mb-4" />
                <p className="text-gray-500">Рассчитываем кредит...</p>
              </div>
            ) : result ? (
              <>
                {/* Ключевые показатели */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-500 mb-1">Ежемесячный платеж</p>
                    <p className="text-2xl font-bold text-[#F4A261]">
                      {formatCurrency(result.monthlyPayment)}
                    </p>
                    {result.monthlyMin && result.monthlyMax && (
                      <p className="text-xs text-gray-400 mt-1">
                        от {formatCurrency(result.monthlyMin)} до {formatCurrency(result.monthlyMax)}
                      </p>
                    )}
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-500 mb-1">Сумма кредита</p>
                    <p className="text-2xl font-bold text-[#264653]">
                      {formatCurrency(result.schedule[0]?.principal * result.schedule.length || 0)}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-500 mb-1">Переплата</p>
                    <p className="text-2xl font-bold text-[#2A9D8F]">
                      {formatCurrency(result.totalInterest)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {((result.totalInterest / (result.schedule[0]?.principal * result.schedule.length)) * 100).toFixed(1)}% от кредита
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-500 mb-1">Эффективная ставка</p>
                    <p className="text-2xl font-bold text-[#264653]">
                      {result.effectiveRate}%
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      с учетом всех платежей
                    </p>
                  </div>
                </div>

                {/* Если было досрочное погашение */}
                {result.earlyRepayment && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">🎉</div>
                      <div>
                        <h4 className="font-medium text-green-700 mb-1">
                          Досрочное погашение сработало!
                        </h4>
                        <p className="text-sm text-green-600">
                          Вы сэкономили {formatCurrency(result.earlyRepayment.savedInterest)} на процентах
                        </p>
                        {result.earlyRepayment.newTerm < result.schedule.length && (
                          <p className="text-sm text-green-600 mt-1">
                            Срок кредита сократился на {result.schedule.length - result.earlyRepayment.newTerm} месяцев
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* График */}
                <CreditChart 
                  schedule={result.schedule} 
                  loanAmount={result.schedule[0]?.principal * result.schedule.length || 0}
                />

                {/* Таблица платежей */}
                <PaymentSchedule 
                  schedule={result.schedule} 
                  loanAmount={result.schedule[0]?.principal * result.schedule.length || 0}
                  earlyRepayment={result.earlyRepayment}
                />

                {/* Сравнение с другими вариантами */}
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h4 className="font-medium text-[#264653] mb-4">🔄 Сравнить с другими вариантами</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => {
                        // Увеличить срок
                        const params = {
                          amount: result.schedule[0]?.principal * result.schedule.length,
                          term: Math.round(result.schedule.length * 1.5),
                          interestRate: 15,
                          paymentType: 'annuity' as const
                        };
                        handleCalculate(params);
                      }}
                      className="p-3 border border-gray-200 rounded-lg hover:border-[#2A9D8F] text-left"
                    >
                      <p className="text-xs text-gray-500">Увеличить срок</p>
                      <p className="text-sm font-medium text-[#264653]">на 50%</p>
                      <p className="text-xs text-[#2A9D8F] mt-1">
                        -{formatCurrency(result.totalInterest * 0.2)}/мес
                      </p>
                    </button>
                    <button
                      onClick={() => {
                        // Меньше ставка
                        const params = {
                          amount: result.schedule[0]?.principal * result.schedule.length,
                          term: result.schedule.length,
                          interestRate: 12,
                          paymentType: 'annuity' as const
                        };
                        handleCalculate(params);
                      }}
                      className="p-3 border border-gray-200 rounded-lg hover:border-[#2A9D8F] text-left"
                    >
                      <p className="text-xs text-gray-500">Ставка 12%</p>
                      <p className="text-sm font-medium text-[#264653]">выгодное предложение</p>
                      <p className="text-xs text-[#2A9D8F] mt-1">
                        -{formatCurrency(result.totalInterest * 0.15)}
                      </p>
                    </button>
                    <button
                      onClick={() => {
                        // Дифференцированный
                        const params = {
                          amount: result.schedule[0]?.principal * result.schedule.length,
                          term: result.schedule.length,
                          interestRate: 15,
                          paymentType: 'differentiated' as const
                        };
                        handleCalculate(params);
                      }}
                      className="p-3 border border-gray-200 rounded-lg hover:border-[#2A9D8F] text-left"
                    >
                      <p className="text-xs text-gray-500">Дифференц.</p>
                      <p className="text-sm font-medium text-[#264653]">платежи</p>
                      <p className="text-xs text-[#2A9D8F] mt-1">
                        переплата ниже
                      </p>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white p-12 rounded-xl shadow-sm flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-4xl">💳</span>
                </div>
                <h3 className="text-lg font-medium text-[#264653] mb-2">
                  Начните расчет кредита
                </h3>
                <p className="text-gray-500 max-w-sm">
                  Заполните параметры кредита в форме слева, чтобы увидеть ежемесячные платежи, переплату и график погашения
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Вспомогательная функция
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}