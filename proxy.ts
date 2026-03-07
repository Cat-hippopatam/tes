
import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = await getToken({ 
    req: request,
    secret: process.env.AUTH_SECRET
  });
  
  // Публичные маршруты (не требуют авторизации)
  const publicRoutes = [
    "/",
    "/catalog",
    "/content",
    "/article",
    "/calculator",
    "/faq",
    "/tools",
    "/login",
    "/register",
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
    // Перенаправляем на страницу входа
    const url = new URL("/login", request.url);
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
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)"
  ]
}