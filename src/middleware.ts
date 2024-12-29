import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { AUTH_ROUTES, DEFAULT_LOGIN_REDIRECT, PUBLIC_ROUTES, SESSION_NAME } from "@/constant";

export function middleware(request: NextRequest) {
  const session = cookies().get(SESSION_NAME);
  const isLoggedIn = !!session;
  const { nextUrl } = request;

  const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname);
  const isAuthRoute = AUTH_ROUTES.includes(nextUrl.pathname);

  if (isAuthRoute) {
    if (isLoggedIn) {
      const callbackUrl = nextUrl.searchParams.get("callbackUrl");
      const redirectUrl = callbackUrl || DEFAULT_LOGIN_REDIRECT;
      return Response.redirect(new URL(redirectUrl, nextUrl));
    }
    return null;
  }

  if (!isLoggedIn && !isPublicRoute) {
    const callbackUrl = nextUrl.pathname + nextUrl.search;
    return NextResponse.redirect(new URL(`/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`, nextUrl));
  }

  return null;
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
