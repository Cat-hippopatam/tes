'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button, Spinner } from '@heroui/react';
import DepositForm from './components/DepositForm';
import ResultsTable from './components/ResultsTable';
import DepositChart from './components/Chart';
import { DepositCalculator } from './deposit.service';
import { DepositInput, DepositResult } from './types';
import { AuthModal } from '@/components/UI/modals';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function DepositCalculatorPage() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DepositResult | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

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
      setIsAuthModalOpen(true);
      return;
    }
    // TODO: Сохранить расчет в избранное или историю
    console.log('Сохранение расчета');
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
                <div className="flex justify-end">
                  <Button
                    onPress={handleSave}
                    size="sm"
                    style={{
                      backgroundColor: '#2A9D8F',
                      color: 'white',
                    }}
                  >
                    Сохранить расчет
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

      {/* Модалка авторизации */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode="login"
      />
    </div>
  );
}