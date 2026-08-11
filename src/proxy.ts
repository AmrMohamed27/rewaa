import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const handleIntl = createMiddleware(routing);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Run next-intl middleware for locale handling & redirects
  const response = handleIntl(request);

  // If next-intl generated a redirect (e.g. /dashboard -> /ar/dashboard), return it
  if (
    response.status === 307 ||
    response.status === 308 ||
    response.headers.get("x-middleware-rewrite")
  ) {
    return response;
  }

  const hasAuthCookie = request.cookies.has(process.env.COOKIE_NAME || "rewaa_auth");

  // Strip locale prefix for checking page type
  const pathnameWithoutLocale = pathname.replace(/^\/(ar|en)/, "") || "/";
  const isAuthPage = pathnameWithoutLocale.startsWith("/auth");

  const publicPaths = ["/", "/about", "/contact", "/products"];
  const isPublicPage =
    publicPaths.includes(pathnameWithoutLocale) ||
    publicPaths.some((p) => p !== "/" && pathnameWithoutLocale.startsWith(p));

  const currentLocale = pathname.match(/^\/(ar|en)/)?.[1] || routing.defaultLocale;

  // 1. Unauthenticated user trying to access a protected route
  if (!hasAuthCookie && !isAuthPage && !isPublicPage) {
    return NextResponse.redirect(new URL(`/${currentLocale}/auth/login`, request.url));
  }

  // 2. Authenticated user trying to access login/register pages
  if (hasAuthCookie && isAuthPage) {
    return NextResponse.redirect(new URL(`/${currentLocale}/dashboard`, request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|admin|favicon.ico|.*\\..*).*)"],
};
