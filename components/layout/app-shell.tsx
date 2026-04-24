"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/topbar";
import { LiveSync } from "@/components/realtime/live-sync";
import { InstallBanner } from "@/components/shared/install-banner";
import type { UserRow } from "@/lib/types";

const routeTitles: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": {
    title: "Revenue Command Center",
    subtitle: "Watch rent collections, pending dues, and electricity totals from one screen."
  },
  "/tenants": {
    title: "Tenant Workspace",
    subtitle: "Manage tenancies or inspect your own rent and electricity history."
  },
  "/payments": {
    title: "Rent Payment Ledger",
    subtitle: "Mark rent as paid, audit pending months, and export clean breakdowns."
  },
  "/electricity": {
    title: "Electricity Tracker",
    subtitle: "Capture readings, calculate units consumed, and close utility dues."
  }
};

export function AppShell({
  children,
  profile
}: {
  children: ReactNode;
  profile: UserRow;
}) {
  const pathname = usePathname();
  const header = Object.entries(routeTitles).find(([route]) => pathname.startsWith(route))?.[1] ??
    routeTitles["/dashboard"];

  return (
    <div className="section-shell flex min-h-screen gap-6 py-6">
      <Sidebar role={profile.role} />
      <div className="min-w-0 flex-1 space-y-6">
        <TopBar title={header.title} subtitle={header.subtitle} profileName={profile.name} role={profile.role} />
        <InstallBanner />
        <div className="space-y-6">{children}</div>
      </div>
      <LiveSync />
    </div>
  );
}
