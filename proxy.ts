import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

const matchesPath = (pathname: string, path: string) =>
  pathname === path || pathname.startsWith(`${path}/`);

/**
 * Middleware to secure routes in App Router
 * - public routes are accessible only if the user is not logged in,
 * - secured routes are accessible only if the user is logged in.
 */
export function proxy(req: NextRequest) {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  const token = req.cookies.get("token")?.value;

  let isLoggedIn = false;

  if (token) {
    try {
      jwt.verify(token, JWT_SECRET);
      isLoggedIn = true;
    } catch {
      isLoggedIn = false;
    }
  }

  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  const publicPaths = [
    "/login",
    "/register",
    "/reset-password",
    "/forgot-password",
  ];

  const protectedPaths = [
    "/dashboard",
    "/profile",
    "/games",
  ];

  if (
    protectedPaths.some((path) => matchesPath(pathname, path)) &&
    !isLoggedIn
  ) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (
    publicPaths.some((path) => matchesPath(pathname, path)) &&
    isLoggedIn
  ) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

/**
 * Matcher for the middleware
 * - we do not include "app/" because Next.js does not expose this segment in the URL,
 * - we include all public and protected routes.
 */
export const config = {
  matcher: [
    "/login",
    "/register",
    "/reset-password",
    "/forgot-password",
    "/dashboard/:path*",
    "/profile/:path*",
    "/games/:path*",
  ],
};
