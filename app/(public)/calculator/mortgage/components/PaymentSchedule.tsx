'use client';

import { useState } from 'react';
import { MonthlyPayment } from '../types';
import { Button } from '@/components/common';

interface PaymentScheduleProps {
  schedule: MonthlyPayment[];
  loanAmount: number;
}

export function PaymentSchedule({ schedule, loanAmount }: PaymentScheduleProps) {
  const [showAll, setShowAll] = useState(false);
  
  // Проверяем, есть ли данные
  if (!schedule.length) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm text-center text-gray-500">
        Нет данных для отображения
      </div>
    );
  }
  
  // Показываем только первые 12 месяцев или всё
  const displayedSchedule = showAll ? schedule : schedule.slice(0, 12);
  
  // Проверяем, есть ли страхование в любом платеже
  const hasInsurance = schedule.some(payment => (payment.insurancePayment || 0) > 0);
  
  // Форматируем дату (первый платеж - следующий месяц)
  const getPaymentDate = (month: number) => {
    const date = new Date();
    date.setMonth(date.getMonth() + month);
    return date.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
  };

  // Считаем остаток долга в процентах для визуального прогресса
  const getRemainingPercent = (remainingDebt: number) => {
    return (remainingDebt / loanAmount) * 100;
  };

  // Вычисляем итоги
  const totals = {
    totalPayment: schedule.reduce((sum, p) => sum + p.payment, 0),
    totalInterest: schedule.reduce((sum, p) => sum + p.interest, 0),
    totalInsurance: schedule.reduce((sum, p) => sum + (p.insurancePayment || 0), 0),
    averagePayment: schedule.reduce((sum, p) => sum + p.payment, 0) / schedule.length
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-[#264653]">График платежей</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? 'Показать первые 12 месяцев' : `Показать все ${schedule.length} месяцев`}
        </Button>
      </div>

      {/* Таблица */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-3 px-2 text-[#264653]">Дата</th>
              <th className="text-right py-3 px-2 text-[#264653]">Платеж</th>
              <th className="text-right py-3 px-2 text-[#264653]">Основной долг</th>
              <th className="text-right py-3 px-2 text-[#264653]">Проценты</th>
              <th className="text-right py-3 px-2 text-[#264653]">Остаток</th>
              {hasInsurance && (
                <th className="text-right py-3 px-2 text-[#264653]">Страховка</th>
              )}
              <th className="text-left py-3 px-2 text-[#264653]">Прогресс</th>
            </tr>
          </thead>
          <tbody>
            {displayedSchedule.map((payment) => {
              const remainingPercent = getRemainingPercent(payment.remainingDebt);
              
              return (
                <tr 
                  key={payment.month}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-2 px-2 text-[#264653]">
                    {getPaymentDate(payment.month)}
                  </td>
                  <td className="text-right py-2 px-2 font-medium text-[#264653]">
                    {formatCurrency(payment.payment)}
                  </td>
                  <td className="text-right py-2 px-2 text-[#2A9D8F]">
                    {formatCurrency(payment.principal)}
                  </td>
                  <td className="text-right py-2 px-2 text-[#F4A261]">
                    {formatCurrency(payment.interest)}
                  </td>
                  <td className="text-right py-2 px-2 text-gray-600">
                    {formatCurrency(payment.remainingDebt)}
                  </td>
                  {hasInsurance && (
                    <td className="text-right py-2 px-2 text-gray-500">
                      {formatCurrency(payment.insurancePayment || 0)}
                    </td>
                  )}
                  <td className="py-2 px-2">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-full bg-[#2A9D8F] rounded-full"
                          style={{ width: `${100 - remainingPercent}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">
                        {Math.round(100 - remainingPercent)}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Если показаны не все, индикатор */}
      {!showAll && schedule.length > 12 && (
        <p className="text-center text-sm text-gray-500 mt-4">
          Показаны первые 12 месяцев из {schedule.length}
        </p>
      )}

      {/* Итоги */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
        <div>
          <p className="text-sm text-gray-500">Средний платеж</p>
          <p className="text-lg font-semibold text-[#264653]">
            {formatCurrency(totals.averagePayment)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Всего процентов</p>
          <p className="text-lg font-semibold text-[#F4A261]">
            {formatCurrency(totals.totalInterest)}
          </p>
        </div>
        {hasInsurance && (
          <div>
            <p className="text-sm text-gray-500">Всего страховки</p>
            <p className="text-lg font-semibold text-gray-600">
              {formatCurrency(totals.totalInsurance)}
            </p>
          </div>
        )}
        <div>
          <p className="text-sm text-gray-500">Общая выплата</p>
          <p className="text-lg font-semibold text-[#264653]">
            {formatCurrency(totals.totalPayment + totals.totalInsurance)}
          </p>
        </div>
      </div>
    </div>
  );
}

// Вспомогательная функция форматирования
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}