import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Activity,
  BadgeIndianRupee,
  Clock3,
  Download,
  PlugZap,
  TrendingUp,
  Wallet
} from "lucide-react";

import { RentTrendChart } from "@/components/charts/rent-trend-chart";
import { StatusDonutChart } from "@/components/charts/status-donut-chart";
import { MetricCard } from "@/components/dashboard/metric-card";
import { PropertyFormDialog } from "@/components/forms/property-form-dialog";
import { TenancyFormDialog } from "@/components/forms/tenancy-form-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getDashboardData, getReferenceData } from "@/lib/data";
import { formatCurrency, formatDate, formatMonthLabel } from "@/lib/utils";

export default async function DashboardPage() {
  const { profile, metrics, recentPayments, financeByTenancy } = await getDashboardData();
  const { tenants, properties } = await getReferenceData();

  if (!profile) {
    redirect("/sign-in");
  }

  if (profile.role !== "admin") {
    redirect("/tenants");
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total rent collected"
          value={formatCurrency(metrics.totalRentCollected)}
          detail="Closed rent payments across all active tenancies."
          icon={BadgeIndianRupee}
        />
        <MetricCard
          label="Pending rent count"
          value={String(metrics.pendingRentCount)}
          detail="Missing or not-yet-paid months requiring attention."
          icon={Clock3}
          badge="Pending"
        />
        <MetricCard
          label="Advance remaining"
          value={formatCurrency(metrics.advanceRemaining)}
          detail="Remaining balance after subtracting paid rent from advances."
          icon={Wallet}
        />
        <MetricCard
          label="Electricity summary"
          value={formatCurrency(metrics.electricitySummary)}
          detail="Total electricity bills recorded across the portfolio."
          icon={PlugZap}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <RentTrendChart data={metrics.rentTrend} />
        <StatusDonutChart data={metrics.paidVsPending} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <Badge variant="outline" className="mb-3 w-fit">
                Quick actions
              </Badge>
              <CardTitle className="text-2xl">Keep the ledger moving</CardTitle>
            </div>
            <TrendingUp className="h-5 w-5 text-cyan-700" />
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="flex flex-wrap gap-3">
              <TenancyFormDialog tenants={tenants} properties={properties} />
              <PropertyFormDialog />
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="secondary">
                <Link href="/api/export/pdf">
                  <Download className="h-4 w-4" />
                  Export PDF ledger
                </Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/api/export/excel">
                  <Download className="h-4 w-4" />
                  Export Excel ledger
                </Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              The monthly rent cron route runs daily at 00:05 IST via Vercel, ensuring new months
              become pending automatically without manual backfills.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Recent payments</CardTitle>
          </CardHeader>
          <CardContent>
            {recentPayments.length === 0 ? (
              <EmptyState
                icon={Activity}
                title="No payments yet"
                description="Create a tenancy first and GarageFlow will generate pending months ready to be marked as paid."
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Month</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Paid on</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium text-slate-900">{payment.tenantName}</TableCell>
                      <TableCell>{payment.propertyName}</TableCell>
                      <TableCell>{formatMonthLabel(payment.month)}</TableCell>
                      <TableCell>{formatCurrency(payment.amount)}</TableCell>
                      <TableCell>{formatDate(payment.paid_on)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        {financeByTenancy.length === 0 ? (
          <div className="xl:col-span-3">
            <EmptyState
              icon={BadgeIndianRupee}
              title="No tenancies added"
              description="Add your first property and tenancy to start generating rent months, dashboards, and exports."
            />
          </div>
        ) : (
          financeByTenancy.map(({ tenancy, summary }) => (
            <Card key={tenancy.id}>
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-muted-foreground">{tenancy.property?.name ?? "Property"}</p>
                    <CardTitle className="text-xl">{tenancy.user?.name ?? "Tenant"}</CardTitle>
                  </div>
                  <Badge variant={summary.pendingAmount > 0 ? "warning" : "success"}>
                    {summary.pendingAmount > 0 ? "Attention needed" : "Healthy"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="grid gap-4 text-sm">
                <div className="grid gap-3 rounded-[1.25rem] border border-white/50 bg-white/70 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Advance remaining</span>
                    <span className="font-semibold text-slate-900">
                      {formatCurrency(summary.advanceRemaining)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Pending dues</span>
                    <span className="font-semibold text-slate-900">
                      {formatCurrency(summary.pendingAmount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Electricity due</span>
                    <span className="font-semibold text-slate-900">
                      {formatCurrency(summary.electricityDue)}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button asChild variant="secondary" size="sm">
                    <Link href={`/api/export/pdf?tenancyId=${tenancy.id}`}>PDF</Link>
                  </Button>
                  <Button asChild variant="secondary" size="sm">
                    <Link href={`/api/export/excel?tenancyId=${tenancy.id}`}>Excel</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </section>
    </div>
  );
}
