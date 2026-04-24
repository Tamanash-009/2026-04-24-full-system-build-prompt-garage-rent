import { cache } from "react";

import { buildDashboardMetrics, flattenRentLedger, getRecentPayments } from "@/lib/analytics";
import { buildTenancyFinanceSummary } from "@/lib/rent";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { PropertyRow, TenancyRecord, TenancyRow, UserRow } from "@/lib/types";

interface AuthState {
  configured: boolean;
  supabase: any;
  user: any;
  profile: UserRow | null;
}

export const getAuthState = cache(async () => {
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return {
      configured: false,
      supabase: null,
      user: null,
      profile: null
    };
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      configured: true,
      supabase,
      user: null,
      profile: null
    };
  }

  const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).maybeSingle();

  return {
    configured: true,
    supabase,
    user,
    profile: (profile as UserRow | null) ?? null
  };
}) as () => Promise<AuthState>;

export const getReferenceData = cache(async () => {
  const authState = await getAuthState();

  if (!authState.supabase || authState.profile?.role !== "admin") {
    return {
      tenants: [] as UserRow[],
      properties: [] as PropertyRow[]
    };
  }

  const [{ data: tenants }, { data: properties }] = await Promise.all([
    authState.supabase.from("users").select("*").eq("role", "tenant").order("name"),
    authState.supabase.from("properties").select("*").order("name")
  ]);

  return {
    tenants: (tenants as UserRow[] | null) ?? [],
    properties: (properties as PropertyRow[] | null) ?? []
  };
});

export const getTenancies = cache(async () => {
  const authState = await getAuthState();

  if (!authState.supabase || !authState.profile) {
    return [] as TenancyRecord[];
  }

  const tenancyQuery =
    authState.profile.role === "admin"
      ? authState.supabase.from("tenancies").select("*").order("start_date", { ascending: false })
      : authState.supabase
          .from("tenancies")
          .select("*")
          .eq("user_id", authState.profile.id)
          .order("start_date", { ascending: false });

  const { data: tenancies } = await tenancyQuery;
  const tenancyRows = (tenancies ?? []) as TenancyRow[];

  if (tenancyRows.length === 0) {
    return [] as TenancyRecord[];
  }

  const tenancyIds = tenancyRows.map((tenancy) => tenancy.id);
  const propertyIds = [...new Set(tenancyRows.map((tenancy) => tenancy.property_id))];
  const userIds = [...new Set(tenancyRows.map((tenancy) => tenancy.user_id))];

  const [{ data: payments }, { data: electricity }, { data: properties }, { data: users }] =
    await Promise.all([
      authState.supabase
        .from("rent_payments")
        .select("*")
        .in("tenancy_id", tenancyIds)
        .order("month", { ascending: false }),
      authState.supabase.from("electricity").select("*").in("tenancy_id", tenancyIds),
      authState.supabase.from("properties").select("*").in("id", propertyIds),
      authState.supabase.from("users").select("*").in("id", userIds)
    ]);

  const paymentMap = new Map<string, TenancyRecord["rent_payments"]>();
  const electricityMap = new Map<string, TenancyRecord["electricity"]>();
  const propertyRows = (properties as PropertyRow[] | null) ?? [];
  const userRows = (users as UserRow[] | null) ?? [];
  const paymentRows = payments as TenancyRecord["rent_payments"] | null;
  const electricityRows = electricity as TenancyRecord["electricity"] | null;
  const propertyMap = new Map(propertyRows.map((property) => [property.id, property]));
  const userMap = new Map(userRows.map((user) => [user.id, user]));

  for (const payment of paymentRows ?? []) {
    const bucket = paymentMap.get(payment.tenancy_id) ?? [];
    bucket.push(payment);
    paymentMap.set(payment.tenancy_id, bucket);
  }

  for (const entry of electricityRows ?? []) {
    const bucket = electricityMap.get(entry.tenancy_id) ?? [];
    bucket.push(entry);
    electricityMap.set(entry.tenancy_id, bucket);
  }

  return tenancyRows.map((tenancy) => ({
    ...tenancy,
    property: propertyMap.get(tenancy.property_id) ?? null,
    user: userMap.get(tenancy.user_id) ?? null,
    rent_payments: paymentMap.get(tenancy.id) ?? [],
    electricity: electricityMap.get(tenancy.id) ?? []
  }));
});

export const getDashboardData = cache(async () => {
  const authState = await getAuthState();
  const tenancies = await getTenancies();
  const metrics = buildDashboardMetrics(tenancies);

  return {
    ...authState,
    tenancies,
    metrics,
    recentPayments: getRecentPayments(tenancies),
    rentLedger: flattenRentLedger(tenancies),
    financeByTenancy: tenancies.map((tenancy) => ({
      tenancy,
      summary: buildTenancyFinanceSummary(tenancy)
    }))
  };
});
