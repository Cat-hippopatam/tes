// app/profile/layout.tsx
import Link from 'next/link'
import { ReactNode } from 'react'
import { 
  User, 
  Settings, 
  Heart, 
  CreditCard, 
  BookOpen,
  LogOut 
} from 'lucide-react';

interface ProfileLayoutProps {
  children: ReactNode
}

const navigation = [
  { 
    name: 'Обзор', 
    href: '/profile', 
    icon: User,
    description: 'Ваша статистика и активность'
  },
  { 
    name: 'Настройки', 
    href: '/profile/settings', 
    icon: Settings,
    description: 'Личные данные и профиль'
  },
  { 
    name: 'Избранное', 
    href: '/profile/favorites', 
    icon: Heart,
    description: 'Сохраненные материалы'
  },
  { 
    name: 'Подписка', 
    href: '/profile/subscription', 
    icon: CreditCard,
    description: 'Управление подпиской'
  },
  { 
    name: 'Мои курсы', 
    href: '/profile/courses', 
    icon: BookOpen,
    description: 'Прогресс обучения',
    badge: 'В разработке'
  },
]

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Верхний колонтитул профиля */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-semibold text-[#264653]">
              Личный кабинет
            </h1>
            <button className="flex items-center gap-2 px-3 py-2 text-[#6C757D] hover:text-[#264653] transition-colors">
              <LogOut size={18} />
              <span className="text-sm">Выйти</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Сайдбар */}
          <aside className="w-full lg:w-80 shrink-0">
            {/* Карточка профиля (мини) */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#F4A261] to-[#2A9D8F] flex items-center justify-center text-white text-2xl font-semibold">
                  JD
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-[#264653] truncate">
                    John Doe
                  </h2>
                  <p className="text-sm text-[#6C757D] truncate">
                    @johndoe
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="inline-block w-2 h-2 bg-[#2A9D8F] rounded-full"></span>
                    <span className="text-xs text-[#6C757D]">Online</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Навигация */}
            <nav className="bg-white rounded-xl shadow-sm p-4 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 text-[#6C757D] hover:text-[#264653] hover:bg-[#F8F9FA] rounded-lg transition-all group relative"
                  >
                    <Icon size={20} className="shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{item.name}</span>
                        {item.badge && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-[#F8F9FA] text-[#6C757D] rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#6C757D] opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.description}
                      </p>
                    </div>
                    {/* Индикатор активности - будет подсвечиваться на активной странице */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#F4A261] rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                )
              })}
            </nav>

            {/* Блок с подпиской */}
            <div className="bg-gradient-to-br from-[#264653] to-[#1a3a4a] rounded-xl shadow-sm p-6 mt-4 text-white">
              <h3 className="font-semibold mb-2">Премиум доступ</h3>
              <p className="text-sm text-white/80 mb-4">
                Получите доступ ко всем материалам и эксклюзивным курсам
              </p>
              <button className="w-full bg-[#F4A261] hover:bg-[#e08e4a] text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                Оформить подписку
              </button>
            </div>
          </aside>

          {/* Основной контент */}
          <main className="flex-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}