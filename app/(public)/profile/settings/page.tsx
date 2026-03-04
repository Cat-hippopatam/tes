// app/profile/settings/page.tsx (финальная версия)
'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useProfile } from '@/hoc/useProfile'
import ProfileForm from './components/ProfileForm'
import AvatarUpload from './components/AvatarUpload'
import SocialLinks from './components/SocialLinks'  // ✅ Добавили

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const { profile, loading, updateProfile } = useProfile()

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
      <div>
        <h1 className="text-2xl font-bold text-[#264653]">Настройки профиля</h1>
        <p className="text-[#6C757D] mt-1">
          Управляйте вашим публичным профилем и личными данными
        </p>
      </div>

      {/* Аватар и обложка */}
      <AvatarUpload 
        avatarUrl={profile.avatarUrl}
        coverImage={profile.coverImage}
        onUpdate={(urls) => {
          console.log('Update URLs:', urls)
          // TODO: сохранить на сервере
        }}
      />

      {/* Основная форма */}
      <ProfileForm 
        initialData={profile}
        onSubmit={updateProfile}
      />

      {/* Социальные ссылки */}
      <SocialLinks 
        links={{
          website: profile.website,
          telegram: profile.telegram,
          youtube: profile.youtube
        }}
        onSubmit={updateProfile}
      />
    </div>
  )
}