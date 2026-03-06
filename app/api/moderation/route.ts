import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/lib/prisma';
import { withRoleCheck } from '@/lib/role-check';
import { ContentStatus, ModerationItemType, ModerationStatus } from '@prisma/client';
import { auth } from '@/auth/auth';

// GET /api/moderation - получить контент на модерацию (только MODERATOR, ADMIN)
export async function GET(request: NextRequest) {
  // Проверка роли
  const roleCheck = await withRoleCheck(request, { roles: ['MODERATOR', 'ADMIN'] });
  if (roleCheck) return roleCheck;

  try {
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get('status') || 'PENDING_REVIEW';
    const status = statusParam as ContentStatus;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const [contents, total] = await Promise.all([
      prisma.content.findMany({
        where: { status, deletedAt: null }, // Soft delete filter
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'asc' },
        include: {
          author: {
            select: {
              id: true,
              displayName: true,
              avatarUrl: true,
              user: {
                select: {
                  email: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
          _count: {
            select: {
              comments: true,
              contentReactions: true,
            },
          },
        },
      }),
      prisma.content.count({ where: { status, deletedAt: null } }),
    ]);

    return NextResponse.json({
      success: true,
      data: contents,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Moderation GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка при получении контента' },
      { status: 500 }
    );
  }
}

// POST /api/moderation - принять/отклонить контент (только MODERATOR, ADMIN)
export async function POST(request: NextRequest) {
  // Проверка роли
  const roleCheck = await withRoleCheck(request, { roles: ['MODERATOR', 'ADMIN'] });
  if (roleCheck) return roleCheck;

  try {
    const session = await auth();
    const body = await request.json();
    const { contentId, action, reason } = body; // action: 'approve' | 'reject'

    if (!contentId || !action) {
      return NextResponse.json(
        { success: false, error: 'contentId и action обязательны' },
        { status: 400 }
      );
    }

    const newStatus = action === 'approve' ? 'PUBLISHED' : 'DRAFT';

    const content = await prisma.content.update({
      where: { id: contentId },
      data: { status: newStatus },
    });

    // Получаем профиль модератора
    const profile = await prisma.profile.findUnique({
      where: { userId: session?.user?.id },
    });

    // Создаём запись модерации
    if (profile) {
      // Получаем автора контента для submittedByProfileId
      const content = await prisma.content.findUnique({
        where: { id: contentId },
        select: { authorProfileId: true },
      });

      await prisma.moderationItem.create({
        data: {
          itemType: ModerationItemType.CONTENT,
          itemId: contentId,
          status: action === 'approve' ? ModerationStatus.APPROVED : ModerationStatus.REJECTED,
          moderationComment: reason || null,
          submittedByProfileId: content?.authorProfileId || profile.id,
          moderatedByProfileId: profile.id,
        },
      });
    }

    return NextResponse.json({ success: true, data: content });
  } catch (error) {
    console.error('Moderation POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка при модерации' },
      { status: 500 }
    );
  }
}
