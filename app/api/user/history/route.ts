import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/lib/prisma';

// GET /api/user/history - получить историю просмотров
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'demo-user-id';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const history = await prisma.history.findMany({
      where: { userId },
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

    const total = await prisma.history.count({ where: { userId } });

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
    const body = await request.json();
    const { userId = 'demo-user-id', contentId } = body;

    if (!contentId) {
      return NextResponse.json(
        { success: false, error: 'contentId обязателен' },
        { status: 400 }
      );
    }

    // Upsert - обновляем время просмотра если уже есть
    const history = await prisma.history.upsert({
      where: {
        userId_contentId: { userId, contentId },
      },
      update: { viewedAt: new Date() },
      create: { userId, contentId },
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
