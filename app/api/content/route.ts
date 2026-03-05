import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/lib/prisma';
import { ContentStatus, ContentType, DifficultyLevel } from '@prisma/client';

// GET /api/content
// Query params:
// - search: string
// - type: COURSE|ARTICLE|VIDEO (comma-separated allowed)
// - tags: comma-separated tag slugs
// - difficulty: BEGINNER|INTERMEDIATE|ADVANCED (comma-separated allowed)
// - isPremium: true|false
// - sort: newest|popular|views|likes (default: newest)
// - page: number (default: 1)
// - pageSize: number (default: 12)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const search = searchParams.get('search')?.trim() || '';
    const typeParam = searchParams.get('type') || '';
    const tagsParam = searchParams.get('tags') || '';
    const difficultyParam = searchParams.get('difficulty') || '';
    const isPremiumParam = searchParams.get('isPremium');
    const sort = (searchParams.get('sort') || 'newest').toLowerCase();
    const page = Math.max(parseInt(searchParams.get('page') || '1', 10) || 1, 1);
    const pageSize = Math.min(Math.max(parseInt(searchParams.get('pageSize') || '12', 10) || 12, 1), 50);

    const types = typeParam
      .split(',')
      .map((t) => t.trim().toUpperCase())
      .filter((t) => t in ContentType) as ContentType[];

    const tags = tagsParam
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    const difficulties = difficultyParam
      .split(',')
      .map((d) => d.trim().toUpperCase())
      .filter((d) => d in DifficultyLevel) as DifficultyLevel[];

    const isPremium = isPremiumParam === 'true' ? true : isPremiumParam === 'false' ? false : undefined;

    // WHERE clause
    const where: any = {
      status: ContentStatus.PUBLISHED,
      deletedAt: null,
      ...(types.length ? { type: { in: types } } : {}),
      ...(difficulties.length ? { difficultyLevel: { in: difficulties } } : {}),
      ...(typeof isPremium === 'boolean' ? { isPremium } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
              { body: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
      ...(tags.length
        ? {
            tags: {
              some: {
                tag: {
                  slug: { in: tags },
                },
              },
            },
          }
        : {}),
    };

    // ORDER BY
    const orderBy = (() => {
      switch (sort) {
        case 'popular':
        case 'likes':
          return [{ likesCount: 'desc' as const }, { publishedAt: 'desc' as const }];
        case 'views':
          return [{ viewsCount: 'desc' as const }, { publishedAt: 'desc' as const }];
        case 'newest':
        default:
          return [{ publishedAt: 'desc' as const }];
      }
    })();

    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const [total, items] = await Promise.all([
      prisma.content.count({ where }),
      prisma.content.findMany({
        where,
        orderBy,
        skip,
        take,
        include: {
          author: {
            select: { id: true, nickname: true, displayName: true, avatarUrl: true }
          },
          tags: {
            include: {
              tag: { select: { id: true, name: true, slug: true, color: true } },
            },
          },
        },
      }),
    ]);

    // Normalize tags
    const data = items.map((c) => ({
      ...c,
      tags: c.tags.map((tc) => tc.tag),
    }));

    const meta = {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    };

    return NextResponse.json({ data, meta });
  } catch (e: any) {
    console.error('GET /api/content error', e);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}
