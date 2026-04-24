import { auth } from "@clerk/nextjs/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

import {
  hasClerkEnv,
  getServiceRoleKey,
  getSupabasePublishableKey,
  getSupabaseUrl,
  hasServiceRoleEnv,
  hasSupabaseEnv
} from "@/lib/env";

export async function createServerSupabaseClient() {
  if (!hasSupabaseEnv()) {
    return null;
  }

  if (!hasClerkEnv()) {
    return createServiceClient(getSupabaseUrl(), getSupabasePublishableKey(), {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
  }

  const { getToken } = await auth();

  return createServiceClient(getSupabaseUrl(), getSupabasePublishableKey(), {
    accessToken: async () => (await getToken()) ?? null,
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

export function createAdminSupabaseClient() {
  if (!hasServiceRoleEnv()) {
    return null;
  }

  return createServiceClient(getSupabaseUrl(), getServiceRoleKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
