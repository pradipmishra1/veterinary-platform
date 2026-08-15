import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "vet_session";

async function isValidSession(token: string | undefined) {
  if (!token) return false;
  const secret = process.env.SESSION_SECRET;
  if (!secret) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return true;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/vetsuppose/login" || pathname.startsWith("/api/auth/")) {
    return NextResponse.next();
  }

  const isProtectedPage = pathname.startsWith("/vetsuppose");
  const isProtectedApi =
    pathname.startsWith("/api/products") ||
    pathname.startsWith("/api/services") ||
    pathname.startsWith("/api/finance") ||
    pathname.startsWith("/api/upload") ||
    pathname.startsWith("/api/bookings");

  // Public reads: anyone can browse products/services
  if (isProtectedApi && req.method === "GET" && (pathname.startsWith("/api/products") || pathname.startsWith("/api/services"))) {
    return NextResponse.next();
  }
  // Public write: customers can submit a booking without logging in
  if (pathname.startsWith("/api/bookings") && req.method === "POST") {
    return NextResponse.next();
  }

  if (isProtectedPage || isProtectedApi) {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    const valid = await isValidSession(token);
    if (!valid) {
      if (isProtectedApi) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const loginUrl = new URL("/vetsuppose/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/vetsuppose/:path*",
    "/api/products/:path*",
    "/api/services/:path*",
    "/api/finance/:path*",
    "/api/upload/:path*",
    "/api/bookings/:path*"
  ]
};