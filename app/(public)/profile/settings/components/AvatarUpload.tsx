// app/profile/settings/components/AvatarUpload.tsx
'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { Camera, X, Upload, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/common'

interface AvatarUploadProps {
  avatarUrl?: string | null
  coverImage?: string | null
  onUpdate: (urls: { avatarUrl?: string; coverImage?: string }) => void
}

export default function AvatarUpload({ avatarUrl, coverImage, onUpdate }: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState<'avatar' | 'cover' | null>(null)
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null)
  const [previewCover, setPreviewCover] = useState<string | null>(null)

  // Обработка загрузки файла
  const handleFileSelect = useCallback(async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'avatar' | 'cover'
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Валидация
    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение')
      return
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      alert('Файл слишком большой. Максимальный размер 5MB')
      return
    }

    // Превью
    const reader = new FileReader()
    reader.onloadend = () => {
      if (type === 'avatar') {
        setPreviewAvatar(reader.result as string)
      } else {
        setPreviewCover(reader.result as string)
      }
    }
    reader.readAsDataURL(file)

    // TODO: Здесь будет реальная загрузка на сервер
    // Сейчас просто имитируем загрузку
    setIsUploading(type)
    
    // Имитация задержки загрузки
    setTimeout(() => {
      setIsUploading(null)
      // После успешной загрузки вызываем onUpdate
      if (type === 'avatar') {
        onUpdate({ avatarUrl: previewAvatar || undefined })
      } else {
        onUpdate({ coverImage: previewCover || undefined })
      }
    }, 1500)
  }, [previewAvatar, previewCover, onUpdate])

  // Сброс изменений
  const handleReset = (type: 'avatar' | 'cover') => {
    if (type === 'avatar') {
      setPreviewAvatar(null)
    } else {
      setPreviewCover(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Обложка */}
      <div className="relative">
        <div className="text-sm font-medium text-[#264653] mb-2">
          Обложка профиля
        </div>
        <div 
          className="relative w-full h-48 rounded-xl overflow-hidden bg-gradient-to-br from-[#F4A261]/20 to-[#2A9D8F]/20 border-2 border-dashed border-gray-300 hover:border-[#F4A261] transition-colors group"
        >
          {/* Изображение обложки */}
          {(previewCover || coverImage) ? (
            <>
              <img 
                src={previewCover || coverImage || ''} 
                alt="Cover"
                className="w-full h-full object-cover"
              />
              {/* Затемнение при наведении */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-[#6C757D]">
              <ImageIcon size={32} className="mb-2" />
              <p className="text-sm">Загрузите обложку</p>
              <p className="text-xs mt-1">Рекомендуемый размер: 1200x300px</p>
            </div>
          )}

          {/* Кнопки управления */}
          <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {isUploading === 'cover' ? (
              <div className="px-4 py-2 bg-white rounded-lg shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-[#F4A261] border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm text-[#264653]">Загрузка...</span>
                </div>
              </div>
            ) : (
              <>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileSelect(e, 'cover')}
                    disabled={isUploading !== null}
                  />
                  <div className="p-2 bg-white rounded-lg shadow-lg hover:bg-[#F8F9FA] transition-colors">
                    <Upload size={18} className="text-[#264653]" />
                  </div>
                </label>
                {(previewCover || coverImage) && (
                  <button
                    onClick={() => handleReset('cover')}
                    className="p-2 bg-white rounded-lg shadow-lg hover:bg-[#F8F9FA] transition-colors"
                    disabled={isUploading !== null}
                  >
                    <X size={18} className="text-red-500" />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Аватар */}
      <div>
        <div className="text-sm font-medium text-[#264653] mb-2">
          Аватар
        </div>
        <div className="flex items-start gap-6">
          {/* Превью аватара */}
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-[#F4A261] to-[#2A9D8F]">
              {(previewAvatar || avatarUrl) ? (
                <img 
                  src={previewAvatar || avatarUrl || ''} 
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-2xl font-semibold">
                  {previewAvatar?.[0] || '?'}
                </div>
              )}
            </div>

            {/* Затемнение при наведении */}
            <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              {isUploading === 'avatar' ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileSelect(e, 'avatar')}
                    disabled={isUploading !== null}
                  />
                  <Camera size={20} className="text-white" />
                </label>
              )}
            </div>
          </div>

          {/* Инструкция */}
          <div className="flex-1">
            <p className="text-sm text-[#6C757D]">
              Рекомендуемый размер: 400x400px. Максимальный размер: 5MB.
              Поддерживаемые форматы: JPG, PNG, GIF.
            </p>
            
            {/* Кнопка сброса */}
            {(previewAvatar || avatarUrl) && (
              <button
                onClick={() => handleReset('avatar')}
                className="mt-2 text-sm text-red-500 hover:text-red-600 transition-colors"
                disabled={isUploading !== null}
              >
                Удалить аватар
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Подсказка */}
      <div className="text-xs text-[#6C757D] bg-[#F8F9FA] p-3 rounded-lg">
        <strong className="font-medium text-[#264653]">Примечание:</strong>{' '}
        Сейчас загрузка работает в демо-режиме. В реальном проекте изображения 
        будут сохраняться на сервере.
      </div>
    </div>
  )
}