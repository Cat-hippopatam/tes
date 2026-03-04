
'use client'

import { useState } from 'react'
import { Button, Input } from '@/components/common'
import type { ProfileData, UpdateProfileData } from '@/types/profile'

interface ProfileFormProps {
  initialData: ProfileData
  onSubmit: (data: UpdateProfileData) => Promise<{ success: boolean; error?: string }>
}

export default function ProfileForm({ initialData, onSubmit }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    firstName: initialData.firstName,
    lastName: initialData.lastName,
    nickname: initialData.nickname,
    displayName: initialData.displayName,
    bio: initialData.bio || ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Имя обязательно'
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Фамилия обязательна'
    }
    
    if (!formData.nickname.trim()) {
      newErrors.nickname = 'Никнейм обязателен'
    } else if (formData.nickname.length < 3) {
      newErrors.nickname = 'Никнейм должен быть минимум 3 символа'
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.nickname)) {
      newErrors.nickname = 'Только латинские буквы, цифры и _'
    }
    
    if (!formData.displayName.trim()) {
      newErrors.displayName = 'Отображаемое имя обязательно'
    }
    
    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    
    setIsSubmitting(true)
    setErrors({})
    
    const result = await onSubmit(formData)
    
    if (!result.success && result.error) {
      if (result.error.includes('nickname')) {
        setErrors({ nickname: 'Этот никнейм уже занят' })
      } else {
        setErrors({ form: result.error })
      }
    }
    
    setIsSubmitting(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Очищаем ошибку поля при изменении
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Ошибка формы */}
      {errors.form && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{errors.form}</p>
        </div>
      )}

      {/* Имя и Фамилия */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-[#264653] mb-1">
            Имя *
          </label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            error={errors.firstName}
            placeholder="Введите имя"
            
          />
        </div>
        
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-[#264653] mb-1">
            Фамилия *
          </label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            error={errors.lastName}
            placeholder="Введите фамилию"
            
          />
        </div>
      </div>

      {/* Никнейм и Отображаемое имя */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="nickname" className="block text-sm font-medium text-[#264653] mb-1">
            Никнейм *
          </label>
          <Input
            id="nickname"
            name="nickname"
            value={formData.nickname}
            onChange={handleChange}
            error={errors.nickname}
            placeholder="john_doe"
            
          />
          <p className="text-xs text-[#6C757D] mt-1">
            Только латинские буквы, цифры и _. Будет использоваться в URL
          </p>
        </div>
        
        <div>
          <label htmlFor="displayName" className="block text-sm font-medium text-[#264653] mb-1">
            Отображаемое имя *
          </label>
          <Input
            id="displayName"
            name="displayName"
            value={formData.displayName}
            onChange={handleChange}
            error={errors.displayName}
            placeholder="Как вас будут видеть другие"
            
          />
        </div>
      </div>

      {/* Био */}
      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-[#264653] mb-1">
          О себе
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={4}
          value={formData.bio}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F4A261] focus:border-transparent"
          placeholder="Расскажите о себе..."
        />
        <p className="text-xs text-[#6C757D] mt-1">
          Максимум 500 символов
        </p>
      </div>

      {/* Кнопки */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setFormData({
              firstName: initialData.firstName,
              lastName: initialData.lastName,
              nickname: initialData.nickname,
              displayName: initialData.displayName,
              bio: initialData.bio || ''
            })
            setErrors({})
          }}
        >
          Отмена
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
        </Button>
      </div>
    </form>
  )
}