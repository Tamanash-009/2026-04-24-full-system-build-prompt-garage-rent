"use client";

import { formatDistanceToNowStrict } from "date-fns";
import { BellRing, LogOut, UserCircle2 } from "lucide-react";

import { MobileNav } from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store/app-store";
import { signOutAction } from "@/lib/actions/auth";

export function TopBar({
  title,
  subtitle,
  profileName,
  role
}: {
  title: string;
  subtitle: string;
  profileName: string;
  role: "admin" | "tenant";
}) {
  const lastRealtimeSyncAt = useAppStore((state) => state.lastRealtimeSyncAt);

  return (
    <header className="glass-panel flex flex-col gap-4 rounded-[2rem] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <MobileNav role={role} />
        <div>
          <p className="font-display text-2xl font-semibold">{title}</p>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="rounded-2xl border border-white/50 bg-white/70 px-4 py-2 text-sm text-slate-700">
          <div className="flex items-center gap-2">
            <BellRing className="h-4 w-4 text-cyan-700" />
            Live sync
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {lastRealtimeSyncAt
              ? `Updated ${formatDistanceToNowStrict(new Date(lastRealtimeSyncAt), { addSuffix: true })}`
              : "Waiting for the first realtime event"}
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-white/50 bg-white/70 px-4 py-2">
          <UserCircle2 className="h-9 w-9 text-slate-600" />
          <div>
            <p className="text-sm font-semibold text-slate-900">{profileName}</p>
            <p className="text-xs text-slate-500">Authenticated workspace</p>
          </div>
        </div>

        <form action={signOutAction}>
          <Button variant="secondary" size="sm">
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </form>
      </div>
    </header>
  );
}
