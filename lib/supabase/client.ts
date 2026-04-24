"use client";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import { getSupabasePublishableKey, getSupabaseUrl, hasSupabaseEnv } from "@/lib/env";

let browserClient: ReturnType<typeof createSupabaseClient> | null = null;
let accessTokenGetter: (() => Promise<string | null>) | null = null;

export function createClient(getAccessToken?: () => Promise<string | null>) {
  if (!hasSupabaseEnv()) {
    throw new Error("Supabase environment variables are missing.");
  }

  if (getAccessToken) {
    accessTokenGetter = getAccessToken;
  }

  if (!browserClient) {
    browserClient = createSupabaseClient(getSupabaseUrl(), getSupabasePublishableKey(), {
      accessToken: async () => (accessTokenGetter ? await accessTokenGetter() : null)
    });
  }

  return browserClient;
}
