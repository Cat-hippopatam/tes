import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/lib/prisma';

// GET /api/reactions - получить реакции контента
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const contentId = searchParams.get('contentId');

    if (!contentId) {
      return NextResponse.json(
        { success: false, error: 'contentId обязателен' },
        { status: 400 }
      );
    }

    const likes = await prisma.contentReaction.count({
      where: { contentId, isLike: true },
    });

    const dislikes = await prisma.contentReaction.count({
      where: { contentId, isLike: false },
    });

    return NextResponse.json({
      success: true,
      data: { likes, dislikes },
    });
  } catch (error) {
    console.error('Reactions GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка при получении реакций' },
      { status: 500 }
    );
  }
}

// POST /api/reactions - поставить реакцию
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId = 'demo-user-id', contentId, isLike } = body;

    if (!contentId) {
      return NextResponse.json(
        { success: false, error: 'contentId обязателен' },
        { status: 400 }
      );
    }

    // Проверяем, есть ли уже реакция
    const existing = await prisma.contentReaction.findUnique({
      where: {
        userId_contentId: { userId, contentId },
      },
    });

    let reaction;

    if (existing) {
      if (existing.isLike === isLike) {
        // Удаляем реакцию если кликнули то же самое (toggle)
        await prisma.contentReaction.delete({
          where: { id: existing.id },
        });
        reaction = null;
      } else {
        // Меняем реакцию
        reaction = await prisma.contentReaction.update({
          where: { id: existing.id },
          data: { isLike },
        });
      }
    } else {
      // Создаём новую реакцию
      reaction = await prisma.contentReaction.create({
        data: { userId, contentId, isLike },
      });
    }

    // Получаем обновлённые счётчики
    const likes = await prisma.contentReaction.count({
      where: { contentId, isLike: true },
    });
    const dislikes = await prisma.contentReaction.count({
      where: { contentId, isLike: false },
    });

    return NextResponse.json({
      success: true,
      data: { reaction, likes, dislikes },
    });
  } catch (error) {
    console.error('Reactions POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка при установке реакции' },
      { status: 500 }
    );
  }
}
