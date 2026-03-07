
import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = await getToken({ req: request });
  
  // Публичные маршруты (не требуют авторизации)
  const publicRoutes = [
    "/",
    "/catalog",
    "/content",
    "/article",
    "/calculator",
    "/faq",
    "/tools",
    "/api/auth",
    "/api/content",
  ];
  
  // Проверяем, является ли маршрут публичным
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + "/")
  );
  
  if (isPublicRoute) {
    return NextResponse.next();
  }
  
  // Защищённые маршруты (требуют авторизации)
  const protectedRoutes = ["/profile", "/course", "/lesson"];
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  if (isProtectedRoute && !token) {
    // Перенаправляем на главную с параметром для открытия модалки авторизации
    const url = new URL("/", request.url);
    url.searchParams.set("auth", "login");
    return NextResponse.redirect(url);
  }
  
  // Административные маршруты (только для ADMIN)
  if (pathname.startsWith("/admin")) {
    const userRole = token?.role as string;
    if (userRole !== "ADMIN") {
      const url = new URL("/profile", request.url);
      return NextResponse.redirect(url);
    }
  }

  // Маршруты автора (для AUTHOR, MODERATOR, ADMIN)
  if (pathname.startsWith("/author")) {
    const userRole = token?.role as string;
    if (!["AUTHOR", "MODERATOR", "ADMIN"].includes(userRole)) {
      const url = new URL("/profile", request.url);
      return NextResponse.redirect(url);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Защищаем все маршруты кроме публичных:
     * - /profile/:path* - личный кабинет
     * - /course/:path* - курсы
     * - /lesson/:path* - уроки
     * - /admin/:path* - админ-панель
     * - /author/:path* - панель автора
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)"
  ]
}