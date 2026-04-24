import { addMonths, format, parse, startOfMonth } from "date-fns";

import type { RentPaymentRow, TenancyRecord } from "@/lib/types";
import { toNumber } from "@/lib/utils";

export function generateMonths(startDate: string, currentDate = new Date()) {
  const start = startOfMonth(new Date(startDate));
  const end = startOfMonth(currentDate);
  const months: string[] = [];

  let pointer = start;
  while (pointer <= end) {
    months.push(format(pointer, "yyyy-MM"));
    pointer = addMonths(pointer, 1);
  }

  return months;
}

export function reconcileRentPayments(
  startDate: string,
  currentDate: Date,
  payments: RentPaymentRow[],
  monthlyRent: number
) {
  const paymentMap = new Map(payments.map((payment) => [payment.month, payment]));

  return generateMonths(startDate, currentDate).map((month) => {
    const existing = paymentMap.get(month);

    if (existing) {
      return {
        ...existing,
        amount: toNumber(existing.amount || monthlyRent)
      };
    }

    return {
      id: `pending-${month}`,
      tenancy_id: "",
      month,
      amount: monthlyRent,
      status: "pending" as const,
      paid_on: null
    };
  });
}

export function calculateAdvanceRemaining(
  advancePaid: number,
  payments: Array<Pick<RentPaymentRow, "amount" | "status">>
) {
  const paidAmount = payments
    .filter((payment) => payment.status === "paid")
    .reduce((sum, payment) => sum + toNumber(payment.amount), 0);

  return Math.max(toNumber(advancePaid) - paidAmount, 0);
}

export function calculatePendingAmount(
  payments: Array<Pick<RentPaymentRow, "amount" | "status">>,
  advanceRemaining = 0
) {
  const pending = payments
    .filter((payment) => payment.status === "pending")
    .reduce((sum, payment) => sum + toNumber(payment.amount), 0);

  return Math.max(pending - advanceRemaining, 0);
}

export function calculateElectricityUnits(initialReading: number, currentReading: number) {
  return Math.max(toNumber(currentReading) - toNumber(initialReading), 0);
}

export function monthToDate(month: string) {
  return parse(`${month}-01`, "yyyy-MM-dd", new Date());
}

export function buildTenancyFinanceSummary(tenancy: TenancyRecord) {
  const ledger = reconcileRentPayments(
    tenancy.start_date,
    new Date(),
    tenancy.rent_payments,
    toNumber(tenancy.monthly_rent)
  );

  const advanceRemaining = calculateAdvanceRemaining(tenancy.advance_paid, ledger);
  const pendingAmount = calculatePendingAmount(ledger, advanceRemaining);
  const electricityDue = tenancy.electricity
    .filter((entry) => !entry.paid_on)
    .reduce((sum, entry) => sum + toNumber(entry.bill_amount), 0);

  return {
    ledger,
    advanceRemaining,
    pendingAmount,
    electricityDue,
    totalPaid: ledger
      .filter((entry) => entry.status === "paid")
      .reduce((sum, entry) => sum + toNumber(entry.amount), 0)
  };
}
