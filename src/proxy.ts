import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasAuthCookie = request.cookies.has(process.env.COOKIE_NAME || "nextjs_template");

  const isAuthPage = pathname.startsWith("/auth");

  // Explicitly define public routes.
  // It's usually safer to check exact matches for root ("/") to avoid catching everything.
  const publicPaths = ["/", "/about", "/contact", "/products"];
  const isPublicPage =
    publicPaths.includes(pathname) || publicPaths.some((p) => p !== "/" && pathname.startsWith(p));

  // 1. Unauthenticated user trying to access a protected route
  if (!hasAuthCookie && !isAuthPage && !isPublicPage) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // 2. Authenticated user trying to access login/register pages
  if (hasAuthCookie && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Good matcher setup. Excludes static files, API routes, and Next internals.
  matcher: ["/((?!api|_next/static|_next/image|admin|favicon.ico).*)"],
};
