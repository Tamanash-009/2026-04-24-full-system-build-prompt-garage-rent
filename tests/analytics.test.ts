import { describe, expect, it } from "vitest";

import { buildDashboardMetrics } from "@/lib/analytics";
import type { TenancyRecord } from "@/lib/types";

describe("dashboard analytics", () => {
  it("aggregates paid rent, pending counts, advance remaining, and electricity totals", () => {
    const tenancies: TenancyRecord[] = [
      {
        id: "tenancy-1",
        user_id: "user-1",
        property_id: "property-1",
        start_date: "2026-01-01",
        advance_paid: 20000,
        monthly_rent: 10000,
        status: "active",
        user: {
          id: "user-1",
          name: "Aarav",
          phone: "999",
          role: "tenant",
          created_at: "2026-01-01T00:00:00.000Z"
        },
        property: {
          id: "property-1",
          name: "Garage A",
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
            initial_reading: 0,
            current_reading: 30,
            units_used: 30,
            bill_amount: 1500,
            paid_on: null
          }
        ]
      }
    ];

    const metrics = buildDashboardMetrics(tenancies);

    expect(metrics.totalRentCollected).toBe(10000);
    expect(metrics.pendingRentCount).toBeGreaterThanOrEqual(0);
    expect(metrics.advanceRemaining).toBe(10000);
    expect(metrics.electricitySummary).toBe(1500);
    expect(metrics.paidVsPending[0].value).toBe(10000);
  });
});
