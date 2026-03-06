import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/lib/prisma';
import { auth } from '@/auth/auth';

// GET /api/user/favorites - получить избранное
export async function GET(_request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Требуется авторизация' },
        { status: 401 }
      );
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Профиль не найден' },
        { status: 404 }
      );
    }

    const favorites = await prisma.favorite.findMany({
      where: { profileId: profile.id },
      orderBy: { createdAt: 'desc' },
      include: {
        content: {
          select: {
            id: true,
            title: true,
            slug: true,
            type: true,
            coverImage: true,
            isPremium: true,
            description: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: favorites,
    });
  } catch (error) {
    console.error('Favorites GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка при получении избранного' },
      { status: 500 }
    );
  }
}

// POST /api/user/favorites - добавить/удалить из избранного
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Требуется авторизация' },
        { status: 401 }
      );
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Профиль не найден' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { contentId, action = 'add' } = body;

    if (!contentId) {
      return NextResponse.json(
        { success: false, error: 'contentId обязателен' },
        { status: 400 }
      );
    }

    if (action === 'remove') {
      await prisma.favorite.deleteMany({
        where: { profileId: profile.id, contentId },
      });
      return NextResponse.json({ success: true, data: { isFavorite: false } });
    }

    // Проверяем, не добавлено ли уже
    const existing = await prisma.favorite.findUnique({
      where: {
        profileId_contentId: { profileId: profile.id, contentId },
      },
    });

    if (existing) {
      return NextResponse.json({
        success: true,
        data: { isFavorite: true, message: 'Уже в избранном' },
      });
    }

    const favorite = await prisma.favorite.create({
      data: { profileId: profile.id, contentId },
    });

    return NextResponse.json({ success: true, data: { isFavorite: true, id: favorite.id } });
  } catch (error) {
    console.error('Favorites POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка при работе с избранным' },
      { status: 500 }
    );
  }
}
