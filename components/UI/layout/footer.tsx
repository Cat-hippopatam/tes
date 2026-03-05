import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#e1e6e8] text-white">
      {/* Основная часть футера */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* О нас */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-[#F4A261] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">Э</span>
              </div>
              <h3 className="text-xl font-bold">Экономикус</h3>
            </div>
            <p className="text-white text-sm mb-4">
              Образовательная платформа для повышения финансовой грамотности. 
              Учим управлять деньгами эффективно и достигать финансовых целей.
            </p>
            <div className="flex space-x-4">
              {/* VK */}
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#F4A261] transition-colors"
                aria-label="VK"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14C20.67 22 22 20.67 22 15.07V8.93C22 3.33 20.67 2 15.07 2zm3.57 14.5h-2.02c-.43 0-.57-.36-1.34-1.14-.67-.65-1.02-.79-1.19-.79-.21 0-.33.12-.33.44v1.22c0 .29-.16.43-.85.43-1.54 0-3.23-.96-4.42-2.72-1.79-2.35-2.28-4.1-2.28-4.47 0-.21.12-.43.5-.43h2.02c.36 0 .5.21.65.58.72 1.9 1.92 3.57 2.42 3.57.18 0 .27-.12.27-.44v-1.73c-.06-.99-.58-1.07-.58-1.42 0-.17.14-.34.36-.34h2.84c.29 0 .36.21.36.51v2.74c0 .29.12.43.21.43.18 0 .36-.14.74-.58.9-1.07 1.55-2.69 1.55-2.69.09-.18.27-.36.5-.36h2.02c.36 0 .5.21.36.58-.14.43-1.01 2.38-2.09 3.46-.75.79-1.07 1.03-1.07 1.25 0 .18.21.43.43.68.86.94 1.67 2.02 1.67 2.02.29.36.14.58-.29.58z"/>
                </svg>
              </a>
              {/* Telegram */}
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#F4A261] transition-colors"
                aria-label="Telegram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .53-1.53.52-.5-.01-1.47-.28-2.19-.51-.88-.28-1.58-.43-1.52-.95.03-.26.39-.52 1.07-.79 4.18-1.82 6.97-3.02 8.38-3.61 3.99-1.67 4.82-1.96 5.36-1.97.12 0 .38.03.55.18.15.13.19.31.21.45-.02.15-.02.47-.03.48z"/>
                </svg>
              </a>
              {/* YouTube */}
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#F4A261] transition-colors"
                aria-label="YouTube"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Курсы */}
          <div>
            <h3 className="text-lg font-bold mb-4">Курсы</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/courses/finance-basics" className="text-white hover:text-[#F4A261] transition-colors text-sm">
                  Основы финансов
                </Link>
              </li>
              <li>
                <Link href="/courses/investing-basics" className="text-white hover:text-[#F4A261] transition-colors text-sm">
                  Инвестиции для начинающих
                </Link>
              </li>
              <li>
                <Link href="/courses/pension-planning" className="text-white hover:text-[#F4A261] transition-colors text-sm">
                  Пенсионное планирование
                </Link>
              </li>
              <li>
                <Link href="/courses/tax-literacy" className="text-white hover:text-[#F4A261] transition-colors text-sm">
                  Налоговая грамотность
                </Link>
              </li>
              <li>
                <Link href="/courses/financial-freedom" className="text-white hover:text-[#F4A261] transition-colors text-sm">
                  Финансовая независимость
                </Link>
              </li>
            </ul>
          </div>

          {/* Калькуляторы */}
          <div>
            <h3 className="text-lg font-bold mb-4">Калькуляторы</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/calculator/mortgage" className="text-white hover:text-[#F4A261] transition-colors text-sm">
                  Ипотечный калькулятор
                </Link>
              </li>
              <li>
                <Link href="/calculator/credit" className="text-white hover:text-[#F4A261] transition-colors text-sm">
                  Кредитный калькулятор
                </Link>
              </li>
              <li>
                <Link href="/calculator/deposit" className="text-white hover:text-[#F4A261] transition-colors text-sm">
                  Депозитный калькулятор
                </Link>
              </li>
              <li>
                <Link href="/calculator/investment" className="text-white hover:text-[#F4A261] transition-colors text-sm">
                  Инвестиционный калькулятор
                </Link>
              </li>
            </ul>
          </div>

          {/* Контакты */}
          <div>
            <h3 className="text-lg font-bold mb-4">Контакты</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-[#F4A261] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-white text-sm">support@ekonomikus.ru</span>
              </li>
              <li className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-[#F4A261] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-white text-sm">8 (800) 123-45-67</span>
              </li>
              <li className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-[#F4A261] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-white text-sm">г. Москва, ул. Финансовая, д. 1</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Нижняя часть футера */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white text-sm mb-4 md:mb-0">
              © {currentYear} Экономикус. Все права защищены.
            </p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <Link href="/privacy" className="text-white hover:text-[#F4A261] text-sm transition-colors">
                Политика конфиденциальности
              </Link>
              <Link href="/terms" className="text-white hover:text-[#F4A261] text-sm transition-colors">
                Условия использования
              </Link>
              <Link href="/offer" className="text-white hover:text-[#F4A261] text-sm transition-colors">
                Договор оферты
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}