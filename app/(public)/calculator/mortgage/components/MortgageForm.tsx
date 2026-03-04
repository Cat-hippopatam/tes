'use client';

import { useState } from 'react';
import { MortgageParams, PaymentType, InsuranceType } from '../types';
import { Button, Input, Slider } from '@/components/common';

interface MortgageFormProps {
  onCalculate: (params: MortgageParams) => void;
  initialParams?: Partial<MortgageParams>;
}

export function MortgageForm({ onCalculate, initialParams }: MortgageFormProps) {
  // Храним ТОЛЬКО базовые значения, percent вычисляем на лету
  const [params, setParams] = useState({
    propertyPrice: initialParams?.propertyPrice || 5000000,
    initialPayment: initialParams?.initialPayment || 1000000,
    term: initialParams?.term || 15,
    interestRate: initialParams?.interestRate || 10.5,
    paymentType: initialParams?.paymentType || 'annuity',
    insurance: initialParams?.insurance || 'none'
});


  // Вычисляем процент на основе реальных значений
  const initialPaymentPercent = Math.min(99, 
    Math.round((params.initialPayment / params.propertyPrice) * 100)
  );

  const handlePropertyPriceChange = (value: number) => {
    // При изменении цены - пересчитываем первоначальный взнос, сохраняя процент
    const newInitialPayment = (initialPaymentPercent / 100) * value;
    setParams(prev => ({
      ...prev,
      propertyPrice: value,
      initialPayment: Math.min(newInitialPayment, value * 0.99)
    }));
  };

  const handleInitialPercentChange = (percent: number) => {
    // При изменении процента - пересчитываем сумму взноса
    const newInitialPayment = (percent / 100) * params.propertyPrice;
    setParams(prev => ({
      ...prev,
      initialPayment: newInitialPayment
    }));
  };

  const handleInitialPaymentChange = (value: number) => {
    // При прямом вводе суммы - просто обновляем (процент пересчитается сам в рендере)
    if (value <= params.propertyPrice * 0.99) {
      setParams(prev => ({ ...prev, initialPayment: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate({
      ...params,
      initialPaymentPercent // передаем вычисленное значение
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold text-[#264653]">Параметры ипотеки</h2>
      
      {/* Стоимость недвижимости */}
      <div>
        <label className="block text-sm font-medium text-[#264653] mb-2">
          Стоимость недвижимости: {formatCurrency(params.propertyPrice)}
        </label>
        <Slider
          min={1000000}
          max={100000000}
          step={100000}
          value={params.propertyPrice}
          onChange={handlePropertyPriceChange}
          formatLabel={(value) => `${(value / 1000000).toFixed(1)} млн ₽`}
          className="mb-2"
        />
        <Input
          type="number"
          value={params.propertyPrice}
          onChange={(e) => handlePropertyPriceChange(Number(e.target.value))}
          min={1000000}
          max={100000000}
          step={100000}
          className="w-full"
        />
      </div>

      {/* Первоначальный взнос */}
      <div>
        <label className="block text-sm font-medium text-[#264653] mb-2">
          Первоначальный взнос: {initialPaymentPercent}% ({formatCurrency(params.initialPayment)})
        </label>
        <Slider
          min={10}
          max={99}
          step={1}
          value={initialPaymentPercent}
          onChange={handleInitialPercentChange}
          formatLabel={(value) => `${value}%`}
          className="mb-2"
        />
        <Input
          type="number"
          value={params.initialPayment}
          onChange={(e) => handleInitialPaymentChange(Number(e.target.value))}
          min={params.propertyPrice * 0.1}
          max={params.propertyPrice * 0.99}
          step={100000}
          className="w-full"
        />
        <p className="text-xs text-gray-500 mt-1">
          Минимум 10% от стоимости недвижимости
        </p>
      </div>

      {/* Срок кредита */}
      <div>
        <label className="block text-sm font-medium text-[#264653] mb-2">
          Срок кредита: {params.term} лет
        </label>
        <Slider
          min={1}
          max={30}
          step={1}
          value={params.term}
          onChange={(value) => setParams(prev => ({ ...prev, term: value }))}
          formatLabel={(value) => `${value} ${getYearLabel(value)}`}
        />
      </div>

      {/* Процентная ставка */}
      <div>
        <label className="block text-sm font-medium text-[#264653] mb-2">
          Процентная ставка: {params.interestRate}%
        </label>
        <Slider
          min={1}
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

      {/* Страхование */}
      <div>
        <label className="block text-sm font-medium text-[#264653] mb-2">
          Страхование
        </label>
        <select
          value={params.insurance}
          onChange={(e) => setParams(prev => ({ ...prev, insurance: e.target.value as InsuranceType }))}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F4A261]"
        >
          <option value="none">Без страховки</option>
          <option value="life">Страхование жизни (0.05%/мес)</option>
          <option value="property">Страхование недвижимости (0.03%/мес)</option>
          <option value="both">Комплексное страхование (0.07%/мес)</option>
        </select>
      </div>

      <Button
        type="submit"
        className="w-full bg-[#F4A261] hover:bg-[#e0914f] text-white py-3 rounded-lg transition-colors"
      >
        Рассчитать ипотеку
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

function getYearLabel(years: number): string {
  const lastDigit = years % 10;
  const lastTwoDigits = years % 100;
  
  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return 'лет';
  }
  
  if (lastDigit === 1) {
    return 'год';
  }
  
  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'года';
  }
  
  return 'лет';
}