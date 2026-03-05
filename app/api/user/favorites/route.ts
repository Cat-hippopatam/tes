import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/lib/prisma';

// GET /api/user/favorites - получить избранное
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'demo-user-id';

    const favorites = await prisma.favorite.findMany({
      where: { userId },
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
    const body = await request.json();
    const { userId = 'demo-user-id', contentId, action = 'add' } = body;

    if (!contentId) {
      return NextResponse.json(
        { success: false, error: 'contentId обязателен' },
        { status: 400 }
      );
    }

    if (action === 'remove') {
      await prisma.favorite.deleteMany({
        where: { userId, contentId },
      });
      return NextResponse.json({ success: true, data: { isFavorite: false } });
    }

    // Проверяем, не добавлено ли уже
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_contentId: { userId, contentId },
      },
    });

    if (existing) {
      return NextResponse.json({
        success: true,
        data: { isFavorite: true, message: 'Уже в избранном' },
      });
    }

    const favorite = await prisma.favorite.create({
      data: { userId, contentId },
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
