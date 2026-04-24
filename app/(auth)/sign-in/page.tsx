import Link from "next/link";

import { SignInForm } from "@/components/auth/sign-in-form";
import { Badge } from "@/components/ui/badge";

export default function SignInPage() {
  return (
    <main className="section-shell flex min-h-screen items-center py-10">
      <div className="grid w-full gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-5">
          <Badge variant="outline" className="hero-badge">
            Admin and tenant access
          </Badge>
          <h1 className="text-4xl md:text-5xl">Jump back into your garage rent workflow.</h1>
          <p className="max-w-xl text-lg text-slate-600">
            Review dashboards, close pending months, and keep your tenant ledger aligned across
            every device with the same authenticated workspace.
          </p>
          <Link href="/" className="text-sm font-semibold text-cyan-800 hover:text-cyan-900">
            Back to product overview
          </Link>
        </div>
        <div className="flex justify-center lg:justify-end">
          <SignInForm />
        </div>
      </div>
    </main>
  );
}
