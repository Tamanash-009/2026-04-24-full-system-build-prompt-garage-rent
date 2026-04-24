import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, BadgeIndianRupee, Building2, ShieldCheck, Zap } from "lucide-react";

import { ConfigBanner } from "@/components/shared/config-banner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { hasSupabaseEnv } from "@/lib/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { UserRow } from "@/lib/types";

const features = [
  {
    title: "Monthly rent automation",
    description: "Generate pending months automatically from the tenancy start date and keep ledgers current.",
    icon: BadgeIndianRupee
  },
  {
    title: "Live payment visibility",
    description: "Supabase realtime keeps the admin dashboard and tenant panel aligned without manual refreshes.",
    icon: ShieldCheck
  },
  {
    title: "Electricity billing",
    description: "Record readings, calculate unit usage, and track paid vs unpaid utility bills in the same workflow.",
    icon: Zap
  }
];

export default async function HomePage() {
  const supabase = createServerSupabaseClient();

  if (supabase) {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single<UserRow>();

      if (profile?.role === "admin") {
        redirect("/dashboard");
      }

      redirect("/tenants");
    }
  }

  return (
    <main className="relative overflow-hidden">
      <div className="absolute inset-0 noise-mask opacity-30" />
      <section className="section-shell relative py-10 md:py-16">
        <div className="glass-panel flex items-center justify-between rounded-[2rem] px-5 py-4">
          <div className="flex items-center gap-3">
            <Image src="/logo-mark.svg" alt="GarageFlow" width={44} height={44} className="rounded-2xl" />
            <div>
              <p className="font-display text-lg font-semibold">GarageFlow</p>
              <p className="text-sm text-muted-foreground">Garage rent management system</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm">
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/sign-up">Create account</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="section-shell relative grid gap-8 pb-20 pt-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div className="space-y-8">
          <div className="space-y-5">
            <Badge className="hero-badge" variant="outline">
              Live rent, advance, and electricity control
            </Badge>
            <h1 className="max-w-3xl text-4xl leading-tight md:text-6xl">
              Modern garage rent operations with a clean admin cockpit and a tenant-ready ledger.
            </h1>
            <p className="max-w-2xl text-lg text-slate-600">
              Track pending rent, adjust advance balances, export polished ledgers, and install the
              dashboard like an Android app without breaking the flow for your team.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/sign-up">
                Launch the system
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/sign-in">Use existing account</Link>
            </Button>
          </div>

          <ConfigBanner ready={hasSupabaseEnv()} />
        </div>

        <Card className="relative overflow-hidden">
          <div className="absolute -right-10 top-8 h-36 w-36 rounded-full bg-cyan-200/40 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-36 w-36 rounded-full bg-amber-200/50 blur-3xl" />
          <CardHeader className="relative">
            <Badge variant="default" className="w-fit">
              Built for production
            </Badge>
            <CardTitle className="mt-4 text-2xl">What the platform covers</CardTitle>
          </CardHeader>
          <CardContent className="relative grid gap-4">
            {features.map(({ title, description, icon: Icon }) => (
              <div key={title} className="rounded-[1.4rem] border border-white/50 bg-white/65 p-4">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100">
                  <Icon className="h-5 w-5 text-slate-900" />
                </div>
                <h2 className="text-lg font-semibold">{title}</h2>
                <p className="mt-1 text-sm text-slate-600">{description}</p>
              </div>
            ))}
            <div className="rounded-[1.4rem] border border-cyan-200/70 bg-cyan-50/80 p-4">
              <div className="mb-2 flex items-center gap-2 text-cyan-900">
                <Building2 className="h-4 w-4" />
                <span className="text-sm font-semibold">Installable PWA</span>
              </div>
              <p className="text-sm text-cyan-950/85">
                The experience is optimized for mobile use, so tenants and admins can pin it to the
                home screen and work without the feel of a clunky dashboard.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
