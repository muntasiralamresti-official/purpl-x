import { NextResponse } from "next/server";

// Routes that require authentication
const PROTECTED_ROUTES = ["/profile", "/message", "/notifications", "/people"];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Check if the route is protected
  const isProtected = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  // Check for the auth cookie set by login()
  const token = request.cookies.get("purpl-token")?.value;

  if (!token) {
    // Redirect to login, preserving the intended destination
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/message/:path*",
    "/notifications/:path*",
    "/people/:path*",
  ],
};
