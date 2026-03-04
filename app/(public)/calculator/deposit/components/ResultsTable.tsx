'use client';

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Card, CardBody } from '@heroui/react';
import { DepositResult } from '../types';

interface IProps {
  result: DepositResult | null;
}

export default function ResultsTable({ result }: IProps) {
  if (!result) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Итоговые показатели */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gray-50">
          <CardBody className="text-center">
            <p className="text-sm text-gray-500">Конечная сумма</p>
            <p className="text-2xl font-bold" style={{ color: '#264653' }}>
              {formatCurrency(result.finalAmount)}
            </p>
          </CardBody>
        </Card>

        <Card className="bg-gray-50">
          <CardBody className="text-center">
            <p className="text-sm text-gray-500">Чистая прибыль</p>
            <p className="text-2xl font-bold" style={{ color: '#2A9D8F' }}>
              {formatCurrency(result.profit)}
            </p>
          </CardBody>
        </Card>

        <Card className="bg-gray-50">
          <CardBody className="text-center">
            <p className="text-sm text-gray-500">Эффективная ставка</p>
            <p className="text-2xl font-bold" style={{ color: '#F4A261' }}>
              {result.effectiveRate}%
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Детализация */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Всего внесено:</span>
          <span className="font-medium">{formatCurrency(result.totalAdded)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Всего процентов:</span>
          <span className="font-medium" style={{ color: '#2A9D8F' }}>
            {formatCurrency(result.totalInterest)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Налог:</span>
          <span className="font-medium text-red-500">
            {formatCurrency(result.totalTax)}
          </span>
        </div>
      </div>

      {/* Таблица по месяцам */}
      <Table
        aria-label="Детализация по месяцам"
        className="max-h-[400px] overflow-auto"
        classNames={{
          th: 'bg-gray-100 text-gray-700',
          td: 'text-sm',
        }}
      >
        <TableHeader>
          <TableColumn>МЕСЯЦ</TableColumn>
          <TableColumn>ДАТА</TableColumn>
          <TableColumn>НАЧАЛО</TableColumn>
          <TableColumn>ПОПОЛНЕНИЕ</TableColumn>
          <TableColumn>ПРОЦЕНТЫ</TableColumn>
          <TableColumn>НАЛОГ</TableColumn>
          <TableColumn>КОНЕЦ</TableColumn>
        </TableHeader>
        <TableBody>
          {result.months.map((month) => (
            <TableRow key={month.month}>
              <TableCell>{month.month}</TableCell>
              <TableCell>{month.date}</TableCell>
              <TableCell>{formatCurrency(month.startBalance)}</TableCell>
              <TableCell>
                {month.addition > 0 ? (
                  <span className="text-green-600">+{formatCurrency(month.addition)}</span>
                ) : (
                  '—'
                )}
              </TableCell>
              <TableCell className="text-green-600">
                +{formatCurrency(month.interest)}
              </TableCell>
              <TableCell className="text-red-500">
                -{formatCurrency(month.tax)}
              </TableCell>
              <TableCell className="font-medium">
                {formatCurrency(month.endBalance)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
