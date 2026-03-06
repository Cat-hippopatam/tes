import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/lib/prisma';
import { auth } from '@/auth/auth';
import { Prisma } from '@prisma/client';

// GET /api/user/progress - получить прогресс пользователя
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
    const contentId = searchParams.get('contentId');

    const where: Prisma.ProgressWhereInput = { profileId: profile.id };
    if (contentId) where.contentId = contentId;

    const progress = await prisma.progress.findMany({
      where,
      include: {
        content: {
          select: {
            id: true,
            title: true,
            slug: true,
            type: true,
          },
        },
      },
    });

    // Считаем статистику
    const completedCount = progress.filter((p) => p.status === 'COMPLETED').length;
    const inProgressCount = progress.filter((p) => p.status === 'IN_PROGRESS').length;

    return NextResponse.json({
      success: true,
      data: progress,
      stats: {
        completed: completedCount,
        inProgress: inProgressCount,
        total: progress.length,
      },
    });
  } catch (error) {
    console.error('Progress GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка при получении прогресса' },
      { status: 500 }
    );
  }
}

// POST /api/user/progress - обновить прогресс
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
    const { 
      contentId, 
      status = 'IN_PROGRESS',
      completedLessons = 0,
      totalLessons = 0,
    } = body;

    if (!contentId) {
      return NextResponse.json(
        { success: false, error: 'contentId обязателен' },
        { status: 400 }
      );
    }

    const progress = await prisma.progress.upsert({
      where: {
        profileId_contentId: { profileId: profile.id, contentId },
      },
      update: {
        status,
        completedLessons,
        totalLessons,
        lastViewedAt: new Date(),
      },
      create: {
        profileId: profile.id,
        contentId,
        status,
        completedLessons,
        totalLessons,
      },
    });

    // Если все уроки завершены - создаём сертификат
    if (status === 'COMPLETED' && completedLessons >= totalLessons) {
      const content = await prisma.content.findUnique({ where: { id: contentId } });
      if (content?.type === 'COURSE') {
        await prisma.certificate.upsert({
          where: {
            profileId_contentId: { profileId: profile.id, contentId },
          },
          update: { issuedAt: new Date() },
          create: {
            profileId: profile.id,
            contentId,
            completedAt: new Date(),
            certificateNumber: `EC-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          },
        });
      }
    }

    return NextResponse.json({ success: true, data: progress });
  } catch (error) {
    console.error('Progress POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка при обновлении прогресса' },
      { status: 500 }
    );
  }
}
