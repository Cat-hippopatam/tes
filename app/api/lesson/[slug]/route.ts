import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/lib/prisma';
import { ContentStatus } from '@prisma/client';

// GET /api/lesson/[slug] — получить урок
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    const lesson = await prisma.content.findFirst({
      where: {
        slug,
        status: ContentStatus.PUBLISHED,
        deletedAt: null,
      },
      include: {
        author: { 
          select: { id: true, nickname: true, displayName: true, avatarUrl: true } 
        },
        module: {
          include: {
            course: { 
              select: { id: true, title: true, slug: true, isPremium: true } 
            },
          },
        },
        tags: { 
          include: { tag: { select: { id: true, name: true, slug: true, color: true } } } 
        },
      },
    });

    if (!lesson) {
      return NextResponse.json({ error: 'Урок не найден' }, { status: 404 });
    }

    const data = {
      ...lesson,
      tags: lesson.tags.map((tc) => tc.tag),
      courseIsPremium: lesson.module?.course?.isPremium ?? false,
    };

    return NextResponse.json({ data });
  } catch (e) {
    console.error('GET /api/lesson/[slug] error', e);
    return NextResponse.json({ error: 'Ошибка при получении урока' }, { status: 500 });
  }
}
