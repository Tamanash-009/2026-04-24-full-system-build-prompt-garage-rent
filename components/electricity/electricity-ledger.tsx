"use client";

import { MarkElectricityPaidButton } from "@/components/forms/mark-electricity-paid-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";

interface ElectricityLedgerRow {
  id: string;
  tenantName: string;
  propertyName: string;
  initial_reading: number;
  current_reading: number;
  units_used: number;
  bill_amount: number;
  paid_on: string | null;
}

export function ElectricityLedger({
  rows,
  isAdmin
}: {
  rows: ElectricityLedgerRow[];
  isAdmin: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Electricity ledger</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tenant</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Initial</TableHead>
              <TableHead>Current</TableHead>
              <TableHead>Units</TableHead>
              <TableHead>Bill</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Paid on</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium text-slate-900">{row.tenantName}</TableCell>
                <TableCell>{row.propertyName}</TableCell>
                <TableCell>{row.initial_reading}</TableCell>
                <TableCell>{row.current_reading}</TableCell>
                <TableCell>{row.units_used}</TableCell>
                <TableCell>{formatCurrency(row.bill_amount)}</TableCell>
                <TableCell>
                  <Badge variant={row.paid_on ? "success" : "warning"}>
                    {row.paid_on ? "paid" : "pending"}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(row.paid_on)}</TableCell>
                <TableCell className="text-right">
                  {isAdmin && !row.paid_on ? (
                    <MarkElectricityPaidButton id={row.id} />
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
