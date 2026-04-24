import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { AuthConfigCard } from "@/components/auth/auth-config-card";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { GoogleAuthCard } from "@/components/auth/google-auth-card";
import { hasClerkEnv } from "@/lib/env";

export default async function SignInPage() {
  if (!hasClerkEnv()) {
    return (
      <AuthPageShell
        badge="Google sign-in with Clerk"
        title="Jump back into your garage rent workflow."
        description="Sign in with Google to review dashboards, close pending months, and keep your tenant ledger aligned across every device."
      >
        <AuthConfigCard />
      </AuthPageShell>
    );
  }

  const { userId } = await auth();

  if (userId) {
    redirect("/auth-complete");
  }

  return (
    <AuthPageShell
      badge="Google sign-in with Clerk"
      title="Jump back into your garage rent workflow."
      description="Sign in with Google to review dashboards, close pending months, and keep your tenant ledger aligned across every device."
    >
      <GoogleAuthCard mode="sign-in" />
    </AuthPageShell>
  );
}
