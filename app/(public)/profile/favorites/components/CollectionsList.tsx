// app/profile/favorites/components/CollectionsList.tsx
'use client'

import { useState, useEffect } from 'react'
import { 
  Folder, 
  MoreHorizontal, 
  Edit2, 
  Trash2, 
  Check, 
  X,
  Plus 
} from 'lucide-react'
import { Button, Input } from '@/components/common'
import type { Collection } from '@/types/favorites'

interface CollectionsListProps {
  selectedCollection: string | null
  onSelectCollection: (id: string | null) => void
  isCreating: boolean
  onCloseCreate: () => void
}

// Временные данные (позже заменим на API)
const mockCollections: Collection[] = [
  { id: '1', name: 'Инвестиции', itemCount: 5, createdAt: new Date() },
  { id: '2', name: 'Недвижимость', itemCount: 3, createdAt: new Date() },
  { id: '3', name: 'Пенсия', itemCount: 2, createdAt: new Date() },
  { id: '4', name: 'Криптовалюта', itemCount: 1, createdAt: new Date() },
]

export default function CollectionsList({ 
  selectedCollection, 
  onSelectCollection,
  isCreating,
  onCloseCreate 
}: CollectionsListProps) {
  const [collections, setCollections] = useState<Collection[]>(mockCollections)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [newCollectionName, setNewCollectionName] = useState('')

  // Создание новой коллекции
  const handleCreateCollection = () => {
    if (!newCollectionName.trim()) return
    
    const newCollection: Collection = {
      id: Date.now().toString(),
      name: newCollectionName,
      itemCount: 0,
      createdAt: new Date()
    }
    
    setCollections(prev => [...prev, newCollection])
    setNewCollectionName('')
    onCloseCreate()
    onSelectCollection(newCollection.id)
  }

  // Переименование коллекции
  const handleRename = (id: string) => {
    if (!editingName.trim()) return
    
    setCollections(prev => prev.map(col => 
      col.id === id ? { ...col, name: editingName } : col
    ))
    setEditingId(null)
    setEditingName('')
  }

  // Удаление коллекции
  const handleDelete = (id: string) => {
    if (confirm('Удалить коллекцию? Материалы не будут удалены из избранного')) {
      setCollections(prev => prev.filter(col => col.id !== id))
      if (selectedCollection === id) {
        onSelectCollection(null)
      }
    }
  }

  // Начало переименования
  const startRename = (collection: Collection) => {
    setEditingId(collection.id)
    setEditingName(collection.name)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-4 px-2">
        <h2 className="font-semibold text-[#264653]">Коллекции</h2>
        <span className="text-sm text-[#6C757D]">
          {collections.reduce((acc, col) => acc + col.itemCount, 0)} материалов
        </span>
      </div>

      {/* Список коллекций */}
      <div className="space-y-1 max-h-[400px] overflow-y-auto">
        {/* Все материалы (без коллекции) */}
        <button
          onClick={() => onSelectCollection(null)}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
            selectedCollection === null 
              ? 'bg-[#F4A261] text-white' 
              : 'hover:bg-[#F8F9FA] text-[#264653]'
          }`}
        >
          <Folder size={18} />
          <span className="text-sm flex-1 text-left">Все материалы</span>
          <span className={`text-xs ${
            selectedCollection === null ? 'text-white/80' : 'text-[#6C757D]'
          }`}>
            {collections.reduce((acc, col) => acc + col.itemCount, 0)}
          </span>
        </button>

        {/* Разделитель */}
        <div className="h-px bg-gray-100 my-2" />

        {/* Коллекции */}
        {collections.map((collection) => (
          <div key={collection.id} className="relative group">
            {editingId === collection.id ? (
              // Режим редактирования
              <div className="flex items-center gap-2 px-3 py-1">
                <Input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="flex-1 h-8 text-sm"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleRename(collection.id)
                    if (e.key === 'Escape') {
                      setEditingId(null)
                      setEditingName('')
                    }
                  }}
                />
                <button
                  onClick={() => handleRename(collection.id)}
                  className="p-1 text-[#2A9D8F] hover:bg-[#F8F9FA] rounded"
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={() => {
                    setEditingId(null)
                    setEditingName('')
                  }}
                  className="p-1 text-[#6C757D] hover:bg-[#F8F9FA] rounded"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              // Режим просмотра
              <>
                <button
                  onClick={() => onSelectCollection(collection.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    selectedCollection === collection.id
                      ? 'bg-[#F4A261] text-white' 
                      : 'hover:bg-[#F8F9FA] text-[#264653]'
                  }`}
                >
                  <Folder size={18} />
                  <span className="text-sm flex-1 text-left">{collection.name}</span>
                  <span className={`text-xs ${
                    selectedCollection === collection.id ? 'text-white/80' : 'text-[#6C757D]'
                  }`}>
                    {collection.itemCount}
                  </span>
                </button>

                {/* Кнопки действий (появляются при наведении) */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-white rounded-lg shadow-sm">
                  <button
                    onClick={() => startRename(collection)}
                    className="p-1.5 text-[#6C757D] hover:text-[#264653] hover:bg-[#F8F9FA] rounded-l-lg transition-colors"
                    title="Переименовать"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(collection.id)}
                    className="p-1.5 text-[#6C757D] hover:text-red-500 hover:bg-[#F8F9FA] rounded-r-lg transition-colors"
                    title="Удалить"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}

        {/* Форма создания новой коллекции */}
        {isCreating && (
          <div className="mt-2 p-2 border border-[#F4A261] rounded-lg bg-[#F8F9FA]">
            <Input
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              placeholder="Название коллекции"
              className="mb-2"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateCollection()
                if (e.key === 'Escape') onCloseCreate()
              }}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="primary"
                onClick={handleCreateCollection}
                className="flex-1"
                disabled={!newCollectionName.trim()}
              >
                Создать
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={onCloseCreate}
                className="flex-1"
              >
                Отмена
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Кнопка создания новой коллекции (всегда видна) */}
      {!isCreating && (
        <button
          onClick={() => onCloseCreate()} // Это откроет форму через props
          className="w-full mt-4 flex items-center gap-2 px-3 py-2 text-[#6C757D] hover:text-[#264653] hover:bg-[#F8F9FA] rounded-lg transition-colors border border-dashed border-gray-300"
        >
          <Plus size={18} />
          <span className="text-sm">Новая коллекция</span>
        </button>
      )}
    </div>
  )
}