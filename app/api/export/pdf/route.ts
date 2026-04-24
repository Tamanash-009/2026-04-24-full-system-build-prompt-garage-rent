import { NextRequest, NextResponse } from "next/server";

import { getDashboardData } from "@/lib/data";
import { buildPdfLedger } from "@/lib/export";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { profile, tenancies } = await getDashboardData();

  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tenancyId = request.nextUrl.searchParams.get("tenancyId");
  const scopedTenancies = tenancyId ? tenancies.filter((tenancy) => tenancy.id === tenancyId) : tenancies;

  if (scopedTenancies.length === 0) {
    return NextResponse.json({ error: "No tenancy data found for export." }, { status: 404 });
  }

  const pdf = await buildPdfLedger(scopedTenancies);

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="garageflow-ledger.pdf"`
    }
  });
}
