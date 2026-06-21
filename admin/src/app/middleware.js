// src/app/middleware.js (در ریشه ادمین)

import { NextResponse } from "next/server";
import { api } from "@/app/config";

export async function middleware(request) {
  const path = request.nextUrl.pathname;

  // مسیرهای عمومی که نیاز به لاگین ندارند
  const publicPaths = ["/login", "/", "/_next", "/favicon.ico", "/api"];
  const isPublicPath = publicPaths.some((p) => path.startsWith(p));

  // اگر در مسیر عمومی هستیم، ادامه بده
  if (isPublicPath) {
    return NextResponse.next();
  }

  // دریافت کوکی از request
  const cookie = request.cookies.get("admin_access_token");
  const accessToken = cookie?.value;

  // اگر توکن وجود نداشت، به لاگین هدایت کن
  if (!accessToken) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // چک کردن وضعیت ادمین با درخواست به بک‌اند
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/auth/admin/me/`,
      {
        headers: {
          Cookie: `admin_access_token=${accessToken}`,
        },
      },
    );

    if (response.ok) {
      const adminData = await response.json();

      // اگر is_staff نبود، به لاگین هدایت کن
      if (adminData.is_staff !== true) {
        const loginUrl = new URL("/login", request.url);
        return NextResponse.redirect(loginUrl);
      }
    } else {
      // اگر درخواست ناموفق بود، به لاگین هدایت کن
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  } catch (error) {
    console.error("Middleware error:", error);
    // در صورت خطا، اجازه دسترسی نده
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/:path*",
    "/((?!login|_next|favicon.ico).*)",
  ],
};
