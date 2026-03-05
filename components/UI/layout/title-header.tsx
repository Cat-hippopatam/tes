'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

const titles: Record<string, string> = {
  '/': 'Главная',
  '/courses': 'Курсы',
  '/calculator': 'Калькуляторы',
  '/articles': 'Статьи',
  '/about': 'О проекте',
  '/profile': 'Профиль',
  '/profile/settings': 'Настройки',
  '/profile/favorites': 'Избранное',
  '/profile/subscription': 'Подписка',
  '/profile/courses': 'Мои курсы',
};

export default function TitleHeader() {
  const pathname = usePathname();
  
  // Находим заголовок для текущего пути
  const title = titles[pathname] || titles[pathname.replace(/\/$/, '')] || '';

  if (!title) return null;

  return (
    <div className="bg-gradient-to-r from-[#264653] to-[#1a3a45] text-white py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
      </div>
    </div>
  );
}