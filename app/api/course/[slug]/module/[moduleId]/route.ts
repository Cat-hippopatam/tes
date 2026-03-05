import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/lib/prisma';
import { ContentStatus } from '@prisma/client';

// GET /api/course/[slug]/module/[moduleId] — получить модуль курса с уроками
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string; moduleId: string }> }
) {
  try {
    const { slug, moduleId } = await params;
    
    // Сначала находим курс
    const course = await prisma.content.findFirst({
      where: {
        slug,
        type: 'COURSE',
        status: ContentStatus.PUBLISHED,
        deletedAt: null,
      },
      select: { id: true, title: true, slug: true },
    });

    if (!course) {
      return NextResponse.json({ error: 'Курс не найден' }, { status: 404 });
    }

    // Теперь находим модуль
    const module = await prisma.module.findFirst({
      where: {
        id: moduleId,
        courseId: course.id,
        deletedAt: null,
      },
      include: {
        lessons: {
          where: { 
            status: ContentStatus.PUBLISHED,
            deletedAt: null 
          },
          orderBy: { sortOrder: 'asc' },
          include: {
            author: { 
              select: { id: true, nickname: true, displayName: true, avatarUrl: true } 
            },
          },
        },
      },
    });

    if (!module) {
      return NextResponse.json({ error: 'Модуль не найден' }, { status: 404 });
    }

    const data = {
      ...module,
      courseTitle: course.title,
      courseSlug: course.slug,
    };

    return NextResponse.json({ data });
  } catch (e) {
    console.error('GET /api/course/[slug]/module/[moduleId] error', e);
    return NextResponse.json({ error: 'Ошибка при получении модуля' }, { status: 500 });
  }
}
