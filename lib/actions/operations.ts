"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { calculateElectricityUnits } from "@/lib/rent";
import { syncRentForTenancy } from "@/lib/sync";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { TenancyRow, UserRow } from "@/lib/types";

const propertySchema = z.object({
  name: z.string().min(2),
  location: z.string().min(2)
});

const tenancySchema = z.object({
  userId: z.string().uuid(),
  propertyId: z.string().uuid(),
  startDate: z.string().min(10),
  advancePaid: z.coerce.number().min(0),
  monthlyRent: z.coerce.number().min(1),
  status: z.string().min(2)
});

const markRentPaidSchema = z.object({
  tenancyId: z.string().uuid(),
  month: z.string().regex(/^\d{4}-\d{2}$/),
  amount: z.coerce.number().min(1)
});

const electricitySchema = z.object({
  tenancyId: z.string().uuid(),
  initialReading: z.coerce.number().min(0),
  currentReading: z.coerce.number().min(0),
  billAmount: z.coerce.number().min(0)
});

const electricityPaymentSchema = z.object({
  id: z.string().uuid()
});

async function requireAdminContext() {
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    throw new Error("Supabase credentials are not configured.");
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You need to sign in first.");
  }

  const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).maybeSingle();
  const typedProfile = (profile as UserRow | null) ?? null;

  if (!typedProfile || typedProfile.role !== "admin") {
    throw new Error("Only admins can perform this action.");
  }

  return { supabase, profile: typedProfile };
}

export async function createPropertyAction(input: z.infer<typeof propertySchema>) {
  const values = propertySchema.parse(input);
  const { supabase, profile } = await requireAdminContext();

  const { error } = await supabase.from("properties").insert({
    name: values.name,
    location: values.location,
    owner_id: profile.id
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/tenants");
  return { success: "Property created successfully." };
}

export async function createTenancyAction(input: z.infer<typeof tenancySchema>) {
  const values = tenancySchema.parse(input);
  const { supabase } = await requireAdminContext();

  const { data, error } = await supabase
    .from("tenancies")
    .insert({
      user_id: values.userId,
      property_id: values.propertyId,
      start_date: values.startDate,
      advance_paid: values.advancePaid,
      monthly_rent: values.monthlyRent,
      status: values.status
    })
    .select("id, start_date, monthly_rent")
    .single();

  const typedTenancy = (data as Pick<TenancyRow, "id" | "start_date" | "monthly_rent"> | null) ?? null;

  if (error || !typedTenancy) {
    return { error: error?.message ?? "Failed to create tenancy." };
  }

  await syncRentForTenancy(supabase, typedTenancy);
  revalidatePath("/dashboard");
  revalidatePath("/tenants");
  revalidatePath("/payments");
  return { success: "Tenancy created and rent months generated." };
}

export async function markRentPaidAction(input: z.infer<typeof markRentPaidSchema>) {
  const values = markRentPaidSchema.parse(input);
  const { supabase } = await requireAdminContext();

  const { error } = await supabase.from("rent_payments").upsert(
    {
      tenancy_id: values.tenancyId,
      month: values.month,
      amount: values.amount,
      status: "paid",
      paid_on: new Date().toISOString()
    },
    {
      onConflict: "tenancy_id,month"
    }
  );

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/payments");
  revalidatePath("/tenants");
  return { success: `Marked ${values.month} as paid.` };
}

export async function createElectricityBillAction(input: z.infer<typeof electricitySchema>) {
  const values = electricitySchema.parse(input);
  const { supabase } = await requireAdminContext();
  const unitsUsed = calculateElectricityUnits(values.initialReading, values.currentReading);

  const { error } = await supabase.from("electricity").insert({
    tenancy_id: values.tenancyId,
    initial_reading: values.initialReading,
    current_reading: values.currentReading,
    units_used: unitsUsed,
    bill_amount: values.billAmount,
    paid_on: null
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/electricity");
  revalidatePath("/tenants");
  return { success: "Electricity bill recorded." };
}

export async function markElectricityPaidAction(input: z.infer<typeof electricityPaymentSchema>) {
  const values = electricityPaymentSchema.parse(input);
  const { supabase } = await requireAdminContext();

  const { error } = await supabase
    .from("electricity")
    .update({ paid_on: new Date().toISOString() })
    .eq("id", values.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/electricity");
  revalidatePath("/tenants");
  return { success: "Electricity payment recorded." };
}
