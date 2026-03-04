// hooks/useProfile.ts
import { useState, useEffect } from 'react'
import type { ProfileData, UpdateProfileData } from '@/types/profile'

interface UseProfileReturn {
  profile: ProfileData | null
  loading: boolean
  error: string | null
  updateProfile: (data: UpdateProfileData) => Promise<{ success: boolean; error?: string }>
  refreshProfile: () => Promise<void>
}

export function useProfile(): UseProfileReturn {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/user/profile')
      
      if (!res.ok) {
        if (res.status === 401) {
          // Не авторизован - просто очищаем профиль
          setProfile(null)
          return
        }
        throw new Error('Failed to fetch profile')
      }
      
      const data = await res.json()
      setProfile(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      console.error('Error fetching profile:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (data: UpdateProfileData) => {
    try {
      setLoading(true)
      setError(null)
      
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      const result = await res.json()
      
      if (!res.ok) {
        throw new Error(result.error || 'Failed to update profile')
      }
      
      // Обновляем локальные данные
      await fetchProfile()
      
      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  return {
    profile,
    loading,
    error,
    updateProfile,
    refreshProfile: fetchProfile
  }
}