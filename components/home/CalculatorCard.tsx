'use client';

import React from 'react';
import Link from 'next/link';
import { Calculator } from '@/types/home';

interface CalculatorCardProps {
  calculator: Calculator;
}

export const CalculatorCard = ({ calculator }: CalculatorCardProps) => {
  const { title, description, icon, color, path, isPopular } = calculator;

  return (
    <Link href={path}>
      <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-[#F4A261] relative h-full">
        {isPopular && (
          <div className="absolute -top-3 -right-3 bg-[#F4A261] text-white px-3 py-1 rounded-full text-xs font-medium">
            Популярное
          </div>
        )}
        <div 
          className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl mb-4"
          style={{ backgroundColor: `${color}20`, color: color }}
        >
          {icon}
        </div>
        <h3 className="text-xl font-bold text-[#264653] mb-2">{title}</h3>
        <p className="text-[#6C757D] text-sm mb-4">{description}</p>
        <div className="flex items-center text-[#F4A261] font-medium">
          <span>Рассчитать</span>
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
};