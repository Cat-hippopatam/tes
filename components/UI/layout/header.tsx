'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { siteConfig } from '@/config/site.config';
import { useModalStore } from '@/store/useModalStore';

interface NavItem {
  name: string;
  href: string;
}

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { openModal } = useModalStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOpenAuth = (mode: 'login' | 'register') => {
    openModal('auth', { mode });
  };

  return (
    <header 
      className={`w-full transition-all duration-300 sticky top-0 left-0 right-0 z-50 border-b ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-white py-3'
      }`}
      style={{ borderColor: isScrolled ? '#E8E4DE' : 'transparent' }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#F4A261] rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-xl">Э</span>
            </div>
            <span className="font-bold text-xl text-[#264653] hidden sm:inline">Экономикус</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {siteConfig.navigation.map((item: NavItem) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-[#F4A261] ${
                  pathname === item.href ? 'text-[#F4A261]' : 'text-[#264653]'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <button 
              onClick={() => handleOpenAuth('login')}
              className="px-4 py-2 text-sm font-medium rounded-lg border-2 border-transparent transition-all hover:border-[#F4A261] hover:text-[#F4A261]"
              style={{ color: '#264653' }}
            >
              Войти
            </button>
            <button 
              onClick={() => handleOpenAuth('register')}
              className="px-4 py-2 text-sm font-medium rounded-lg transition-all hover:opacity-90"
              style={{ backgroundColor: '#F4A261', color: 'white' }}
            >
              Регистрация
            </button>
          </div>

          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6 text-[#264653]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-2 pt-4">
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
              <div className="flex gap-2 pt-4">
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleOpenAuth('login');
                  }}
                  className="flex-1 px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all"
                  style={{ borderColor: '#F4A261', color: '#F4A261' }}
                >
                  Войти
                </button>
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleOpenAuth('register');
                  }}
                  className="flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all hover:opacity-90"
                  style={{ backgroundColor: '#F4A261', color: 'white' }}
                >
                  Регистрация
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}