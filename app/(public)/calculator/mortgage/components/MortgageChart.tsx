'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { MonthlyPayment } from '../types';
import { Button } from '@/components/common';

interface MortgageChartProps {
  schedule: MonthlyPayment[];
  loanAmount: number;
}

// 1. Вспомогательная функция за пределами компонента
const formatCompactCurrency = (value: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    notation: 'compact',
    style: 'currency',
    currency: 'RUB',
  }).format(value);
};

export function MortgageChart({ schedule, loanAmount }: MortgageChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [chartType, setChartType] = useState<'payment' | 'debt' | 'comparison'>('payment');

  // 2. Все функции рисования с правильными зависимостями
  const drawPaymentChart = useCallback((
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    padding: { top: number; right: number; bottom: number; left: number },
    chartWidth: number,
    chartHeight: number
  ) => {
    if (!schedule.length) return;
    
    const displaySchedule = schedule.slice(0, 60);
    const maxPayment = Math.max(...displaySchedule.map(p => p.payment)) * 1.1;

    ctx.beginPath();
    ctx.strokeStyle = '#F4A261';
    ctx.lineWidth = 2;

    displaySchedule.forEach((payment, index) => {
      const x = padding.left + (index / (displaySchedule.length - 1)) * chartWidth;
      const y = padding.top + (1 - payment.payment / maxPayment) * chartHeight;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    displaySchedule.forEach((payment, index) => {
      const x = padding.left + (index / (displaySchedule.length - 1)) * chartWidth;
      const y = padding.top + (1 - payment.payment / maxPayment) * chartHeight;

      ctx.beginPath();
      ctx.fillStyle = '#F4A261';
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 1;
      ctx.stroke();
    });
  }, [schedule]);

  const drawDebtChart = useCallback((
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    padding: { top: number; right: number; bottom: number; left: number },
    chartWidth: number,
    chartHeight: number
  ) => {
    if (!schedule.length) return;
    
    const displaySchedule = schedule.slice(0, 60);
    const maxDebt = loanAmount;

    ctx.beginPath();
    ctx.strokeStyle = '#2A9D8F';
    ctx.lineWidth = 2;

    displaySchedule.forEach((payment, index) => {
      const x = padding.left + (index / (displaySchedule.length - 1)) * chartWidth;
      const y = padding.top + (1 - payment.remainingDebt / maxDebt) * chartHeight;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    ctx.lineTo(
      padding.left + chartWidth,
      padding.top + chartHeight
    );
    ctx.lineTo(padding.left, padding.top + chartHeight);
    ctx.closePath();
    ctx.fillStyle = 'rgba(42, 157, 143, 0.1)';
    ctx.fill();
  }, [schedule, loanAmount]);

  const drawComparisonChart = useCallback((
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    padding: { top: number; right: number; bottom: number; left: number },
    chartWidth: number,
    chartHeight: number
  ) => {
    if (!schedule.length) return;
    
    const years = Math.ceil(schedule.length / 12);
    const barWidth = (chartWidth / years) * 0.7;
    const barSpacing = (chartWidth / years) * 0.3;

    let maxTotal = 0;
    for (let year = 0; year < years; year++) {
      const startMonth = year * 12;
      const endMonth = Math.min(startMonth + 12, schedule.length);
      
      let principalTotal = 0;
      let interestTotal = 0;

      for (let month = startMonth; month < endMonth; month++) {
        if (schedule[month]) {
          principalTotal += schedule[month].principal;
          interestTotal += schedule[month].interest;
        }
      }
      maxTotal = Math.max(maxTotal, principalTotal + interestTotal);
    }
    maxTotal *= 1.2;

    for (let year = 0; year < years; year++) {
      const startMonth = year * 12;
      const endMonth = Math.min(startMonth + 12, schedule.length);
      
      let principalTotal = 0;
      let interestTotal = 0;

      for (let month = startMonth; month < endMonth; month++) {
        if (schedule[month]) {
          principalTotal += schedule[month].principal;
          interestTotal += schedule[month].interest;
        }
      }
      
      const x = padding.left + year * (barWidth + barSpacing) + barSpacing / 2;
      
      const principalHeight = (principalTotal / maxTotal) * chartHeight;
      ctx.fillStyle = '#2A9D8F';
      ctx.fillRect(
        x,
        padding.top + chartHeight - principalHeight,
        barWidth / 2,
        principalHeight
      );

      const interestHeight = (interestTotal / maxTotal) * chartHeight;
      ctx.fillStyle = '#F4A261';
      ctx.fillRect(
        x + barWidth / 2,
        padding.top + chartHeight - interestHeight,
        barWidth / 2,
        interestHeight
      );

      ctx.fillStyle = '#264653';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(
        `${year + 1} год`,
        x + barWidth / 2,
        padding.top + chartHeight + 20
      );
    }

    ctx.fillStyle = '#2A9D8F';
    ctx.fillRect(padding.left, 10, 12, 12);
    ctx.fillStyle = '#264653';
    ctx.font = '10px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Основной долг', padding.left + 20, 20);

    ctx.fillStyle = '#F4A261';
    ctx.fillRect(padding.left + 100, 10, 12, 12);
    ctx.fillStyle = '#264653';
    ctx.fillText('Проценты', padding.left + 120, 20);
  }, [schedule]);

  const drawAxes = useCallback((
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    padding: { top: number; right: number; bottom: number; left: number },
    chartWidth: number,
    chartHeight: number
  ) => {
    if (!schedule.length) return;
    
    ctx.beginPath();
    ctx.strokeStyle = '#6C757D';
    ctx.lineWidth = 1;

    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, height - padding.bottom);
    
    ctx.moveTo(padding.left, height - padding.bottom);
    ctx.lineTo(width - padding.right, height - padding.bottom);
    
    ctx.stroke();

    ctx.fillStyle = '#6C757D';
    ctx.font = '10px Arial';
    ctx.textAlign = 'right';
    
    const maxPayment = Math.max(...schedule.map(p => p.payment));
    
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (i / 5) * chartHeight;
      let value: number;
      
      if (chartType === 'debt') {
        value = loanAmount * (1 - i / 5);
      } else if (chartType === 'comparison') {
        value = maxPayment * 12 * (1 - i / 5);
      } else {
        value = maxPayment * (1 - i / 5);
      }
      
      ctx.fillText(
        formatCompactCurrency(value),
        padding.left - 10,
        y + 3
      );
    }

    ctx.textAlign = 'center';
    for (let i = 0; i <= 5; i++) {
      const x = padding.left + (i / 5) * chartWidth;
      const month = Math.floor((i / 5) * Math.min(60, schedule.length));
      
      ctx.fillText(
        `${month} мес`,
        x,
        height - padding.bottom + 20
      );
    }
  }, [schedule, loanAmount, chartType]);

  // 3. Основная функция отрисовки
  const drawChart = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !schedule.length) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    ctx.scale(dpr, dpr);
    
    const width = rect.width;
    const height = rect.height;
    const padding = { top: 20, right: 20, bottom: 40, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    if (chartType === 'payment') {
      drawPaymentChart(ctx, width, height, padding, chartWidth, chartHeight);
    } else if (chartType === 'debt') {
      drawDebtChart(ctx, width, height, padding, chartWidth, chartHeight);
    } else {
      drawComparisonChart(ctx, width, height, padding, chartWidth, chartHeight);
    }

    drawAxes(ctx, width, height, padding, chartWidth, chartHeight);
  }, [chartType, drawPaymentChart, drawDebtChart, drawComparisonChart, drawAxes, schedule.length]);

  // 4. useEffect - ВСЕГДА вызывается, но проверка внутри
  useEffect(() => {
    drawChart();
  }, [drawChart]);

  // 5. Возвращаем fallback, если нет данных
  if (!schedule.length) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm text-center text-gray-500">
        Нет данных для отображения графика
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-[#264653]">Визуализация</h3>
        <div className="flex gap-2">
          <Button
            variant={chartType === 'payment' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setChartType('payment')}
          >
            Платежи
          </Button>
          <Button
            variant={chartType === 'debt' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setChartType('debt')}
          >
            Остаток долга
          </Button>
          <Button
            variant={chartType === 'comparison' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setChartType('comparison')}
          >
            По годам
          </Button>
        </div>
      </div>

      <div className="relative" style={{ height: '300px' }}>
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: '100%',
            display: 'block'
          }}
        />
      </div>

      {/* Пояснения - заменил bg-gradient-to-r на bg-linear-to-r как просит Tailwind */}
      <div className="mt-4 grid grid-cols-3 gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#F4A261] rounded-full" />
          <span>Ежемесячный платеж</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#2A9D8F] rounded-full" />
          <span>Остаток долга</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-linear-to-r from-[#2A9D8F] to-[#F4A261] rounded" />
          <span>Соотношение долга и процентов</span>
        </div>
      </div>
    </div>
  );
}