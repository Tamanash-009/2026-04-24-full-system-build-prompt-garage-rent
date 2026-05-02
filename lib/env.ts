export function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
}

export function getSupabasePublishableKey() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    ""
  );
}

export function getServiceRoleKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
}

export function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

export function hasSupabaseEnv() {
  return Boolean(getSupabaseUrl() && getSupabasePublishableKey());
}

export function hasServiceRoleEnv() {
  return Boolean(hasSupabaseEnv() && getServiceRoleKey());
}

export function hasCronSecret() {
  return Boolean(process.env.CRON_SECRET);
}

export function getAdminInviteCode() {
  return process.env.ADMIN_INVITE_CODE ?? "";
}

export function getClerkPublishableKey() {
  return process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
}

export function getClerkSecretKey() {
  return process.env.CLERK_SECRET_KEY ?? "";
}

export function hasClerkEnv() {
  return Boolean(getClerkPublishableKey() && getClerkSecretKey());
}

export function shouldExposeTechnicalSetupDetails() {
  return process.env.NODE_ENV !== "production";
}
