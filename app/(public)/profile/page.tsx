// app/profile/page.tsx - ОБЗОР ПРОФИЛЯ
'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useProfile } from '@/hoc/useProfile';
import { 
  Eye, 
  Users, 
  Heart, 
  Award,
  Clock,
  BookOpen
} from 'lucide-react';

export default function ProfileOverviewPage() {
  const { data: session, status } = useSession()
  const { profile, loading } = useProfile()

  if (status === 'unauthenticated') {
    redirect('/auth/signin')
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-[#6C757D]">Загрузка...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div>
        <h1 className="text-2xl font-bold text-[#264653]">
          Добро пожаловать, {profile?.displayName}!
        </h1>
        <p className="text-[#6C757D] mt-1">
          Ваша статистика и последние действия
        </p>
      </div>

      {/* Карточки статистики */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6C757D]">Просмотры</p>
              <p className="text-2xl font-bold text-[#264653] mt-1">
                {profile?.stats.totalViews}
              </p>
            </div>
            <div className="w-10 h-10 bg-[#F4A261]/10 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-[#F4A261]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6C757D]">Подписчики</p>
              <p className="text-2xl font-bold text-[#264653] mt-1">
                {profile?.stats.subscribers}
              </p>
            </div>
            <div className="w-10 h-10 bg-[#2A9D8F]/10 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-[#2A9D8F]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6C757D]">В избранном</p>
              <p className="text-2xl font-bold text-[#264653] mt-1">
                {profile?.stats.favoritesCount || 0}
              </p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-red-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6C757D]">Материалов</p>
              <p className="text-2xl font-bold text-[#264653] mt-1">
                {profile?.stats.contentCount || 0}
              </p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Две колонки */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Левая колонка - последние действия */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-[#264653]">
            Последние действия
          </h2>
          
          {/* Placeholder для истории */}
          <div className="bg-[#F8F9FA] rounded-lg p-8 text-center">
            <Clock className="w-12 h-12 text-[#6C757D] mx-auto mb-3" />
            <p className="text-[#6C757D]">
              Здесь появится история ваших действий
            </p>
          </div>
        </div>

        {/* Правая колонка - прогресс */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[#264653]">
            Мой прогресс
          </h2>
          
          {/* Placeholder для курсов */}
          <div className="bg-[#F8F9FA] rounded-lg p-8 text-center">
            <BookOpen className="w-12 h-12 text-[#6C757D] mx-auto mb-3" />
            <p className="text-[#6C757D]">
              Нет активных курсов
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}