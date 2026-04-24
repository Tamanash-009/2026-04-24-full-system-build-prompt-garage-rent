import { NextRequest, NextResponse } from "next/server";

import { getDashboardData } from "@/lib/data";
import { buildExcelLedger } from "@/lib/export";

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

  const workbookBuffer = buildExcelLedger(scopedTenancies);

  return new NextResponse(workbookBuffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="garageflow-ledger.xlsx"`
    }
  });
}
