import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

/**
 * Middleware pour protéger les routes en App Router
 * - Routes publiques accessibles uniquement si pas connecté
 * - Routes protégées accessibles uniquement si connecté
 */
export function proxy(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const isLoggedIn = Boolean(token && token !== "");

  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  // Pages publiques (layout public)
  const publicPaths = [
    "/login",
    "/register",
    "/reset-password",
    "/forgot-password",
    "/deleted-account",
  ];

  // Pages protégées (layout protected)
  const protectedPaths = ["/dashboard", "/profile", "/games"];

  // 1️⃣ Rediriger vers login si accès à pages protégées sans être connecté
  if (protectedPaths.some((path) => pathname.startsWith(path)) && !isLoggedIn) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // 2️⃣ Rediriger vers dashboard si accès à pages publiques alors que connecté
  if (publicPaths.some((path) => pathname.startsWith(path)) && isLoggedIn) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

/**
 * Matcher pour le middleware
 * - On ne met pas "app/" car Next.js n’expose pas ce segment dans l’URL
 * - On inclut toutes les routes publiques et protégées
 */
export const config = {
  matcher: [
    "/login",
    "/register",
    "/reset-password",
    "/forgot-password",
    "/deleted-account",
    "/dashboard/:path*",
    "/profile/:path*",
    "/games/:path*",
  ],
};
