'use client';

import { useState } from 'react';
import { CreditParams, PaymentType } from '../types';
import { Button, Input, Slider } from '@/components/common';

interface CreditFormProps {
  onCalculate: (params: CreditParams) => void;
  initialParams?: Partial<CreditParams>;
}

export function CreditForm({ onCalculate, initialParams }: CreditFormProps) {
  const [params, setParams] = useState<CreditParams>({
    amount: initialParams?.amount || 500000,
    term: initialParams?.term || 12,
    interestRate: initialParams?.interestRate || 15,
    paymentType: initialParams?.paymentType || 'annuity'
  });

  const [showEarlyRepayment, setShowEarlyRepayment] = useState(false);
  const [earlyRepaymentMonth, setEarlyRepaymentMonth] = useState(6);
  const [earlyRepaymentAmount, setEarlyRepaymentAmount] = useState(50000);
  const [earlyRepaymentType, setEarlyRepaymentType] = useState<'reduceTerm' | 'reducePayment'>('reduceTerm');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalParams: CreditParams = { ...params };
    
    if (showEarlyRepayment) {
      finalParams.earlyRepayment = {
        month: earlyRepaymentMonth,
        amount: earlyRepaymentAmount,
        type: earlyRepaymentType
      };
    }
    
    onCalculate(finalParams);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold text-[#264653]">Параметры кредита</h2>
      
      {/* Сумма кредита */}
      <div>
        <label className="block text-sm font-medium text-[#264653] mb-2">
          Сумма кредита: {formatCurrency(params.amount)}
        </label>
        <Slider
          min={10000}
          max={5000000}
          step={10000}
          value={params.amount}
          onChange={(value) => setParams(prev => ({ ...prev, amount: value }))}
          formatLabel={(value) => formatCompactCurrency(value)}
          className="mb-2"
        />
        <Input
          type="number"
          value={params.amount}
          onChange={(e) => setParams(prev => ({ ...prev, amount: Number(e.target.value) }))}
          min={10000}
          max={5000000}
          step={10000}
          className="w-full"
        />
      </div>

      {/* Срок кредита */}
      <div>
        <label className="block text-sm font-medium text-[#264653] mb-2">
          Срок кредита: {params.term} месяцев ({Math.floor(params.term / 12)} лет {params.term % 12} мес)
        </label>
        <Slider
          min={3}
          max={60}
          step={1}
          value={params.term}
          onChange={(value) => setParams(prev => ({ ...prev, term: value }))}
          formatLabel={(value) => `${value} мес`}
          className="mb-2"
        />
      </div>

      {/* Процентная ставка */}
      <div>
        <label className="block text-sm font-medium text-[#264653] mb-2">
          Процентная ставка: {params.interestRate}%
        </label>
        <Slider
          min={5}
          max={30}
          step={0.1}
          value={params.interestRate}
          onChange={(value) => setParams(prev => ({ ...prev, interestRate: value }))}
          formatLabel={(value) => `${value}%`}
        />
      </div>

      {/* Тип платежа */}
      <div>
        <label className="block text-sm font-medium text-[#264653] mb-2">
          Тип платежа
        </label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="annuity"
              checked={params.paymentType === 'annuity'}
              onChange={(e) => setParams(prev => ({ ...prev, paymentType: e.target.value as PaymentType }))}
              className="mr-2"
            />
            Аннуитетный
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="differentiated"
              checked={params.paymentType === 'differentiated'}
              onChange={(e) => setParams(prev => ({ ...prev, paymentType: e.target.value as PaymentType }))}
              className="mr-2"
            />
            Дифференцированный
          </label>
        </div>
      </div>

      {/* Досрочное погашение */}
      <div className="border-t border-gray-200 pt-4">
        <label className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={showEarlyRepayment}
            onChange={(e) => setShowEarlyRepayment(e.target.checked)}
            className="rounded border-gray-300 text-[#F4A261] focus:ring-[#F4A261]"
          />
          <span className="text-sm font-medium text-[#264653]">
            Планирую досрочное погашение
          </span>
        </label>

        {showEarlyRepayment && (
          <div className="space-y-4 pl-6">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Месяц досрочного погашения
              </label>
              <Slider
                min={1}
                max={params.term - 1}
                step={1}
                value={earlyRepaymentMonth}
                onChange={setEarlyRepaymentMonth}
                formatLabel={(value) => `${value} мес`}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Сумма досрочного погашения
              </label>
              <Input
                type="number"
                value={earlyRepaymentAmount}
                onChange={(e) => setEarlyRepaymentAmount(Number(e.target.value))}
                min={1000}
                max={params.amount * 0.5}
                step={1000}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Что делать с платежом?
              </label>
              <select
                value={earlyRepaymentType}
                onChange={(e) => setEarlyRepaymentType(e.target.value as 'reduceTerm' | 'reducePayment')}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F4A261]"
              >
                <option value="reduceTerm">Уменьшить срок кредита</option>
                <option value="reducePayment">Уменьшить ежемесячный платеж</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-[#F4A261] hover:bg-[#e0914f] text-white py-3 rounded-lg transition-colors"
      >
        Рассчитать кредит
      </Button>
    </form>
  );
}

// Вспомогательные функции
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

function formatCompactCurrency(value: number): string {
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + ' млн ₽';
  }
  if (value >= 1000) {
    return (value / 1000).toFixed(0) + ' тыс ₽';
  }
  return value + ' ₽';
}
