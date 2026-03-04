'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { MonthlyPayment } from '../types';
import { Button } from '@/components/common';

interface CreditChartProps {
  schedule: MonthlyPayment[];
  loanAmount: number;
}

const formatCompactCurrency = (value: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    notation: 'compact',
    style: 'currency',
    currency: 'RUB',
  }).format(value);
};

export function CreditChart({ schedule, loanAmount }: CreditChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [chartType, setChartType] = useState<'payment' | 'debt' | 'interest'>('payment');

  // 1. Сначала объявляем ВСЕ функции отрисовки
  const drawPaymentChart = useCallback((
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    padding: { top: number; right: number; bottom: number; left: number },
    chartWidth: number,
    chartHeight: number
  ) => {
    if (!schedule.length) return;
    
    const displaySchedule = schedule.slice(0, 36);
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

      if (payment.isEarlyRepayment) {
        ctx.beginPath();
        ctx.fillStyle = '#2A9D8F';
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });

    ctx.stroke();
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
    
    const displaySchedule = schedule.slice(0, 36);
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

  const drawInterestChart = useCallback((
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    padding: { top: number; right: number; bottom: number; left: number },
    chartWidth: number,
    chartHeight: number
  ) => {
    if (!schedule.length) return;
    
    const years = Math.ceil(schedule.length / 12);
    const barWidth = (chartWidth / years) * 0.6;

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
      
      const x = padding.left + (year * (chartWidth / years)) + (chartWidth / years - barWidth) / 2;
      const maxTotal = Math.max(principalTotal + interestTotal) * 1.2;
      
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
  }, [schedule]);

  // 2. Функция отрисовки осей (теперь объявлена до drawChart)
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
      const value = chartType === 'debt' 
        ? loanAmount * (1 - i / 5)
        : maxPayment * (1 - i / 5);
      
      ctx.fillText(
        formatCompactCurrency(value),
        padding.left - 10,
        y + 3
      );
    }

    ctx.textAlign = 'center';
    for (let i = 0; i <= 6; i++) {
      const x = padding.left + (i / 6) * chartWidth;
      const month = Math.floor((i / 6) * Math.min(36, schedule.length));
      
      ctx.fillText(
        `${month} мес`,
        x,
        height - padding.bottom + 20
      );
    }
  }, [schedule, loanAmount, chartType]);

  // 3. Главная функция отрисовки (теперь drawAxes доступна)
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

    ctx.clearRect(0, 0, width, height);

    if (chartType === 'payment') {
      drawPaymentChart(ctx, width, height, padding, chartWidth, chartHeight);
    } else if (chartType === 'debt') {
      drawDebtChart(ctx, width, height, padding, chartWidth, chartHeight);
    } else {
      drawInterestChart(ctx, width, height, padding, chartWidth, chartHeight);
    }

    drawAxes(ctx, width, height, padding, chartWidth, chartHeight);
  }, [chartType, drawPaymentChart, drawDebtChart, drawInterestChart, drawAxes, schedule.length]);

  // 4. useEffect в самом конце
  useEffect(() => {
    drawChart();
  }, [drawChart]);

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
            variant={chartType === 'interest' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setChartType('interest')}
          >
            Проценты vs Долг
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

      <div className="mt-4 flex gap-6 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#F4A261] rounded-full" />
          <span>Ежемесячный платеж</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#2A9D8F] rounded-full" />
          <span>Остаток долга</span>
        </div>
        {schedule.some(p => p.isEarlyRepayment) && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#2A9D8F] rounded-full border-2 border-white ring-2 ring-[#2A9D8F]" />
            <span>Досрочное погашение</span>
          </div>
        )}
      </div>
    </div>
  );
}