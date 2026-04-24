import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AuthConfigCard() {
  return (
    <Card className="w-full max-w-xl rounded-[2rem] border border-amber-200 bg-amber-50/90 shadow-xl shadow-amber-950/5">
      <CardHeader className="space-y-3">
        <CardTitle className="font-display text-3xl font-semibold text-slate-950">
          Clerk setup is still required
        </CardTitle>
        <CardDescription className="text-base text-slate-700">
          Google sign-in is wired into the app, but the Clerk publishable key and secret key have
          not been added to this environment yet.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 text-sm text-slate-700">
        <p>Add the Clerk keys and Google social connection settings, then reload this page.</p>
        <p>
          The exact variable names are listed in{" "}
          <Link href="/" className="font-semibold text-cyan-800 hover:text-cyan-900">
            the GarageFlow setup banner
          </Link>
          .
        </p>
      </CardContent>
    </Card>
  );
}
