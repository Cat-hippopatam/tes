// types/profile.ts
import { Role } from '@prisma/client'

export interface ProfileStats {
  totalViews: number
  subscribers: number
  contentCount?: number
  favoritesCount?: number
}

export interface ProfileData {
  // User data
  email: string
  firstName: string
  lastName: string
  role: Role
  
  // Profile data
  nickname: string
  displayName: string
  avatarUrl?: string | null
  coverImage?: string | null
  bio?: string | null
  
  // Social links
  website?: string | null
  telegram?: string | null
  youtube?: string | null
  
  // Statistics
  stats: ProfileStats
  
  // Metadata
  createdAt: Date
  updatedAt: Date
}

export interface UpdateProfileData {
  firstName?: string
  lastName?: string
  nickname?: string
  displayName?: string
  bio?: string
  website?: string
  telegram?: string
  youtube?: string
}

export interface ProfileResponse {
  success?: boolean
  error?: string
  profile?: ProfileData
}