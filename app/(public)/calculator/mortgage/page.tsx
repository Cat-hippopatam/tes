'use client';

import { useState } from 'react';
import { MortgageForm } from './components/MortgageForm';
import { PaymentSchedule } from './components/PaymentSchedule';
import { MortgageChart } from './components/MortgageChart';
import { calculateMortgage } from './mortgage.service';
import { MortgageParams, MortgageResult } from './types';
import { Button } from '@/components/common';

export default function MortgagePage() {
  const [result, setResult] = useState<MortgageResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [savedCalculations, setSavedCalculations] = useState<MortgageParams[]>([]);

  const handleCalculate = (params: MortgageParams) => {
    setIsLoading(true);
    
    // Имитация загрузки (для демонстрации лоадера)
    setTimeout(() => {
      const calculationResult = calculateMortgage(params);
      setResult(calculationResult);
      setIsLoading(false);
    }, 500);
  };

  const handleSaveCalculation = () => {
    // TODO: Сохранять расчет в localStorage или через API
    console.log('Сохранение расчета');
  };

  const handleExportPDF = () => {
    // TODO: Экспорт в PDF
    console.log('Экспорт в PDF');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Шапка */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#264653]">
                Ипотечный калькулятор
              </h1>
              <p className="text-gray-600 mt-1">
                Рассчитайте ежемесячные платежи и переплату по ипотеке
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleSaveCalculation}
                disabled={!result}
              >
                💾 Сохранить расчет
              </Button>
              <Button
                variant="outline"
                onClick={handleExportPDF}
                disabled={!result}
              >
                📄 Экспорт PDF
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
            <MortgageForm onCalculate={handleCalculate} />
            
            {/* Быстрые подсказки */}
            <div className="mt-6 bg-white p-6 rounded-xl shadow-sm">
              <h4 className="font-medium text-[#264653] mb-3">💡 Полезно знать</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-[#F4A261]">•</span>
                  <span><strong className="text-[#264653]">Первоначальный взнос</strong> — минимум 10-15% от стоимости недвижимости</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#F4A261]">•</span>
                  <span><strong className="text-[#264653]">Аннуитетные платежи</strong> — одинаковые каждый месяц, удобно для планирования</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#F4A261]">•</span>
                  <span><strong className="text-[#264653]">Дифференцированные платежи</strong> — уменьшаются со временем, меньше переплата</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#F4A261]">•</span>
                  <span><strong className="text-[#264653]">Страхование</strong> — может снизить процентную ставку на 0.5-1%</span>
                </li>
              </ul>
            </div>

            {/* История расчетов (если есть) */}
            {savedCalculations.length > 0 && (
              <div className="mt-6 bg-white p-6 rounded-xl shadow-sm">
                <h4 className="font-medium text-[#264653] mb-3">📋 Последние расчеты</h4>
                <div className="space-y-2">
                  {savedCalculations.map((calc, index) => (
                    <button
                      key={index}
                      onClick={() => handleCalculate(calc)}
                      className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-[#F4A261] transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-[#264653]">
                          {formatCurrency(calc.propertyPrice)} • {calc.term} лет
                        </span>
                        <span className="text-xs text-gray-500">
                          {calc.initialPaymentPercent}% первоначальный
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Правая колонка - результаты */}
          <div className="space-y-6">
            {isLoading ? (
              <div className="bg-white p-12 rounded-xl shadow-sm flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#F4A261] mb-4" />
                <p className="text-gray-500">Рассчитываем ипотеку...</p>
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
                      {formatCurrency(result.loanAmount)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {((result.loanAmount / (result.loanAmount + result.totalPayment)) * 100).toFixed(1)}% от выплат
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-500 mb-1">Переплата по процентам</p>
                    <p className="text-2xl font-bold text-[#2A9D8F]">
                      {formatCurrency(result.totalInterest)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {((result.totalInterest / result.loanAmount) * 100).toFixed(1)}% от кредита
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-500 mb-1">Общая выплата</p>
                    <p className="text-2xl font-bold text-[#264653]">
                      {formatCurrency(result.totalPayment + result.totalInsurance)}
                    </p>
                    {result.totalInsurance > 0 && (
                      <p className="text-xs text-gray-400 mt-1">
                        включая страховку {formatCurrency(result.totalInsurance)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Быстрый калькулятор "А что если?" */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="text-sm font-medium text-[#264653] mb-3">🔍 Что если?</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {/* Увеличить первоначальный взнос */}}
                      className="text-left p-2 border border-gray-200 rounded-lg hover:border-[#2A9D8F] transition-colors"
                    >
                      <p className="text-xs text-gray-500">Увеличить взнос до 30%</p>
                      <p className="text-sm font-medium text-[#2A9D8F]">
                        -{formatCurrency(result.totalInterest * 0.15)}
                      </p>
                    </button>
                    <button
                      onClick={() => {/* Уменьшить срок */}}
                      className="text-left p-2 border border-gray-200 rounded-lg hover:border-[#2A9D8F] transition-colors"
                    >
                      <p className="text-xs text-gray-500">Сократить срок до 10 лет</p>
                      <p className="text-sm font-medium text-[#2A9D8F]">
                        -{formatCurrency(result.totalInterest * 0.25)}
                      </p>
                    </button>
                  </div>
                </div>

                {/* График */}
                <MortgageChart 
                  schedule={result.schedule} 
                  loanAmount={result.loanAmount}
                />

                {/* Таблица платежей */}
                <PaymentSchedule 
                  schedule={result.schedule} 
                  loanAmount={result.loanAmount}
                />

                {/* Подсказка по налоговому вычету */}
                <div className="bg-gradient-to-r from-[#2A9D8F] to-[#F4A261] p-6 rounded-xl shadow-sm text-white">
                  <h4 className="font-medium mb-2">🏠 Налоговый вычет</h4>
                  <p className="text-sm opacity-90 mb-3">
                    Вы можете вернуть до 260 000 ₽ от стоимости квартиры и до 390 000 ₽ от процентов по ипотеке
                  </p>
                  <Button
                    variant="outline"
                    className="bg-white/20 border-white text-white hover:bg-white/30"
                  >
                    Рассчитать вычет
                  </Button>
                </div>
              </>
            ) : (
              <div className="bg-white p-12 rounded-xl shadow-sm flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-4xl">🏠</span>
                </div>
                <h3 className="text-lg font-medium text-[#264653] mb-2">
                  Начните расчет ипотеки
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

// Вспомогательная функция форматирования валюты
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}