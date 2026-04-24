import { NextRequest, NextResponse } from "next/server";

import { hasCronSecret } from "@/lib/env";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import { syncAllRentPayments } from "@/lib/sync";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const expected = process.env.CRON_SECRET ? `Bearer ${process.env.CRON_SECRET}` : null;

  if (hasCronSecret() && authHeader !== expected) {
    return NextResponse.json({ error: "Unauthorized cron request." }, { status: 401 });
  }

  const supabase = createAdminSupabaseClient();

  if (!supabase) {
    return NextResponse.json({ error: "Service role is not configured." }, { status: 500 });
  }

  const created = await syncAllRentPayments(supabase);

  return NextResponse.json({
    ok: true,
    created
  });
}
