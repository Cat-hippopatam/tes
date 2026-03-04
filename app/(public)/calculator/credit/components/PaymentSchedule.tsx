'use client';

import { useState } from 'react';
import { MonthlyPayment } from '../types';
import { Button } from '@/components/common';

interface PaymentScheduleProps {
  schedule: MonthlyPayment[];
  loanAmount: number;
  earlyRepayment?: {
    savedInterest: number;
    newTerm: number;
    newPayment: number;
  };
}

export function PaymentSchedule({ schedule, loanAmount, earlyRepayment }: PaymentScheduleProps) {
  const [showAll, setShowAll] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  if (!schedule.length) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm text-center text-gray-500">
        Нет данных для отображения
      </div>
    );
  }
  
  // Показываем только первые 12 месяцев или всё
  const displayedSchedule = showAll ? schedule : schedule.slice(0, 12);
  
  // Проверяем, есть ли досрочные погашения
  const hasEarlyRepayment = schedule.some(p => p.isEarlyRepayment);
  
  // Форматируем дату
  const getPaymentDate = (month: number) => {
    const date = new Date();
    date.setMonth(date.getMonth() + month);
    return date.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
  };

  // Считаем прогресс погашения
  const getProgress = (remainingDebt: number) => {
    return ((loanAmount - remainingDebt) / loanAmount) * 100;
  };

  // Вычисляем итоги
  const totals = {
    totalPayment: schedule.reduce((sum, p) => sum + p.payment, 0),
    totalInterest: schedule.reduce((sum, p) => sum + p.interest, 0),
    averagePayment: schedule.reduce((sum, p) => sum + p.payment, 0) / schedule.length
  };

  const sortedSchedule = [...displayedSchedule].sort((a, b) => {
    return sortOrder === 'asc' ? a.month - b.month : b.month - a.month;
  });

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      {/* Заголовок с действиями */}
      <div className="flex flex-wrap justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-[#264653]">График платежей</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'desc')}
          >
            {sortOrder === 'asc' ? '↓ Сначала новые' : '↑ Сначала старые'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Показать первые 12' : `Показать все ${schedule.length}`}
          </Button>
        </div>
      </div>

      {/* Информация о досрочном погашении */}
      {earlyRepayment && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700">
            🎉 Досрочное погашение сэкономило {formatCurrency(earlyRepayment.savedInterest)} процентов
          </p>
          {earlyRepayment.newTerm < schedule.length && (
            <p className="text-sm text-green-600 mt-1">
              Срок сократился на {schedule.length - earlyRepayment.newTerm} месяцев
            </p>
          )}
        </div>
      )}

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
              <th className="text-left py-3 px-2 text-[#264653]">Прогресс</th>
            </tr>
          </thead>
          <tbody>
            {sortedSchedule.map((payment) => {
              const progress = getProgress(payment.remainingDebt);
              const isEarly = payment.isEarlyRepayment;
              
              return (
                <tr 
                  key={payment.month}
                  className={`
                    border-b border-gray-100 hover:bg-gray-50 transition-colors
                    ${isEarly ? 'bg-green-50' : ''}
                  `}
                >
                  <td className="py-2 px-2 text-[#264653]">
                    {getPaymentDate(payment.month)}
                    {isEarly && (
                      <span className="ml-2 text-xs bg-green-200 text-green-700 px-2 py-0.5 rounded-full">
                        Досрочно
                      </span>
                    )}
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
                  <td className="py-2 px-2">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-full bg-[#2A9D8F] rounded-full"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">
                        {Math.round(progress)}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Если показаны не все */}
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
        <div>
          <p className="text-sm text-gray-500">Общая выплата</p>
          <p className="text-lg font-semibold text-[#264653]">
            {formatCurrency(totals.totalPayment)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Переплата</p>
          <p className="text-lg font-semibold text-[#2A9D8F]">
            {((totals.totalInterest / loanAmount) * 100).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Кнопка экспорта */}
      <div className="mt-4 flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {/* TODO: экспорт в CSV */}}
        >
          📥 Скачать CSV
        </Button>
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