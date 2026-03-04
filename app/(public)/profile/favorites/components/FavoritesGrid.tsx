// app/(public)/profile/favorites/components/FavoritesGrid.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  BookOpen, 
  Video, 
  Calculator, 
  FileText, 
  MessageSquare,
  Trash2,
  Star
} from 'lucide-react'
import { Button } from '@/components/common'
import type { FavoriteItem } from '@/types/favorites'

interface FavoritesGridProps {
  collection: string | null
}

// Временные данные
const mockItems: FavoriteItem[] = [
  {
    id: '1',
    contentId: 'c1',
    contentType: 'COURSE',
    title: 'Инвестиции для начинающих',
    description: 'Полный курс по инвестициям на фондовом рынке',
    imageUrl: '/images/course1.jpg',
    note: 'Обязательно повторить раздел про облигации',
    collectionId: '1',
    collectionName: 'Инвестиции',
    createdAt: new Date()
  },
  {
    id: '2',
    contentId: 'c2',
    contentType: 'ARTICLE',
    title: '10 ошибок инвестора',
    description: 'Частые ошибки новичков и как их избежать',
    collectionId: '1',
    collectionName: 'Инвестиции',
    createdAt: new Date()
  },
  {
    id: '3',
    contentId: 'c3',
    contentType: 'CALCULATOR',
    title: 'Ипотечный калькулятор',
    description: 'Расчет ипотеки с досрочным погашением',
    collectionId: '2',
    collectionName: 'Недвижимость',
    createdAt: new Date()
  },
  {
    id: '4',
    contentId: 'c4',
    contentType: 'VIDEO',
    title: 'Как купить квартиру в ипотеку',
    description: 'Видео-урок по оформлению ипотеки',
    collectionId: '2',
    collectionName: 'Недвижимость',
    createdAt: new Date()
  }
]

export default function FavoritesGrid({ collection }: FavoritesGridProps) {
  const [items, setItems] = useState<FavoriteItem[]>(mockItems)
  const [editingNote, setEditingNote] = useState<string | null>(null)
  const [noteText, setNoteText] = useState('')

  // Фильтрация по коллекции
  const filteredItems = collection 
    ? items.filter(item => item.collectionId === collection)
    : items

  // Иконка в зависимости от типа контента
  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'COURSE': return <BookOpen size={16} />
      case 'VIDEO': return <Video size={16} />
      case 'CALCULATOR': return <Calculator size={16} />
      default: return <FileText size={16} />
    }
  }

  // Удаление из избранного
  const handleRemove = (id: string) => {
    if (confirm('Удалить из избранного?')) {
      setItems(prev => prev.filter(item => item.id !== id))
    }
  }

  // Сохранение заметки
  const handleSaveNote = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, note: noteText } : item
    ))
    setEditingNote(null)
    setNoteText('')
  }

  if (filteredItems.length === 0) {
    return (
      <div className="bg-[#F8F9FA] rounded-xl p-12 text-center">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
          <Star size={24} className="text-[#F4A261]" />
        </div>
        <h3 className="text-lg font-semibold text-[#264653] mb-2">
          Здесь пока пусто
        </h3>
        <p className="text-[#6C757D] text-sm mb-6">
          {collection 
            ? 'В этой коллекции нет материалов' 
            : 'Добавляйте материалы в избранное, чтобы они появлялись здесь'}
        </p>
        <Link href="/calculator">
          <Button variant="primary">
            Перейти к материалам
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {filteredItems.map((item) => (
        <div 
          key={item.id}
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow relative group"
        >
          {/* Изображение (если есть) */}
          {item.imageUrl ? (
            <div className="relative h-32 bg-[#F8F9FA]">
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="h-20 bg-gradient-to-r from-[#F4A261]/20 to-[#2A9D8F]/20 flex items-center justify-center">
              {getTypeIcon(item.contentType)}
            </div>
          )}

          {/* Контент */}
          <div className="p-4">
            {/* Тип и коллекция */}
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center gap-1 text-xs text-[#6C757D] bg-[#F8F9FA] px-2 py-1 rounded-full">
                {getTypeIcon(item.contentType)}
                {item.contentType === 'COURSE' && 'Курс'}
                {item.contentType === 'ARTICLE' && 'Статья'}
                {item.contentType === 'VIDEO' && 'Видео'}
                {item.contentType === 'CALCULATOR' && 'Калькулятор'}
              </span>
              {item.collectionName && (
                <span className="text-xs text-[#F4A261] bg-[#F4A261]/10 px-2 py-1 rounded-full">
                  {item.collectionName}
                </span>
              )}
            </div>

            {/* Заголовок */}
            <h3 className="font-semibold text-[#264653] mb-1 line-clamp-2">
              {item.title}
            </h3>

            {/* Описание */}
            {item.description && (
              <p className="text-sm text-[#6C757D] mb-3 line-clamp-2">
                {item.description}
              </p>
            )}

            {/* Заметка */}
            {editingNote === item.id ? (
              <div className="mt-3">
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Ваша заметка..."
                  className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F4A261] focus:border-transparent"
                  rows={3}
                  autoFocus
                />
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleSaveNote(item.id)}
                    className="flex-1"
                  >
                    Сохранить
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingNote(null)
                      setNoteText('')
                    }}
                    className="flex-1"
                  >
                    Отмена
                  </Button>
                </div>
              </div>
            ) : item.note ? (
              <div className="mt-3 p-3 bg-[#F8F9FA] rounded-lg text-sm text-[#264653]">
                <p className="text-xs text-[#6C757D] mb-1">Ваша заметка:</p>
                {item.note}
              </div>
            ) : null}

            {/* Кнопки действий */}
            <div className="mt-3 flex items-center justify-between pt-3 border-t border-gray-100">
              <button
                onClick={() => {
                  setEditingNote(item.id)
                  setNoteText(item.note || '')
                }}
                className="flex items-center gap-1 text-xs text-[#6C757D] hover:text-[#264653] transition-colors"
              >
                <MessageSquare size={14} />
                {item.note ? 'Редактировать заметку' : 'Добавить заметку'}
              </button>
              <button
                onClick={() => handleRemove(item.id)}
                className="p-1 text-[#6C757D] hover:text-red-500 transition-colors"
                title="Удалить из избранного"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          {/* Ссылка на материал (кликабельно всё) */}
          <Link
            href={`/content/${item.contentId}`}
            className="absolute inset-0 z-10"
            aria-label={`Перейти к ${item.title}`}
          />
        </div>
      ))}
    </div>
  )
}