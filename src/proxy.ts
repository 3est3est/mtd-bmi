import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Allow the requests if the following is true...
  // 1) It's a request for next-auth session & provider fetching
  // 2) It's a public route (login, register)
  // 3) the token exists
  const publicRoutes = ["/login", "/register", "/api/register"];
  if (pathname.includes("/api/auth") || publicRoutes.some(route => pathname === route || pathname.startsWith(route)) || token) {
    return NextResponse.next();
  }

  // Redirect them to login if they don't have token and are requesting a protected route
  const protectedRoutes = ["/", "/dashboard", "/history", "/reports"];
  if (!token && protectedRoutes.some(route => pathname === route || pathname.startsWith(route + "/"))) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/history/:path*",
    "/reports/:path*",
  ],
};
