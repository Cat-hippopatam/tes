// app/(public)/profile/settings/components/SocialLinks.tsx
'use client'

import { useState } from 'react'
import { Globe, Send, Youtube, Check, Edit2, X } from 'lucide-react'
import { Button, Input } from '@/components/common'

interface SocialLinksProps {
  links: {
    website?: string | null
    telegram?: string | null
    youtube?: string | null
  }
  onSubmit: (data: { website?: string; telegram?: string; youtube?: string }) => Promise<{ success: boolean; error?: string }>
}

export default function SocialLinks({ links, onSubmit }: SocialLinksProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    website: links.website || '',
    telegram: links.telegram || '',
    youtube: links.youtube || ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Валидация URL
    if (formData.website && !formData.website.match(/^https?:\/\/.+/)) {
      newErrors.website = 'Должен начинаться с http:// или https://'
    }

    // Валидация Telegram
    if (formData.telegram) {
      const telegramHandle = formData.telegram.replace('@', '')
      if (!telegramHandle.match(/^[a-zA-Z0-9_]+$/)) {
        newErrors.telegram = 'Только буквы, цифры и _'
      }
    }

    // Валидация YouTube
    if (formData.youtube) {
      if (!formData.youtube.includes('youtube.com/') && !formData.youtube.includes('youtu.be/')) {
        newErrors.youtube = 'Введите корректную ссылку на YouTube'
      }
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

    // Очищаем данные перед отправкой
    const cleanData = {
      website: formData.website || undefined,
      telegram: formData.telegram ? formData.telegram.replace('@', '') : undefined,
      youtube: formData.youtube || undefined
    }

    const result = await onSubmit(cleanData)
    
    if (result.success) {
      setIsEditing(false)
    } else {
      setErrors({ form: result.error || 'Ошибка при сохранении' })
    }

    setIsSubmitting(false)
  }

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Очищаем ошибку поля при изменении
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setFormData({
      website: links.website || '',
      telegram: links.telegram || '',
      youtube: links.youtube || ''
    })
    setErrors({})
  }

  // Режим просмотра
  if (!isEditing) {
    const hasAnyLink = links.website || links.telegram || links.youtube
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#264653]">
            Социальные сети
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2"
          >
            <Edit2 size={16} />
            {hasAnyLink ? 'Редактировать' : 'Добавить'}
          </Button>
        </div>

        {hasAnyLink ? (
          <div className="space-y-3">
            {links.website && (
              <a
                href={links.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-[#F8F9FA] rounded-lg hover:bg-[#F4A261]/5 transition-colors group"
              >
                <div className="w-8 h-8 bg-[#264653]/10 rounded-lg flex items-center justify-center group-hover:bg-[#F4A261] group-hover:text-white transition-colors">
                  <Globe size={18} className="text-[#264653] group-hover:text-white" />
                </div>
                <span className="text-sm text-[#264653] group-hover:text-[#F4A261] transition-colors">
                  {links.website.replace(/^https?:\/\//, '')}
                </span>
              </a>
            )}

            {links.telegram && (
              <a
                href={`https://t.me/${links.telegram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-[#F8F9FA] rounded-lg hover:bg-[#F4A261]/5 transition-colors group"
              >
                <div className="w-8 h-8 bg-[#264653]/10 rounded-lg flex items-center justify-center group-hover:bg-[#F4A261] group-hover:text-white transition-colors">
                  <Send size={18} className="text-[#264653] group-hover:text-white" />
                </div>
                <span className="text-sm text-[#264653] group-hover:text-[#F4A261] transition-colors">
                  @{links.telegram.replace('@', '')}
                </span>
              </a>
            )}

            {links.youtube && (
              <a
                href={links.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-[#F8F9FA] rounded-lg hover:bg-[#F4A261]/5 transition-colors group"
              >
                <div className="w-8 h-8 bg-[#264653]/10 rounded-lg flex items-center justify-center group-hover:bg-[#F4A261] group-hover:text-white transition-colors">
                  <Youtube size={18} className="text-[#264653] group-hover:text-white" />
                </div>
                <span className="text-sm text-[#264653] group-hover:text-[#F4A261] transition-colors">
                  {links.youtube.replace(/^https?:\/\/(www\.)?/, '')}
                </span>
              </a>
            )}
          </div>
        ) : (
          <div className="text-center py-8 bg-[#F8F9FA] rounded-lg">
            <p className="text-[#6C757D] text-sm">
              Социальные сети не добавлены
            </p>
            <p className="text-xs text-[#6C757D] mt-1">
              Добавьте ссылки, чтобы пользователи могли связаться с вами
            </p>
          </div>
        )}
      </div>
    )
  }

  // Режим редактирования
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#264653]">
          Редактирование социальных сетей
        </h2>
        <button
          type="button"
          onClick={handleCancel}
          className="p-2 text-[#6C757D] hover:text-[#264653] hover:bg-[#F8F9FA] rounded-lg transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Ошибка формы */}
      {errors.form && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{errors.form}</p>
        </div>
      )}

      {/* Website */}
      <div>
        <label htmlFor="website" className="block text-sm font-medium text-[#264653] mb-1">
          <div className="flex items-center gap-2">
            <Globe size={16} />
            <span>Веб-сайт</span>
          </div>
        </label>
        <Input
          id="website"
          type="url"
          value={formData.website}
          onChange={(e) => handleChange('website', e.target.value)}
          error={errors.website}
          placeholder="https://example.com"
          
        />
        <p className="text-xs text-[#6C757D] mt-1">
          Ваш личный сайт или портфолио
        </p>
      </div>

      {/* Telegram */}
      <div>
        <label htmlFor="telegram" className="block text-sm font-medium text-[#264653] mb-1">
          <div className="flex items-center gap-2">
            <Send size={16} />
            <span>Telegram</span>
          </div>
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6C757D]">
            @
          </span>
          <Input
            id="telegram"
            value={formData.telegram}
            onChange={(e) => handleChange('telegram', e.target.value.replace('@', ''))}
            error={errors.telegram}
            placeholder="username"
            className="pl-8"
            
          />
        </div>
        <p className="text-xs text-[#6C757D] mt-1">
          Ваш username в Telegram (без @)
        </p>
      </div>

      {/* YouTube */}
      <div>
        <label htmlFor="youtube" className="block text-sm font-medium text-[#264653] mb-1">
          <div className="flex items-center gap-2">
            <Youtube size={16} />
            <span>YouTube</span>
          </div>
        </label>
        <Input
          id="youtube"
          type="url"
          value={formData.youtube}
          onChange={(e) => handleChange('youtube', e.target.value)}
          error={errors.youtube}
          placeholder="https://youtube.com/@channel"
          
        />
        <p className="text-xs text-[#6C757D] mt-1">
          Ссылка на ваш YouTube канал
        </p>
      </div>

      {/* Кнопки */}
      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
        >
          Отмена
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          className="flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Сохранение...</span>
            </>
          ) : (
            <>
              <Check size={16} />
              <span>Сохранить</span>
            </>
          )}
        </Button>
      </div>
    </form>
  )
}