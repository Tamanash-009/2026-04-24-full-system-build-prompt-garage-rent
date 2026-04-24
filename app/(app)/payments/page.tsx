import Link from "next/link";
import { redirect } from "next/navigation";
import { Download } from "lucide-react";

import { PaymentLedger } from "@/components/payments/payment-ledger";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardData } from "@/lib/data";

export default async function PaymentsPage() {
  const { profile, rentLedger } = await getDashboardData();

  if (!profile) {
    redirect("/sign-in");
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Badge variant="outline" className="mb-3 w-fit">
              {profile.role === "admin" ? "Admin controls" : "Tenant read-only view"}
            </Badge>
            <CardTitle className="text-2xl">
              {profile.role === "admin"
                ? "Review, search, and close pending rent months"
                : "Track your paid and pending rent months"}
            </CardTitle>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="secondary">
              <Link href="/api/export/pdf">
                <Download className="h-4 w-4" />
                PDF export
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/api/export/excel">
                <Download className="h-4 w-4" />
                Excel export
              </Link>
            </Button>
          </div>
        </CardHeader>
      </Card>

      <PaymentLedger rows={rentLedger} isAdmin={profile.role === "admin"} />
    </div>
  );
}
