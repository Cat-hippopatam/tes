// types/favorites.ts
export interface Collection {
  id: string
  name: string
  itemCount: number
  createdAt: Date
}

export interface FavoriteItem {
  id: string
  contentId: string
  contentType: 'COURSE' | 'ARTICLE' | 'VIDEO' | 'CALCULATOR'
  title: string
  description?: string
  imageUrl?: string
  note?: string
  collectionId?: string
  collectionName?: string
  createdAt: Date
}

export interface CreateCollectionData {
  name: string
}

export interface AddToFavoritesData {
  contentId: string
  note?: string
  collectionId?: string
}

export interface UpdateFavoriteData {
  note?: string
  collectionId?: string
}