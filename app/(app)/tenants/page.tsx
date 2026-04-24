import Link from "next/link";
import { redirect } from "next/navigation";
import { ReceiptText, UserRound, Zap } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getDashboardData } from "@/lib/data";
import { formatCurrency, formatDate, formatMonthLabel } from "@/lib/utils";

export default async function TenantsPage() {
  const { profile, financeByTenancy } = await getDashboardData();

  if (!profile) {
    redirect("/sign-in");
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Badge variant="outline" className="mb-3 w-fit">
            {profile.role === "admin" ? "Admin tenancy overview" : "Tenant panel"}
          </Badge>
          <CardTitle className="text-2xl">
            {profile.role === "admin"
              ? "Portfolio-wide tenant view"
              : "Your rent history, pending dues, and electricity bills"}
          </CardTitle>
        </CardHeader>
      </Card>

      {financeByTenancy.length === 0 ? (
        <EmptyState
          icon={UserRound}
          title="No tenancy records found"
          description="Once a tenancy is created, this workspace will show monthly rent history, due amounts, and electricity bills."
        />
      ) : (
        financeByTenancy.map(({ tenancy, summary }) => (
          <Card key={tenancy.id}>
            <CardHeader className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {tenancy.property?.name ?? "Property"} • {tenancy.property?.location ?? "No location"}
                </p>
                <CardTitle className="mt-2 text-2xl">{tenancy.user?.name ?? "Tenant"}</CardTitle>
                <p className="mt-2 text-sm text-slate-600">
                  Phone: {tenancy.user?.phone ?? "N/A"} • Status: {tenancy.status}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="secondary" size="sm">
                  <Link href={`/api/export/pdf?tenancyId=${tenancy.id}`}>Export PDF</Link>
                </Button>
                <Button asChild variant="secondary" size="sm">
                  <Link href={`/api/export/excel?tenancyId=${tenancy.id}`}>Export Excel</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-4 md:grid-cols-3">
                <SummaryPill label="Monthly rent" value={formatCurrency(tenancy.monthly_rent)} icon={ReceiptText} />
                <SummaryPill
                  label="Advance remaining"
                  value={formatCurrency(summary.advanceRemaining)}
                  icon={ReceiptText}
                />
                <SummaryPill label="Electricity due" value={formatCurrency(summary.electricityDue)} icon={Zap} />
              </div>

              <div className="grid gap-6 xl:grid-cols-2">
                <Card className="bg-white/55">
                  <CardHeader>
                    <CardTitle className="text-lg">Rent history</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Month</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Paid on</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {summary.ledger.map((entry) => (
                          <TableRow key={entry.month}>
                            <TableCell className="font-medium text-slate-900">
                              {formatMonthLabel(entry.month)}
                            </TableCell>
                            <TableCell>
                              <Badge variant={entry.status === "paid" ? "success" : "warning"}>
                                {entry.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{formatCurrency(entry.amount)}</TableCell>
                            <TableCell>{formatDate(entry.paid_on)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card className="bg-white/55">
                  <CardHeader>
                    <CardTitle className="text-lg">Electricity bills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {tenancy.electricity.length === 0 ? (
                      <EmptyState
                        icon={Zap}
                        title="No electricity bills yet"
                        description="Add a reading from the electricity screen and it will appear here instantly."
                      />
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Initial</TableHead>
                            <TableHead>Current</TableHead>
                            <TableHead>Units</TableHead>
                            <TableHead>Bill</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {tenancy.electricity.map((entry) => (
                            <TableRow key={entry.id}>
                              <TableCell>{entry.initial_reading}</TableCell>
                              <TableCell>{entry.current_reading}</TableCell>
                              <TableCell>{entry.units_used}</TableCell>
                              <TableCell>{formatCurrency(entry.bill_amount)}</TableCell>
                              <TableCell>
                                <Badge variant={entry.paid_on ? "success" : "warning"}>
                                  {entry.paid_on ? "paid" : "pending"}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

function SummaryPill({
  label,
  value,
  icon: Icon
}: {
  label: string;
  value: string;
  icon: typeof ReceiptText;
}) {
  return (
    <div className="rounded-[1.4rem] border border-white/50 bg-white/70 p-4">
      <div className="flex items-center gap-2 text-slate-500">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <p className="mt-3 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}
