'use client';

import { useState } from 'react';
import DepositForm from './components/DepositForm';
import ResultsTable from './components/ResultsTable';
import DepositChart from './components/Chart';
import { DepositCalculator } from './deposit.service';
import { DepositInput, DepositResult } from './types';
import { Button } from '@/components/common';

export default function DepositPage() {
  const [result, setResult] = useState<DepositResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [savedCalculations, setSavedCalculations] = useState<DepositInput[]>([]);

  const handleCalculate = (input: DepositInput) => {
    setIsLoading(true);
    
    // Имитация загрузки
    setTimeout(() => {
      const calculationResult = DepositCalculator.calculate(input);
      setResult(calculationResult);
      setIsLoading(false);
    }, 500);
  };

  const handleSaveCalculation = () => {
    // TODO: Сохранять расчет в localStorage или через API
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
      <strong>${formatCurrency(result.finalAmount)}</strong>
    </div>
    <div class="summary-item">
      <span>Начисленные проценты</span>
      <strong>${formatCurrency(result.totalInterest)}</strong>
    </div>
    <div class="summary-item">
      <span>Чистая прибыль</span>
      <strong>${formatCurrency(result.profit)}</strong>
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
          <td>${formatCurrency(p.interest)}</td>
          <td>${formatCurrency(p.endBalance)}</td>
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Шапка */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#264653]">
                Калькулятор вкладов
              </h1>
              <p className="text-gray-600 mt-1">
                Рассчитайте доходность вклада с учетом капитализации и пополнений
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Button
                variant="outline"
                onClick={handleSaveCalculation}
                disabled={!result}
              >
                💾 Сохранить
              </Button>
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
            <DepositForm onCalculate={handleCalculate} isLoading={isLoading} />
            
            {/* Полезные подсказки */}
            <div className="mt-6 bg-white p-6 rounded-xl shadow-sm">
              <h4 className="font-medium text-[#264653] mb-3">💡 Полезно знать</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-[#2A9D8F]">•</span>
                  <span>
                    <strong className="text-[#264653]">Капитализация</strong> — 
                    прибавление процентов к сумме вклада, увеличивает доход
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#2A9D8F]">•</span>
                  <span>
                    <strong className="text-[#264653]">Эффективная ставка</strong> — 
                    реальная доходность с учетом капитализации, выше номинальной
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#2A9D8F]">•</span>
                  <span>
                    <strong className="text-[#264653]">Налог на проценты</strong> — 
                    13% с дохода свыше установленного лимита (85 000 ₽ в год для резидентов)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#2A9D8F]">•</span>
                  <span>
                    <strong className="text-[#264653]">АСВ</strong> — 
                    вклады застрахованы Агентством по страхованию вкладов до 1,4 млн ₽
                  </span>
                </li>
              </ul>
            </div>

            {/* История расчетов */}
            {savedCalculations.length > 0 && (
              <div className="mt-6 bg-white p-6 rounded-xl shadow-sm">
                <h4 className="font-medium text-[#264653] mb-3">📋 Последние расчеты</h4>
                <div className="space-y-2">
                  {savedCalculations.map((calc, index) => (
                    <button
                      key={index}
                      onClick={() => handleCalculate(calc)}
                      className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-[#2A9D8F] transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-[#264653]">
                          {formatCurrency(calc.initialAmount)} • {calc.term} мес
                        </span>
                        <span className="text-xs text-gray-500">
                          {calc.interestRate}% ставка
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
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#2A9D8F] mb-4" />
                <p className="text-gray-500">Рассчитываем вклад...</p>
              </div>
            ) : result ? (
              <>
                {/* Ключевые показатели */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-500 mb-1">Сумма в конце срока</p>
                    <p className="text-2xl font-bold text-[#2A9D8F]">
                      {formatCurrency(result.finalAmount)}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-500 mb-1">Начисленные проценты</p>
                    <p className="text-2xl font-bold text-[#F4A261]">
                      {formatCurrency(result.totalInterest)}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-500 mb-1">Чистая прибыль</p>
                    <p className="text-2xl font-bold text-[#264653]">
                      {formatCurrency(result.profit)}
                    </p>
                    {result.totalTax > 0 && (
                      <p className="text-xs text-gray-400 mt-1">
                        минус налог {formatCurrency(result.totalTax)}
                      </p>
                    )}
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-500 mb-1">Эффективная ставка</p>
                    <p className="text-2xl font-bold text-[#264653]">
                      {result.effectiveRate.toFixed(2)}%
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      с учетом капитализации
                    </p>
                  </div>
                </div>

                {/* График */}
                <DepositChart result={result} />

                {/* Таблица результатов */}
                <ResultsTable result={result} />

                {/* Сравнение с другими вариантами */}
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h4 className="font-medium text-[#264653] mb-4">🔄 Сравнить с другими вариантами</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => {
                        const params: DepositInput = {
                          initialAmount: result.months[0]?.startBalance || 100000,
                          monthlyAddition: 10000,
                          interestRate: 8,
                          term: 12,
                          capitalization: 'monthly',
                          taxRate: 13
                        };
                        handleCalculate(params);
                      }}
                      className="p-3 border border-gray-200 rounded-lg hover:border-[#2A9D8F] text-left"
                    >
                      <p className="text-xs text-gray-500">С пополнением</p>
                      <p className="text-sm font-medium text-[#264653]">+10 000 ₽/мес</p>
                      <p className="text-xs text-[#2A9D8F] mt-1">
                        выше доход
                      </p>
                    </button>
                    <button
                      onClick={() => {
                        const params: DepositInput = {
                          initialAmount: result.months[0]?.startBalance || 100000,
                          monthlyAddition: 0,
                          interestRate: 10,
                          term: 12,
                          capitalization: 'monthly',
                          taxRate: 13
                        };
                        handleCalculate(params);
                      }}
                      className="p-3 border border-gray-200 rounded-lg hover:border-[#2A9D8F] text-left"
                    >
                      <p className="text-xs text-gray-500">Ставка 10%</p>
                      <p className="text-sm font-medium text-[#264653]">высокая ставка</p>
                      <p className="text-xs text-[#2A9D8F] mt-1">
                        больше прибыль
                      </p>
                    </button>
                    <button
                      onClick={() => {
                        const params: DepositInput = {
                          initialAmount: result.months[0]?.startBalance || 100000,
                          monthlyAddition: 0,
                          interestRate: 6,
                          term: 24,
                          capitalization: 'monthly',
                          taxRate: 13
                        };
                        handleCalculate(params);
                      }}
                      className="p-3 border border-gray-200 rounded-lg hover:border-[#2A9D8F] text-left"
                    >
                      <p className="text-xs text-gray-500">На 2 года</p>
                      <p className="text-sm font-medium text-[#264653]">долгосрочный</p>
                      <p className="text-xs text-[#2A9D8F] mt-1">
                        ставка ниже
                      </p>
                    </button>
                  </div>
                </div>

                {/* Подсказка по налогу */}
                {result.totalTax > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">📝</div>
                      <div>
                        <h4 className="font-medium text-amber-700 mb-1">
                          Налог на доход по вкладам
                        </h4>
                        <p className="text-sm text-amber-600">
                          С суммы начисленных процентов удержан налог {formatCurrency(result.totalTax)}. 
                          Это необходимо, если ваш доход по вкладам превысил 85 000 ₽ за год.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white p-12 rounded-xl shadow-sm flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-4xl">🏦</span>
                </div>
                <h3 className="text-lg font-medium text-[#264653] mb-2">
                  Начните расчет вклада
                </h3>
                <p className="text-gray-500 max-w-sm">
                  Заполните параметры вклада в форме слева, чтобы увидеть доходность, график начисления процентов и итоговую сумму
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
