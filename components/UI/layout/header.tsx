'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/common/Button';

const navigation = [
  { name: 'Курсы', href: '/courses' },
  { name: 'Калькуляторы', href: '/calculator' },
  { name: 'Статьи', href: '/articles' },
  { name: 'Вопросы и ответы', href: '/faq' },
];

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-white py-3'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Логотип */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#F4A261] rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-xl">Э</span>
            </div>
            <span className="font-bold text-xl text-[#264653]">Экономикус</span>
          </Link>

          {/* Десктопная навигация */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-base font-medium transition-colors hover:text-[#F4A261] ${
                  pathname === item.href ? 'text-[#F4A261]' : 'text-[#264653]'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Правая часть: поиск и кнопки */}
          <div className="hidden md:flex items-center gap-4">
            {/* Поиск */}
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <svg className="w-5 h-5 text-[#264653]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Кнопки авторизации */}
            <Link href="/auth/signin">
              <Button variant="outline" size="sm" className="border-[#F4A261] text-[#F4A261] hover:bg-[#F4A261] hover:text-white">
                Войти
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button variant="primary" size="sm" className="bg-[#F4A261] hover:bg-[#e08e4a] text-white">
                Регистрация
              </Button>
            </Link>
          </div>

          {/* Мобильная кнопка меню */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6 text-[#264653]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Мобильное меню */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-3 pt-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                    pathname === item.href
                      ? 'bg-[#F4A261] text-white'
                      : 'text-[#264653] hover:bg-gray-100'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex gap-2 pt-2">
                <Link href="/auth/signin" className="flex-1" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full border-[#F4A261] text-[#F4A261]">
                    Войти
                  </Button>
                </Link>
                <Link href="/auth/signup" className="flex-1" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="primary" size="sm" className="w-full bg-[#F4A261] text-white">
                    Регистрация
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}