'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button, Spinner } from '@heroui/react';
import DepositForm from './components/DepositForm';
import ResultsTable from './components/ResultsTable';
import DepositChart from './components/Chart';
import { DepositCalculator } from './deposit.service';
import { DepositInput, DepositResult } from './types';
import { useModalStore } from '@/store/useModalStore';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function DepositCalculatorPage() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DepositResult | null>(null);
  const { openModal } = useModalStore();

  const handleCalculate = (input: DepositInput) => {
    setIsLoading(true);
    
    // Имитация задержки расчета
    setTimeout(() => {
      const calculationResult = DepositCalculator.calculate(input);
      setResult(calculationResult);
      setIsLoading(false);

      // Если пользователь авторизован, сохраняем расчет
      if (session?.user) {
        // TODO: Сохранить в BusinessEvent через API
        console.log('Сохранение расчета для пользователя:', session.user);
      }
    }, 500);
  };

  const handleSave = () => {
    if (!session) {
      openModal('auth', { mode: 'login' });
      return;
    }
    // TODO: Сохранить расчет в избранное или историю
    console.log('Сохранение расчета');
  };

  const handleExportPDF = () => {
    if (!result) return;
    
    const printContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Калькулятор вкладов - Economikus</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; color: #264653; }
    h1 { color: #264653; border-bottom: 2px solid #2A9D8F; padding-bottom: 10px; }
    .summary { display: flex; gap: 20px; margin: 20px 0; }
    .summary-item { background: #F8F6F3; padding: 15px; border-radius: 8px; flex: 1; }
    .summary-item strong { display: block; font-size: 24px; color: #2A9D8F; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { border: 1px solid #E8E4DE; padding: 10px; text-align: center; }
    th { background: #2A9D8F; color: white; }
    tr:nth-child(even) { background: #F8F6F3; }
    .footer { margin-top: 30px; text-align: center; color: #6C757D; font-size: 12px; }
  </style>
</head>
<body>
  <h1>🏦 Калькулятор вкладов</h1>
  <p>Дата расчёта: ${new Date().toLocaleDateString('ru-RU')}</p>
  
  <div class="summary">
    <div class="summary-item">
      <span>Сумма в конце срока</span>
      <strong>${new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(result.finalAmount)}</strong>
    </div>
    <div class="summary-item">
      <span>Начисленные проценты</span>
      <strong>${new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(result.totalInterest)}</strong>
    </div>
  </div>
  
  <h2>График начисления процентов</h2>
  <table>
    <thead>
      <tr>
        <th>Период</th>
        <th>Начислено</th>
        <th>Итого</th>
      </tr>
    </thead>
    <tbody>
      ${result.months.map((p, i) => `
        <tr>
          <td>${i + 1} мес</td>
          <td>${new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(p.interest)}</td>
          <td>${new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(p.endBalance)}</td>
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

  const handleExportCSV = () => {
    if (!result) return;
    
    const headers = ['Период', 'Начислено', 'Итого'];
    const rows = result.months.map((p, i) => [
      `${i + 1} мес`,
      p.interest,
      p.endBalance
    ]);
    
    const csv = [headers, ...rows]
      .map(row => row.join(','))
      .join('\n');
    
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `deposit-schedule-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" color="warning" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Шапка */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/calculator"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" style={{ color: '#6C757D' }} />
            </Link>
            <h1 className="text-2xl font-bold" style={{ color: '#264653' }}>
              Калькулятор вкладов
            </h1>
          </div>
        </div>
      </div>

      {/* Основной контент */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Левая колонка - форма */}
          <div>
            <DepositForm onCalculate={handleCalculate} isLoading={isLoading} />
          </div>

          {/* Правая колонка - результаты */}
          <div className="space-y-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Spinner size="lg" color="warning" />
              </div>
            ) : result ? (
              <>
                <div className="flex justify-end gap-2 flex-wrap">
                  <Button
                    onPress={handleExportPDF}
                    size="sm"
                    variant="bordered"
                  >
                    📄 PDF
                  </Button>
                  <Button
                    onPress={handleExportCSV}
                    size="sm"
                    variant="bordered"
                  >
                    📥 CSV
                  </Button>
                  <Button
                    onPress={handleSave}
                    size="sm"
                    style={{
                      backgroundColor: '#2A9D8F',
                      color: 'white',
                    }}
                  >
                    💾 Сохранить
                  </Button>
                </div>
                <ResultsTable result={result} />
                <DepositChart result={result} />
              </>
            ) : (
              <div className="bg-white rounded-xl p-8 text-center border-2 border-dashed border-gray-300">
                <p className="text-gray-500">
                  Введите параметры вклада и нажмите (Рассчитать)
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Модалка авторизации теперь глобальная через ModalProvider */}
    </div>
  );
}