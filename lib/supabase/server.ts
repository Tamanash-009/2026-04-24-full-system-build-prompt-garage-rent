import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient as createServiceClient } from "@supabase/supabase-js";

import {
  getServiceRoleKey,
  getSupabasePublishableKey,
  getSupabaseUrl,
  hasServiceRoleEnv,
  hasSupabaseEnv
} from "@/lib/env";

type CookieMutation = {
  name: string;
  value: string;
  options?: Record<string, unknown>;
};

export function createServerSupabaseClient() {
  if (!hasSupabaseEnv()) {
    return null;
  }

  const cookieStore = cookies();

  return createServerClient(getSupabaseUrl(), getSupabasePublishableKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: CookieMutation[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options as never);
          });
        } catch {
          // Server components can't always set cookies during rendering.
        }
      }
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
