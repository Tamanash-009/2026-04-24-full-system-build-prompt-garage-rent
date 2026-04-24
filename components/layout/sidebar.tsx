"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { BarChart3, Building2, ReceiptText, Users, Zap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const adminNavItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: BarChart3
  },
  {
    href: "/tenants",
    label: "Tenants",
    icon: Users
  },
  {
    href: "/payments",
    label: "Payments",
    icon: ReceiptText
  },
  {
    href: "/electricity",
    label: "Electricity",
    icon: Zap
  }
];

export function Sidebar({ role }: { role: "admin" | "tenant" }) {
  const pathname = usePathname();
  const navItems = role === "admin" ? adminNavItems : adminNavItems.filter((item) => item.href !== "/dashboard");

  return (
    <aside className="glass-panel sticky top-6 hidden h-[calc(100vh-3rem)] w-72 flex-col rounded-[2rem] p-5 lg:flex">
      <div className="flex items-center gap-3 px-2 py-3">
        <Image src="/logo-mark.svg" alt="GarageFlow" width={48} height={48} className="rounded-2xl" />
        <div>
          <p className="font-display text-lg font-semibold">GarageFlow</p>
          <p className="text-sm text-muted-foreground">Rent operations</p>
        </div>
      </div>

      <div className="mt-6 rounded-[1.5rem] border border-white/50 bg-white/55 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Workspace role</p>
            <Badge variant={role === "admin" ? "default" : "outline"} className="mt-1 w-fit">
              {role}
            </Badge>
          </div>
        </div>
      </div>

      <nav className="mt-8 grid gap-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                active
                  ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                  : "text-slate-700 hover:bg-white/70 hover:text-slate-950"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-[1.5rem] bg-slate-950 px-4 py-5 text-sm text-slate-200">
        <p className="font-semibold text-white">Installable Android web app</p>
        <p className="mt-1 text-slate-300">
          Open this dashboard in Chrome and add it to the home screen for the smoothest mobile flow.
        </p>
      </div>
    </aside>
  );
}
