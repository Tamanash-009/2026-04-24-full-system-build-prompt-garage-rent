import Link from "next/link";

import { Badge } from "@/components/ui/badge";

export function AuthPageShell({
  badge,
  title,
  description,
  children
}: {
  badge: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <main className="section-shell flex min-h-screen items-center py-10">
      <div className="grid w-full gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-5">
          <Badge variant="outline" className="hero-badge">
            {badge}
          </Badge>
          <h1 className="text-4xl md:text-5xl">{title}</h1>
          <p className="max-w-xl text-lg text-slate-600">{description}</p>
          <Link href="/" className="text-sm font-semibold text-cyan-800 hover:text-cyan-900">
            Back to product overview
          </Link>
        </div>
        <div className="flex justify-center lg:justify-end">{children}</div>
      </div>
    </main>
  );
}
