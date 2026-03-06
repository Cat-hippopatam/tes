import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/lib/prisma';
import { ContentStatus } from '@prisma/client';

// GET /api/content/[slug]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const item = await prisma.content.findFirst({
      where: {
        slug,
        status: ContentStatus.PUBLISHED,
        deletedAt: null,
      },
      include: {
        author: { select: { id: true, nickname: true, displayName: true, avatarUrl: true } },
        tags: { include: { tag: { select: { id: true, name: true, slug: true, color: true } } } },
        module: {
          include: {
            course: { select: { id: true, title: true, slug: true } },
          },
        },
        courseModules: {
          orderBy: { sortOrder: 'asc' },
          include: {
            lessons: {
              orderBy: { sortOrder: 'asc' },
              select: { id: true, title: true, slug: true, type: true, sortOrder: true }
            },
          },
        },
      },
    });

    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const data = {
      ...item,
      isPremium: item.isPremium,
      tags: item.tags.map((tc) => tc.tag),
    };

    return NextResponse.json({ data });
  } catch (e) {
    console.error('GET /api/content/[slug] error', e);
    return NextResponse.json({ error: 'Failed to fetch content item' }, { status: 500 });
  }
}
