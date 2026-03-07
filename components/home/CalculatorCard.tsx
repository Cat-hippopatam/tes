'use client';

import React from 'react';
import Link from 'next/link';

interface CalculatorCardProps {
  calculator: {
    id: string;
    title: string;
    description?: string;
    slug: string;
    icon?: string;
  };
}

export const CalculatorCard = ({ calculator }: CalculatorCardProps) => {
  return (
    <Link href={`/calculator/${calculator.slug}`}>
      <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-[#F4A261] relative h-full">
        <div className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl mb-4 bg-[#F4A261]/10">
          {calculator.icon || '🧮'}
        </div>
        <h3 className="text-xl font-bold text-[#264653] mb-2">{calculator.title}</h3>
        <p className="text-[#6C757D] text-sm mb-4">{calculator.description}</p>
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