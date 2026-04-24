import Link from "next/link";

import { SignUpForm } from "@/components/auth/sign-up-form";
import { Badge } from "@/components/ui/badge";

export default function SignUpPage() {
  return (
    <main className="section-shell flex min-h-screen items-center py-10">
      <div className="grid w-full gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-5">
          <Badge variant="outline" className="hero-badge">
            Installable mobile-first experience
          </Badge>
          <h1 className="text-4xl md:text-5xl">Create a secure GarageFlow account.</h1>
          <p className="max-w-xl text-lg text-slate-600">
            Tenants can view dues and payment history, while admins can manage collections,
            electricity, exports, and monthly automation from one live system.
          </p>
          <Link href="/" className="text-sm font-semibold text-cyan-800 hover:text-cyan-900">
            Back to product overview
          </Link>
        </div>
        <div className="flex justify-center lg:justify-end">
          <SignUpForm />
        </div>
      </div>
    </main>
  );
}
