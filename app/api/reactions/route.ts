import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/lib/prisma';
import { ReactionType } from '@prisma/client';
import { auth } from '@/auth/auth';

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
      where: { contentId, type: ReactionType.LIKE },
    });

    const dislikes = await prisma.contentReaction.count({
      where: { contentId, type: ReactionType.DISLIKE },
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
    const session = await auth();
    const body = await request.json();
    const { contentId, isLike } = body;

    if (!contentId) {
      return NextResponse.json(
        { success: false, error: 'contentId обязателен' },
        { status: 400 }
      );
    }

    // Получаем профиль пользователя
    const profile = await prisma.profile.findUnique({
      where: { userId: session?.user?.id },
    });

    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Профиль не найден' },
        { status: 400 }
      );
    }

    const reactionType = isLike ? ReactionType.LIKE : ReactionType.DISLIKE;

    // Проверяем, есть ли уже реакция
    const existing = await prisma.contentReaction.findUnique({
      where: {
        profileId_contentId: { profileId: profile.id, contentId },
      },
    });

    let reaction;

    if (existing) {
      if (existing.type === reactionType) {
        // Удаляем реакцию если кликнули то же самое (toggle)
        await prisma.contentReaction.delete({
          where: { id: existing.id },
        });
        reaction = null;
      } else {
        // Меняем реакцию
        reaction = await prisma.contentReaction.update({
          where: { id: existing.id },
          data: { type: reactionType },
        });
      }
    } else {
      // Создаём новую реакцию
      reaction = await prisma.contentReaction.create({
        data: { profileId: profile.id, contentId, type: reactionType },
      });
    }

    // Получаем обновлённые счётчики
    const likes = await prisma.contentReaction.count({
      where: { contentId, type: ReactionType.LIKE },
    });
    const dislikes = await prisma.contentReaction.count({
      where: { contentId, type: ReactionType.DISLIKE },
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
