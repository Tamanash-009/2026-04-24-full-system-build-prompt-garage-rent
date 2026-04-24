"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/tenants", label: "Tenants" },
  { href: "/payments", label: "Payments" },
  { href: "/electricity", label: "Electricity" }
];

export function MobileNav({ role }: { role: "admin" | "tenant" }) {
  const scopedLinks = role === "admin" ? links : links.filter((link) => link.href !== "/dashboard");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open navigation</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[min(92vw,400px)]">
        <DialogHeader>
          <DialogTitle>Navigate GarageFlow</DialogTitle>
          <DialogDescription>Switch between admin and tenant workspaces quickly.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          {scopedLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-2xl border border-white/50 bg-white/75 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:border-cyan-200 hover:bg-cyan-50"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
