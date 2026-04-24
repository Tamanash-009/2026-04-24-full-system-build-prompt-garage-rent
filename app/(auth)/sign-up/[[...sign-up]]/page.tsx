import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { AuthConfigCard } from "@/components/auth/auth-config-card";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { GoogleAuthCard } from "@/components/auth/google-auth-card";
import { hasClerkEnv } from "@/lib/env";

export default async function SignUpPage() {
  if (!hasClerkEnv()) {
    return (
      <AuthPageShell
        badge="Simple Google onboarding"
        title="Create a secure GarageFlow account."
        description="Use Google to sign up, then finish a short workspace profile so tenants and admins land in the right place immediately."
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
      badge="Simple Google onboarding"
      title="Create a secure GarageFlow account."
      description="Use Google to sign up, then finish a short workspace profile so tenants and admins land in the right place immediately."
    >
      <GoogleAuthCard mode="sign-up" />
    </AuthPageShell>
  );
}
