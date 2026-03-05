import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/lib/prisma';

// GET /api/user/progress - получить прогресс пользователя
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'demo-user-id';
    const contentId = searchParams.get('contentId'); // опционально - прогресс по конкретному контенту

    const where: any = { userId };
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
    const body = await request.json();
    const { 
      userId = 'demo-user-id', 
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
        userId_contentId: { userId, contentId },
      },
      update: {
        status,
        completedLessons,
        totalLessons,
        lastAccessedAt: new Date(),
      },
      create: {
        userId,
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
            userId_contentId: { userId, contentId },
          },
          update: { issuedAt: new Date() },
          create: {
            userId,
            contentId,
            issuedAt: new Date(),
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
