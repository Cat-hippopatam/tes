// app/profile/favorites/page.tsx (финальная версия)
'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Button } from '@/components/common'
import CollectionsList from './components/CollectionsList'
import FavoritesGrid from './components/FavoritesGrid'

export default function FavoritesPage() {
  const { data: session, status } = useSession()
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null)
  const [isCreatingCollection, setIsCreatingCollection] = useState(false)

  if (status === 'unauthenticated') {
    redirect('/auth/signin')
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-[#6C757D]">Загрузка...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#264653]">Избранное</h1>
          <p className="text-[#6C757D] mt-1">
            Сохраняйте материалы в коллекции и добавляйте заметки
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsCreatingCollection(true)}
          className="flex items-center gap-2"
        >
          <Plus size={18} />
          Новая коллекция
        </Button>
      </div>

      {/* Две колонки */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Левая колонка - список коллекций */}
        <div className="w-full lg:w-80 shrink-0">
          <CollectionsList 
            selectedCollection={selectedCollection}
            onSelectCollection={setSelectedCollection}
            isCreating={isCreatingCollection}
            onCloseCreate={() => setIsCreatingCollection(false)}
          />
        </div>

        {/* Правая колонка - сетка материалов */}
        <div className="flex-1">
          <FavoritesGrid 
            collection={selectedCollection}
          />
        </div>
      </div>
    </div>
  )
}