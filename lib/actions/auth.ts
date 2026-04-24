"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { z } from "zod";

import { getRoleRedirectPath, resolveRequestedRole } from "@/lib/auth-utils";
import { getAdminInviteCode, hasClerkEnv, hasSupabaseEnv } from "@/lib/env";
import { createAdminSupabaseClient, createServerSupabaseClient } from "@/lib/supabase/server";
import type { UserRow } from "@/lib/types";

const onboardingSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(6),
  role: z.enum(["admin", "tenant"]),
  inviteCode: z.string().optional()
});

export async function completeOnboardingAction(input: z.infer<typeof onboardingSchema>) {
  if (!hasClerkEnv()) {
    return { error: "Clerk credentials are not configured yet." };
  }

  if (!hasSupabaseEnv()) {
    return { error: "Supabase credentials are not configured yet." };
  }

  const values = onboardingSchema.parse(input);
  const { userId, redirectToSignIn } = await auth();
  const supabase = await createServerSupabaseClient();
  const adminSupabase = createAdminSupabaseClient();
  const database = adminSupabase ?? supabase;

  if (!userId) {
    return redirectToSignIn();
  }

  if (!database) {
    return { error: "Supabase credentials are not configured yet." };
  }

  const clerkUser = await currentUser();
  const email = (
    clerkUser?.primaryEmailAddress?.emailAddress ?? clerkUser?.emailAddresses[0]?.emailAddress ?? ""
  )
    .trim()
    .toLowerCase();

  if (!email) {
    return { error: "Your Clerk account does not have a usable email address yet." };
  }

  const { data: existingProfileByClerkId } = await database
    .from("users")
    .select("*")
    .eq("clerk_user_id", userId)
    .maybeSingle();
  let typedProfile = (existingProfileByClerkId as UserRow | null) ?? null;

  if (!typedProfile) {
    const { data: existingProfileByEmail } = await database
      .from("users")
      .select("*")
      .ilike("email", email)
      .maybeSingle();

    typedProfile = (existingProfileByEmail as UserRow | null) ?? null;

    if (typedProfile?.clerk_user_id && typedProfile.clerk_user_id !== userId) {
      return { error: "This email is already linked to another GarageFlow account." };
    }
  }

  const requestedRole = resolveRequestedRole(values.role, values.inviteCode, getAdminInviteCode());
  const role = typedProfile?.role ?? requestedRole;

  if (!typedProfile && values.role === "admin" && role !== "admin") {
    return { error: "A valid admin invite code is required to create an admin workspace." };
  }

  const profilePayload = {
    clerk_user_id: userId,
    email,
    name: values.name,
    phone: values.phone,
    role
  };

  const { error } = typedProfile
    ? await database.from("users").update(profilePayload).eq("id", typedProfile.id)
    : await database.from("users").insert({
        id: crypto.randomUUID(),
        ...profilePayload
      });

  if (error) {
    return { error: error.message };
  }

  redirect(getRoleRedirectPath(role));
}
