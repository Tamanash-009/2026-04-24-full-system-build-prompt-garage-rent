"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/client";
import { useAppStore } from "@/lib/store/app-store";

const watchedTables = ["rent_payments", "electricity", "tenancies", "properties"];

export function LiveSync() {
  const router = useRouter();
  const touchRealtimeSync = useAppStore((state) => state.touchRealtimeSync);

  useEffect(() => {
    if (!hasSupabaseEnv()) {
      return;
    }

    const supabase = createClient();
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
  }, [router, touchRealtimeSync]);

  return null;
}
