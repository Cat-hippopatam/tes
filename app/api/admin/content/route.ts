import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/lib/prisma';
import { withRoleCheck } from '@/lib/role-check';
import { ContentStatus, ContentType } from '@prisma/client';

// GET /api/admin/content - получить весь контент (ADMIN, MODERATOR)
export async function GET(request: NextRequest) {
  const roleCheck = await withRoleCheck(request, { roles: ['ADMIN', 'MODERATOR'] });
  if (roleCheck) return roleCheck;

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.trim() || '';
    const type = searchParams.get('type') || '';
    const status = searchParams.get('status') || '';
    const page = Math.max(parseInt(searchParams.get('page') || '1', 10), 1);
    const pageSize = Math.min(Math.max(parseInt(searchParams.get('pageSize') || '20', 10), 1), 50);

    const where: any = {};
    
    // Для админов показываем весь контент, включая удалённый (для возможности восстановления)
    // Но по умолчанию скрываем soft-deleted
    if (!request.url.includes('includeDeleted=true')) {
      where.deletedAt = null;
    }

    if (type) where.type = type as ContentType;
    if (status) where.status = status as ContentStatus;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ];
    }

    const skip = (page - 1) * pageSize;

    const [total, items] = await Promise.all([
      prisma.content.count({ where }),
      prisma.content.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { updatedAt: 'desc' },
        include: {
          author: {
            select: { id: true, nickname: true, displayName: true, avatarUrl: true },
          },
          tags: {
            include: {
              tag: { select: { id: true, name: true, slug: true } },
            },
          },
        },
      }),
    ]);

    const data = items.map((item) => ({
      ...item,
      tags: item.tags.map((tc) => tc.tag),
    }));

    return NextResponse.json({
      data,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error('Admin content GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка при получении контента' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/content - обновить контент (ADMIN, MODERATOR)
export async function PATCH(request: NextRequest) {
  const roleCheck = await withRoleCheck(request, { roles: ['ADMIN', 'MODERATOR'] });
  if (roleCheck) return roleCheck;

  try {
    const body = await request.json();
    const { id, status, isPremium } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID контента обязателен' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (typeof isPremium === 'boolean') updateData.isPremium = isPremium;

    const content = await prisma.content.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: content });
  } catch (error) {
    console.error('Admin content PATCH error:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка при обновлении контента' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/content - удалить контент (только ADMIN)
export async function DELETE(request: NextRequest) {
  const roleCheck = await withRoleCheck(request, { roles: ['ADMIN'] });
  if (roleCheck) return roleCheck;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID контента обязателен' },
        { status: 400 }
      );
    }

    // Soft delete
    await prisma.content.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin content DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка при удалении контента' },
      { status: 500 }
    );
  }
}
