import { redirect } from "next/navigation";

import { ElectricityLedger } from "@/components/electricity/electricity-ledger";
import { ElectricityFormDialog } from "@/components/forms/electricity-form-dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardData } from "@/lib/data";

export default async function ElectricityPage() {
  const { profile, tenancies } = await getDashboardData();

  if (!profile) {
    redirect("/sign-in");
  }

  const rows = tenancies.flatMap((tenancy) =>
    tenancy.electricity.map((entry) => ({
      ...entry,
      tenantName: tenancy.user?.name ?? "Unknown tenant",
      propertyName: tenancy.property?.name ?? "Unknown property"
    }))
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Badge variant="outline" className="mb-3 w-fit">
              Meter readings and billing
            </Badge>
            <CardTitle className="text-2xl">
              {profile.role === "admin"
                ? "Log readings, calculate usage, and close outstanding bills"
                : "Review your electricity bill history"}
            </CardTitle>
          </div>
          {profile.role === "admin" ? <ElectricityFormDialog tenancies={tenancies} /> : null}
        </CardHeader>
      </Card>

      <ElectricityLedger rows={rows} isAdmin={profile.role === "admin"} />
    </div>
  );
}
