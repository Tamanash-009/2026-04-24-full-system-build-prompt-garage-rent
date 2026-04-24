import { generateMonths } from "@/lib/rent";
import type { TenancyRow } from "@/lib/types";

type SupabaseDbClient = any;

export async function syncRentForTenancy(
  supabase: SupabaseDbClient,
  tenancy: Pick<TenancyRow, "id" | "start_date" | "monthly_rent">
) {
  const { data: existingPayments, error: existingError } = await supabase
    .from("rent_payments")
    .select("month")
    .eq("tenancy_id", tenancy.id);

  if (existingError) {
    throw new Error(existingError.message);
  }

  const existingMonths = new Set(
    (existingPayments as Array<{ month: string }> | null)?.map((payment) => payment.month) ?? []
  );
  const missingPayments = generateMonths(tenancy.start_date)
    .filter((month) => !existingMonths.has(month))
    .map((month) => ({
      tenancy_id: tenancy.id,
      month,
      amount: tenancy.monthly_rent,
      status: "pending" as const,
      paid_on: null
    }));

  if (missingPayments.length === 0) {
    return 0;
  }

  const { error: insertError } = await supabase.from("rent_payments").insert(missingPayments);

  if (insertError) {
    throw new Error(insertError.message);
  }

  return missingPayments.length;
}

export async function syncAllRentPayments(supabase: SupabaseDbClient) {
  const { data: tenancies, error } = await supabase
    .from("tenancies")
    .select("id, start_date, monthly_rent")
    .neq("status", "inactive");

  if (error) {
    throw new Error(error.message);
  }

  let created = 0;
  for (const tenancy of tenancies ?? []) {
    created += await syncRentForTenancy(supabase, tenancy);
  }

  return created;
}
