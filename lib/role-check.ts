import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/auth/auth';
import { prisma } from '@/utils/lib/prisma';

type Role = 'USER' | 'AUTHOR' | 'MODERATOR' | 'ADMIN';

interface RouteConfig {
  roles?: Role[];
  redirectTo?: string;
}

/**
 * Middleware для проверки роли пользователя
 * Использование: добавить в начало API route:
 *   return withRoleCheck(request, { roles: ['ADMIN', 'MODERATOR'] });
 */
export async function withRoleCheck(
  request: NextRequest,
  config: RouteConfig
): Promise<NextResponse | null> {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      if (config.redirectTo) {
        return NextResponse.redirect(new URL(config.redirectTo, request.url));
      }
      return NextResponse.json(
        { success: false, error: 'Требуется авторизация' },
        { status: 401 }
      );
    }

    // Получаем пользователя из БД для проверки роли
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    // Проверяем роль
    if (config.roles && !config.roles.includes(user.role as Role)) {
      return NextResponse.json(
        { success: false, error: 'Доступ запрещён' },
        { status: 403 }
      );
    }

    return null; // Роль разрешена
  } catch (error) {
    console.error('Role check error:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка проверки прав' },
      { status: 500 }
    );
  }
}

/**
 * Хелпер для проверки роли на стороне сервера (Server Components)
 */
export async function checkUserRole(requiredRoles: Role[]): Promise<boolean> {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return false;
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true },
    });

    if (!user) {
      return false;
    }

    return requiredRoles.includes(user.role as Role);
  } catch {
    return false;
  }
}
