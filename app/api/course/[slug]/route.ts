import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/lib/prisma';
import { ContentStatus } from '@prisma/client';

// GET /api/course/[slug] — получить курс с модулями и уроками
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    const course = await prisma.content.findFirst({
      where: {
        slug,
        type: 'COURSE',
        status: ContentStatus.PUBLISHED,
        deletedAt: null,
      },
      include: {
        author: { 
          select: { id: true, nickname: true, displayName: true, avatarUrl: true } 
        },
        tags: { 
          include: { tag: { select: { id: true, name: true, slug: true, color: true } } } 
        },
        courseModules: {
          where: { deletedAt: null },
          orderBy: { sortOrder: 'asc' },
          include: {
            lessons: {
              where: { 
                status: ContentStatus.PUBLISHED,
                deletedAt: null 
              },
              orderBy: { sortOrder: 'asc' },
              select: { 
                id: true, 
                title: true, 
                slug: true, 
                type: true, 
                sortOrder: true,
                videoDuration: true,
                description: true,
              }
            },
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: 'Курс не найден' }, { status: 404 });
    }

    const data = {
      ...course,
      tags: course.tags.map((tc) => tc.tag),
    };

    return NextResponse.json({ data });
  } catch (e) {
    console.error('GET /api/course/[slug] error', e);
    return NextResponse.json({ error: 'Ошибка при получении курса' }, { status: 500 });
  }
}
