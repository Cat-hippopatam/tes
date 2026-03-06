import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/lib/prisma';
import { auth } from '@/auth/auth';

// GET /api/user/history - получить историю просмотров
export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const history = await prisma.history.findMany({
      where: { profileId: profile.id },
      orderBy: { viewedAt: 'desc' },
      take: limit,
      skip: offset,
      include: {
        content: {
          select: {
            id: true,
            title: true,
            slug: true,
            type: true,
            coverImage: true,
            isPremium: true,
          },
        },
      },
    });

    const total = await prisma.history.count({ where: { profileId: profile.id } });

    return NextResponse.json({
      success: true,
      data: history,
      total,
    });
  } catch (error) {
    console.error('History GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка при получении истории' },
      { status: 500 }
    );
  }
}

// POST /api/user/history - добавить просмотр
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
    const { contentId } = body;

    if (!contentId) {
      return NextResponse.json(
        { success: false, error: 'contentId обязателен' },
        { status: 400 }
      );
    }

    // Upsert - обновляем время просмотра если уже есть
    const history = await prisma.history.upsert({
      where: {
        profileId_contentId: { profileId: profile.id, contentId },
      },
      update: { viewedAt: new Date() },
      create: { profileId: profile.id, contentId },
    });

    // Обновляем счётчик просмотров контента
    await prisma.content.update({
      where: { id: contentId },
      data: { viewsCount: { increment: 1 } },
    });

    return NextResponse.json({ success: true, data: history });
  } catch (error) {
    console.error('History POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка при записи истории' },
      { status: 500 }
    );
  }
}
