// components/layout/Header.tsx (обновленная версия)
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/common/Button';
import { siteConfig } from '@/config/site.config';
import { useModalStore } from '@/store/useModalStore'; // добавляем импорт

interface NavItem {
  name: string;
  href: string;
}

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Используем стор вместо локального состояния
  const { openAuthModal } = useModalStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`w-full transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-white py-3'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#F4A261] rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-xl">Э</span>
            </div>
            <span className="font-bold text-xl text-[#264653]">Экономикус</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {siteConfig.navigation.map((item: NavItem) => (
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

          <div className="hidden md:flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <svg className="w-5 h-5 text-[#264653]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            <Button 
              variant="outline" 
              size="sm" 
              className="border-[#F4A261] text-[#F4A261] hover:bg-[#F4A261] hover:text-white"
              onClick={() => openAuthModal("login")} // Упростили!
            >
              Войти
            </Button>
            <Button 
              variant="primary" 
              size="sm" 
              className="bg-[#F4A261] hover:bg-[#e08e4a] text-white"
              onClick={() => openAuthModal("register")} // Упростили!
            >
              Регистрация
            </Button>
          </div>

          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6 text-[#264653]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-3 pt-4">
              {siteConfig.navigation.map((item: NavItem) => (
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
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 border-[#F4A261] text-[#F4A261]"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openAuthModal("login");
                  }}
                >
                  Войти
                </Button>
                <Button 
                  variant="primary" 
                  size="sm" 
                  className="flex-1 bg-[#F4A261] text-white"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openAuthModal("register");
                  }}
                >
                  Регистрация
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}