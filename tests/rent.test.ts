import { describe, expect, it } from "vitest";

import {
  buildTenancyFinanceSummary,
  calculateAdvanceRemaining,
  calculateElectricityUnits,
  calculatePendingAmount,
  generateMonths,
  reconcileRentPayments
} from "@/lib/rent";
import type { TenancyRecord } from "@/lib/types";

describe("rent logic", () => {
  it("generates monthly keys from the tenancy start month to the current month", () => {
    expect(generateMonths("2025-11-12", new Date("2026-02-18"))).toEqual([
      "2025-11",
      "2025-12",
      "2026-01",
      "2026-02"
    ]);
  });

  it("marks missing months as pending while preserving paid entries", () => {
    const ledger = reconcileRentPayments(
      "2026-01-01",
      new Date("2026-03-28"),
      [
        {
          id: "payment-1",
          tenancy_id: "tenancy-1",
          month: "2026-01",
          amount: 10000,
          status: "paid",
          paid_on: "2026-01-04T10:00:00.000Z"
        }
      ],
      10000
    );

    expect(ledger).toHaveLength(3);
    expect(ledger[1]).toMatchObject({
      month: "2026-02",
      status: "pending",
      amount: 10000
    });
    expect(ledger[2]).toMatchObject({
      month: "2026-03",
      status: "pending",
      amount: 10000
    });
  });

  it("updates advance and pending balances from paid rent totals", () => {
    const payments = [
      { amount: 12000, status: "paid" as const },
      { amount: 12000, status: "paid" as const },
      { amount: 12000, status: "pending" as const }
    ];

    const advanceRemaining = calculateAdvanceRemaining(30000, payments);
    const pendingAmount = calculatePendingAmount(payments, advanceRemaining);

    expect(advanceRemaining).toBe(6000);
    expect(pendingAmount).toBe(6000);
  });

  it("computes electricity units and full tenancy summary together", () => {
    const tenancy: TenancyRecord = {
      id: "tenancy-1",
      user_id: "user-1",
      property_id: "property-1",
      start_date: "2026-01-01",
      advance_paid: 15000,
      monthly_rent: 10000,
      status: "active",
      user: {
        id: "user-1",
        name: "Arjun Mehta",
        phone: "9999999999",
        role: "tenant",
        created_at: "2026-01-01T00:00:00.000Z"
      },
      property: {
        id: "property-1",
        name: "North Gate Garage",
        location: "Bengaluru",
        owner_id: "admin-1"
      },
      rent_payments: [
        {
          id: "rent-1",
          tenancy_id: "tenancy-1",
          month: "2026-01",
          amount: 10000,
          status: "paid",
          paid_on: "2026-01-05T00:00:00.000Z"
        }
      ],
      electricity: [
        {
          id: "elec-1",
          tenancy_id: "tenancy-1",
          initial_reading: 120,
          current_reading: 165,
          units_used: 45,
          bill_amount: 2250,
          paid_on: null
        }
      ]
    };

    expect(calculateElectricityUnits(120, 165)).toBe(45);

    const summary = buildTenancyFinanceSummary(tenancy);
    expect(summary.advanceRemaining).toBe(5000);
    expect(summary.electricityDue).toBe(2250);
  });
});
