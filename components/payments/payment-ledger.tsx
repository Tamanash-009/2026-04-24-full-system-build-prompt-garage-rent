"use client";

import { useDeferredValue } from "react";

import { PaymentMarkPaidButton } from "@/components/forms/payment-mark-paid-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAppStore } from "@/lib/store/app-store";
import { formatCurrency, formatDate, formatMonthLabel } from "@/lib/utils";

interface PaymentLedgerRow {
  tenancyId: string;
  month: string;
  amount: number;
  status: "paid" | "pending";
  paid_on: string | null;
  tenantName: string;
  propertyName: string;
  advanceRemaining: number;
}

export function PaymentLedger({
  rows,
  isAdmin
}: {
  rows: PaymentLedgerRow[];
  isAdmin: boolean;
}) {
  const search = useAppStore((state) => state.paymentSearch);
  const setSearch = useAppStore((state) => state.setPaymentSearch);
  const deferredSearch = useDeferredValue(search);

  const filteredRows = rows.filter((row) => {
    const haystack = `${row.tenantName} ${row.propertyName} ${row.month} ${row.status}`.toLowerCase();
    return haystack.includes(deferredSearch.toLowerCase());
  });

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle className="text-xl">Rent ledger</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Missing months are surfaced as pending until they are marked paid.
          </p>
        </div>
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search tenant, property, month, or status"
          className="md:max-w-sm"
        />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Month</TableHead>
              <TableHead>Tenant</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Advance left</TableHead>
              <TableHead>Paid on</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRows.map((row) => (
              <TableRow key={`${row.tenancyId}-${row.month}`}>
                <TableCell className="font-medium text-slate-900">{formatMonthLabel(row.month)}</TableCell>
                <TableCell>{row.tenantName}</TableCell>
                <TableCell>{row.propertyName}</TableCell>
                <TableCell>
                  <Badge variant={row.status === "paid" ? "success" : "warning"}>{row.status}</Badge>
                </TableCell>
                <TableCell>{formatCurrency(row.amount)}</TableCell>
                <TableCell>{formatCurrency(row.advanceRemaining)}</TableCell>
                <TableCell>{formatDate(row.paid_on)}</TableCell>
                <TableCell className="text-right">
                  {isAdmin && row.status === "pending" ? (
                    <PaymentMarkPaidButton tenancyId={row.tenancyId} month={row.month} amount={row.amount} />
                  ) : (
                    <span className="text-xs text-slate-400">No action</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
