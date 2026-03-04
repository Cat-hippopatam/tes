'use client';

import { useEffect, useRef } from 'react';
import { DepositResult } from '../types';

interface IProps {
  result: DepositResult | null;
}

// Упрощенная версия графика (можно заменить на recharts или chart.js)
export default function DepositChart({ result }: IProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!result || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Очистка canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const months = result.months;
    const maxBalance = Math.max(...months.map(m => m.endBalance));
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;

    // Рисование осей
    ctx.beginPath();
    ctx.strokeStyle = '#CBD5E0';
    ctx.lineWidth = 1;
    
    // Ось Y
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    
    // Ось X
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Рисование графика
    const stepX = (width - 2 * padding) / (months.length - 1);
    
    ctx.beginPath();
    ctx.strokeStyle = '#F4A261';
    ctx.lineWidth = 3;
    
    months.forEach((month, index) => {
      const x = padding + index * stepX;
      const y = height - padding - (month.endBalance / maxBalance) * (height - 2 * padding);
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();

    // Добавление точек
    months.forEach((month, index) => {
      const x = padding + index * stepX;
      const y = height - padding - (month.endBalance / maxBalance) * (height - 2 * padding);
      
      ctx.beginPath();
      ctx.fillStyle = '#264653';
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    });

  }, [result]);

  if (!result) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold" style={{ color: '#264653' }}>
        График роста вклада
      </h3>
      <canvas
        ref={canvasRef}
        width={600}
        height={300}
        className="w-full h-auto border border-gray-200 rounded-lg"
      />
    </div>
  );
}