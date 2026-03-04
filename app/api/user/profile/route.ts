// app/api/user/profile/route.ts
import { NextResponse } from 'next/server';
import { auth } from "@/auth/auth";  // Импортируем auth, а не getServerSession
import prisma from '@/utils/lib/prisma';
import type { ProfileData, UpdateProfileData } from '@/types/profile';

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Получаем email из сессии
    const userEmail = session.user.email
    if (!userEmail) {
      return NextResponse.json({ error: 'User email not found' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: {
        profile: {
          include: {
            content: {
              where: { deletedAt: null },
              select: { id: true }
            }
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Собираем данные профиля
    const profileData: ProfileData = {
      // User data
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      
      // Profile data
      nickname: user.profile?.nickname || user.email.split('@')[0],
      displayName: user.profile?.displayName || `${user.firstName} ${user.lastName}`.trim() || user.email,
      avatarUrl: user.profile?.avatarUrl,
      coverImage: user.profile?.coverImage,
      bio: user.profile?.bio,
      
      // Social links
      website: user.profile?.website,
      telegram: user.profile?.telegram,
      youtube: user.profile?.youtube,
      
      // Statistics
      stats: {
        totalViews: user.profile?.totalViews || 0,
        subscribers: user.profile?.subscribers || 0,
        contentCount: user.profile?.content.length || 0
      },
      
      // Metadata
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }

    return NextResponse.json(profileData)
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userEmail = session.user.email
    if (!userEmail) {
      return NextResponse.json({ error: 'User email not found' }, { status: 400 })
    }

    const data: UpdateProfileData = await request.json()

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: { profile: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Обновляем в транзакции
    await prisma.$transaction(async (tx) => {
      // Обновляем User если нужно
      if (data.firstName || data.lastName) {
        await tx.user.update({
          where: { id: user.id },
          data: {
            firstName: data.firstName ?? user.firstName,
            lastName: data.lastName ?? user.lastName
          }
        })
      }

      // Подготавливаем данные для Profile
      const profileData: Partial<{
        nickname: string
        displayName: string
        bio: string
        website: string
        telegram: string
        youtube: string
      }> = {}
      
      if (data.nickname !== undefined) profileData.nickname = data.nickname
      if (data.displayName !== undefined) profileData.displayName = data.displayName
      if (data.bio !== undefined) profileData.bio = data.bio
      if (data.website !== undefined) profileData.website = data.website
      if (data.telegram !== undefined) profileData.telegram = data.telegram
      if (data.youtube !== undefined) profileData.youtube = data.youtube

      if (user.profile) {
        // Обновляем существующий профиль
        await tx.profile.update({
          where: { userId: user.id },
          data: profileData
        })
      } else if (Object.keys(profileData).length > 0) {
        // Создаем новый профиль, если есть данные
        await tx.profile.create({
          data: {
            userId: user.id,
            nickname: data.nickname || user.email.split('@')[0],
            displayName: data.displayName || `${user.firstName} ${user.lastName}`.trim() || user.email,
            ...profileData
          }
        })
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}