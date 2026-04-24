"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/client";
import { useAppStore } from "@/lib/store/app-store";

const watchedTables = ["rent_payments", "electricity", "tenancies", "properties"];

export function LiveSync() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const touchRealtimeSync = useAppStore((state) => state.touchRealtimeSync);

  useEffect(() => {
    if (!hasSupabaseEnv() || !isLoaded || !isSignedIn) {
      return;
    }

    const supabase = createClient(() => getToken());
    const channel = supabase.channel("garageflow-live");

    watchedTables.forEach((table) => {
      channel.on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table
        },
        () => {
          touchRealtimeSync();
          router.refresh();
        }
      );
    });

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [getToken, isLoaded, isSignedIn, router, touchRealtimeSync]);

  return null;
}
