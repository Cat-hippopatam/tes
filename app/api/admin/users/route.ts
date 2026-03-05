import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/lib/prisma';

// GET /api/admin/users - получить всех пользователей
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: any = {};
    if (role) where.role = role;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          profile: true,
          _count: {
            select: {
              contents: true,
              comments: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Admin users GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка при получении пользователей' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/users - обновить пользователя (роль, статус)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, role, isActive } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId обязателен' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (role) updateData.role = role;
    if (typeof isActive === 'boolean') updateData.isActive = isActive;

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error('Admin users PATCH error:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка при обновлении пользователя' },
      { status: 500 }
    );
  }
}
