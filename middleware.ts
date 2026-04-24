import type { NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: ["/dashboard/:path*", "/tenants/:path*", "/payments/:path*", "/electricity/:path*", "/sign-in", "/sign-up"]
};
