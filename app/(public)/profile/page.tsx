// app/profile/settings/page.tsx
'use client'

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useProfile } from '@/hoc/useProfile';
import ProfileForm from './components/ProfileForm';
// import AvatarUpload from './components/AvatarUpload' // позже
// import SocialLinks from './components/SocialLinks'   // позже

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const { profile, loading, updateProfile } = useProfile()

  // Защита роута
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

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-500">Ошибка загрузки профиля</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Заголовок */}
      <div>
        <h1 className="text-2xl font-bold text-[#264653]">Настройки профиля</h1>
        <p className="text-[#6C757D] mt-1">
          Управляйте вашим публичным профилем и личными данными
        </p>
      </div>

      {/* TODO: AvatarUpload компонент */}
      <div className="p-4 bg-[#F8F9FA] rounded-lg border-2 border-dashed border-gray-300">
        <p className="text-center text-[#6C757D]">
          Здесь будет загрузка аватара и обложки
        </p>
      </div>

      {/* Основная форма */}
      <ProfileForm 
        initialData={profile}
        onSubmit={updateProfile}
      />

      {/* TODO: SocialLinks компонент */}
      <div className="p-4 bg-[#F8F9FA] rounded-lg border-2 border-dashed border-gray-300">
        <p className="text-center text-[#6C757D]">
          Здесь будут социальные ссылки
        </p>
      </div>
    </div>
  )
}