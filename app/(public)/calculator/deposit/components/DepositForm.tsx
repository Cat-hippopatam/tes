'use client';

import { useState } from 'react';
import { Form, Input, Select, SelectItem, Button, Card, CardBody, Slider } from '@heroui/react';
import { DepositInput, CapitalizationPeriod, TaxRate } from '../types';

interface IProps {
  onCalculate: (input: DepositInput) => void;
  isLoading?: boolean;
}

const INITIAL_INPUT: DepositInput = {
  initialAmount: 100000,
  monthlyAddition: 0,
  interestRate: 10,
  term: 12,
  capitalization: 'monthly',
  taxRate: 13,
  enablePartialWithdrawals: false,
};

const CAPITALIZATION_OPTIONS = [
  { value: 'monthly', label: 'Ежемесячная' },
  { value: 'quarterly', label: 'Ежеквартальная' },
  { value: 'yearly', label: 'Ежегодная' },
  { value: 'none', label: 'В конце срока' },
];

const TAX_RATE_OPTIONS = [
  { value: 0, label: '0% (нерезидент)' },
  { value: 13, label: '13% (резидент)' },
  { value: 15, label: '15% (доход >5млн)' },
];

export default function DepositForm({ onCalculate, isLoading }: IProps) {
  const [input, setInput] = useState<DepositInput>(INITIAL_INPUT);

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('ru-RU').format(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate(input);
  };

  return (
    <Card className="w-full">
      <CardBody>
        <Form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Начальная сумма */}
          <div className="space-y-2">
            <label className="text-sm font-medium" style={{ color: '#264653' }}>
              Начальная сумма: {formatNumber(input.initialAmount)} ₽
            </label>
            <Slider
              size="sm"
              step={10000}
              minValue={10000}
              maxValue={10000000}
              value={input.initialAmount}
              onChange={(value) => setInput({ ...input, initialAmount: value as number })}
              className="w-full"
              color="warning"
            />
            <Input
              type="number"
              value={input.initialAmount.toString()}
              onChange={(e) => setInput({ ...input, initialAmount: Number(e.target.value) })}
              startContent={<span className="text-gray-400">₽</span>}
              className="mt-2"
            />
          </div>

          {/* Ежемесячное пополнение */}
          <div className="space-y-2">
            <label className="text-sm font-medium" style={{ color: '#264653' }}>
              Ежемесячное пополнение: {formatNumber(input.monthlyAddition)} ₽
            </label>
            <Slider
              size="sm"
              step={5000}
              minValue={0}
              maxValue={1000000}
              value={input.monthlyAddition}
              onChange={(value) => setInput({ ...input, monthlyAddition: value as number })}
              className="w-full"
              color="warning"
            />
            <Input
              type="number"
              value={input.monthlyAddition.toString()}
              onChange={(e) => setInput({ ...input, monthlyAddition: Number(e.target.value) })}
              startContent={<span className="text-gray-400">₽</span>}
              className="mt-2"
            />
          </div>

          {/* Процентная ставка */}
          <div className="space-y-2">
            <label className="text-sm font-medium" style={{ color: '#264653' }}>
              Годовая ставка: {input.interestRate}%
            </label>
            <Slider
              size="sm"
              step={0.1}
              minValue={0.1}
              maxValue={30}
              value={input.interestRate}
              onChange={(value) => setInput({ ...input, interestRate: value as number })}
              className="w-full"
              color="success"
            />
            <Input
              type="number"
              step="0.1"
              value={input.interestRate.toString()}
              onChange={(e) => setInput({ ...input, interestRate: Number(e.target.value) })}
              endContent={<span className="text-gray-400">%</span>}
              className="mt-2"
            />
          </div>

          {/* Срок вклада */}
          <div className="space-y-2">
            <label className="text-sm font-medium" style={{ color: '#264653' }}>
              Срок: {input.term} мес. ({Math.floor(input.term / 12)} г. {input.term % 12} мес.)
            </label>
            <Slider
              size="sm"
              step={1}
              minValue={1}
              maxValue={60}
              value={input.term}
              onChange={(value) => setInput({ ...input, term: value as number })}
              className="w-full"
              color="primary"
            />
          </div>

          {/* Периодичность капитализации */}
          {/* Исправленный блок капитализации */}
            <Select
            label="Капитализация процентов"
            selectedKeys={[input.capitalization]}
            onChange={(e) => setInput({ ...input, capitalization: e.target.value as CapitalizationPeriod })}
            >
            {CAPITALIZATION_OPTIONS.map((option) => (
                // Убрали value, оставили только key
                <SelectItem key={option.value}>
                {option.label}
                </SelectItem>
            ))}
            </Select>

            {/* Исправленный блок налогов */}
            <Select
            label="Ставка налога"
            selectedKeys={[input.taxRate.toString()]}
            onChange={(e) => setInput({ ...input, taxRate: Number(e.target.value) as TaxRate })}
            >
            {TAX_RATE_OPTIONS.map((option) => (
                // Убрали value, оставили только key
                <SelectItem key={option.value}>
                {option.label}
                </SelectItem>
            ))}
            </Select>


          {/* Кнопка расчета */}
          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full mt-4"
            style={{
              backgroundColor: '#F4A261',
              color: 'white',
              fontSize: '1.1rem',
              padding: '1.5rem',
            }}
          >
            {isLoading ? 'Расчет...' : 'Рассчитать доход'}
          </Button>
        </Form>
      </CardBody>
    </Card>
  );
}