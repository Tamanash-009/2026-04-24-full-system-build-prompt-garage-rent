"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { getAdminInviteCode, hasSupabaseEnv } from "@/lib/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { UserRow } from "@/lib/types";

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

const signUpSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(6),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["admin", "tenant"]),
  inviteCode: z.string().optional()
});

export async function signInAction(input: z.infer<typeof signInSchema>) {
  if (!hasSupabaseEnv()) {
    return { error: "Supabase credentials are not configured yet." };
  }

  const values = signInSchema.parse(input);
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return { error: "Supabase credentials are not configured yet." };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: values.email,
    password: values.password
  });

  if (error) {
    return { error: error.message };
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "The session was not created. Please try again." };
  }

  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).maybeSingle();
  const typedProfile = (profile as Pick<UserRow, "role"> | null) ?? null;

  redirect(typedProfile?.role === "admin" ? "/dashboard" : "/tenants");
}

export async function signUpAction(input: z.infer<typeof signUpSchema>) {
  if (!hasSupabaseEnv()) {
    return { error: "Supabase credentials are not configured yet." };
  }

  const values = signUpSchema.parse(input);
  const adminInviteCode = getAdminInviteCode();
  const requestedRole =
    values.role === "admin" && adminInviteCode && values.inviteCode === adminInviteCode
      ? "admin"
      : "tenant";
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return { error: "Supabase credentials are not configured yet." };
  }

  const { data, error } = await supabase.auth.signUp({
    email: values.email,
    password: values.password,
    options: {
      data: {
        name: values.name,
        phone: values.phone,
        role: requestedRole
      }
    }
  });

  if (error) {
    return { error: error.message };
  }

  if (!data.session) {
    return {
      success: "Account created. Check your email confirmation settings and sign in once the account is active."
    };
  }

  redirect(requestedRole === "admin" ? "/dashboard" : "/tenants");
}

export async function signOutAction() {
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    redirect("/");
  }

  await supabase.auth.signOut();
  redirect("/");
}
