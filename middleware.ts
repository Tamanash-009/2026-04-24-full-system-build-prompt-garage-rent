import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";

import { hasClerkEnv } from "@/lib/env";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/tenants(.*)",
  "/payments(.*)",
  "/electricity(.*)",
  "/onboarding(.*)",
  "/auth-complete(.*)",
  "/api/export(.*)"
]);

const clerkHandler = clerkMiddleware(async (auth, request) => {
  if (isProtectedRoute(request)) {
    await auth.protect();
  }
});

export default function middleware(request: NextRequest, event: NextFetchEvent) {
  if (!hasClerkEnv()) {
    return NextResponse.next();
  }

  return clerkHandler(request, event);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)"
  ]
};
