import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/common/Button';

export const Hero = () => {
  return (
    <section className="pt-24 pb-16 bg-gradient-to-br from-[#F8F9FA] to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Заголовок */}
          <h1 className="text-5xl md:text-6xl font-bold text-[#264653] mb-6">
            Стань финансово{' '}
            <span className="text-[#F4A261]">грамотным</span>
          </h1>
          
          {/* Подзаголовок */}
          <p className="text-xl text-[#6C757D] mb-10 max-w-2xl mx-auto">
            Бесплатные курсы, калькуляторы и статьи, которые помогут вам управлять деньгами, 
            инвестировать и достигать финансовых целей
          </p>

          {/* Кнопки */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/courses">
              <Button 
                variant="primary" 
                size="lg"
                className="bg-[#F4A261] hover:bg-[#e08e4a] text-white min-w-[200px]"
              >
                Начать учиться бесплатно
              </Button>
            </Link>
            <Link href="/calculator">
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-[#F4A261] text-[#F4A261] hover:bg-[#F4A261] hover:text-white min-w-[200px]"
              >
                Попробовать калькуляторы
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};