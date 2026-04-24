import { buildTenancyFinanceSummary, monthToDate, reconcileRentPayments } from "@/lib/rent";
import type { DashboardMetrics, RentPaymentRow, TenancyRecord } from "@/lib/types";
import { toNumber } from "@/lib/utils";

function mergePayments(tenancies: TenancyRecord[]) {
  return tenancies.flatMap((tenancy) =>
    reconcileRentPayments(
      tenancy.start_date,
      new Date(),
      tenancy.rent_payments,
      toNumber(tenancy.monthly_rent)
    ).map((payment) => ({
      ...payment,
      tenancy
    }))
  );
}

export function buildDashboardMetrics(tenancies: TenancyRecord[]): DashboardMetrics {
  const payments = mergePayments(tenancies);
  const electricitySummary = tenancies
    .flatMap((tenancy) => tenancy.electricity)
    .reduce((sum, entry) => sum + toNumber(entry.bill_amount), 0);
  const advanceRemaining = tenancies.reduce(
    (sum, tenancy) => sum + buildTenancyFinanceSummary(tenancy).advanceRemaining,
    0
  );
  const paidRentAmount = payments
    .filter((payment) => payment.status === "paid")
    .reduce((sum, payment) => sum + toNumber(payment.amount), 0);
  const pendingRentAmount = payments
    .filter((payment) => payment.status === "pending")
    .reduce((sum, payment) => sum + toNumber(payment.amount), 0);

  const trendMap = payments.reduce<Record<string, { paid: number; pending: number }>>(
    (accumulator, payment) => {
      accumulator[payment.month] ??= { paid: 0, pending: 0 };

      if (payment.status === "paid") {
        accumulator[payment.month].paid += toNumber(payment.amount);
      } else {
        accumulator[payment.month].pending += toNumber(payment.amount);
      }

      return accumulator;
    },
    {}
  );

  const rentTrend = Object.entries(trendMap)
    .sort(([left], [right]) => monthToDate(left).getTime() - monthToDate(right).getTime())
    .slice(-8)
    .map(([month, values]) => ({
      month,
      ...values
    }));

  return {
    totalRentCollected: paidRentAmount,
    pendingRentCount: payments.filter((payment) => payment.status === "pending").length,
    advanceRemaining,
    electricitySummary,
    paidRentAmount,
    pendingRentAmount,
    rentTrend,
    paidVsPending: [
      {
        name: "Paid",
        value: paidRentAmount
      },
      {
        name: "Pending",
        value: pendingRentAmount
      }
    ]
  };
}

export function getRecentPayments(tenancies: TenancyRecord[]) {
  return tenancies
    .flatMap((tenancy) =>
      tenancy.rent_payments.map((payment) => ({
        ...payment,
        tenantName: tenancy.user?.name ?? "Unknown tenant",
        propertyName: tenancy.property?.name ?? "Unknown property"
      }))
    )
    .sort((left, right) => {
      const leftDate = left.paid_on ? new Date(left.paid_on).getTime() : 0;
      const rightDate = right.paid_on ? new Date(right.paid_on).getTime() : 0;
      return rightDate - leftDate;
    })
    .slice(0, 6);
}

export function flattenRentLedger(tenancies: TenancyRecord[]) {
  return tenancies.flatMap((tenancy) => {
    const ledger = reconcileRentPayments(
      tenancy.start_date,
      new Date(),
      tenancy.rent_payments,
      toNumber(tenancy.monthly_rent)
    );

    return ledger.map((payment) => ({
      ...payment,
      tenancyId: tenancy.id,
      tenantName: tenancy.user?.name ?? "Unknown tenant",
      propertyName: tenancy.property?.name ?? "Unknown property",
      advanceRemaining: calculateRowAdvance(payment, ledger, tenancy.advance_paid)
    }));
  });
}

function calculateRowAdvance(
  row: Pick<RentPaymentRow, "month">,
  ledger: RentPaymentRow[],
  advancePaid: number
) {
  const upToMonth = ledger.filter((payment) => payment.month <= row.month && payment.status === "paid");
  return Math.max(
    toNumber(advancePaid) -
      upToMonth.reduce((sum, payment) => sum + toNumber(payment.amount), 0),
    0
  );
}
