import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { ProfileOnboardingForm } from "@/components/auth/profile-onboarding-form";
import { getRoleRedirectPath } from "@/lib/auth-utils";
import { getAuthState } from "@/lib/data";
import { hasClerkEnv } from "@/lib/env";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import type { UserRow } from "@/lib/types";

export default async function OnboardingPage() {
  if (!hasClerkEnv()) {
    redirect("/");
  }

  const [authState, clerkUser] = await Promise.all([getAuthState(), currentUser()]);

  if (!authState.userId || !clerkUser) {
    redirect("/sign-in");
  }

  if (authState.profile) {
    redirect(getRoleRedirectPath(authState.profile.role));
  }

  const email = clerkUser.primaryEmailAddress?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress ?? "";
  const normalizedEmail = email.trim().toLowerCase();
  const adminSupabase = createAdminSupabaseClient();
  const existingProfile =
    normalizedEmail && adminSupabase
      ? (
          (
            await adminSupabase
              .from("users")
              .select("*")
              .ilike("email", normalizedEmail)
              .maybeSingle()
          ).data as UserRow | null
        ) ?? null
      : null;
  const defaultName = existingProfile?.name || clerkUser.fullName || clerkUser.firstName || "";
  const defaultPhone = existingProfile?.phone ?? "";
  const defaultRole = existingProfile?.role ?? "tenant";

  return (
    <AuthPageShell
      badge="One-time workspace setup"
      title="Finish your GarageFlow access."
      description="We already verified your Google account. Add the last profile details so rent history, tenant access, and admin controls open correctly."
    >
      <ProfileOnboardingForm
        defaultName={defaultName}
        defaultEmail={normalizedEmail}
        defaultPhone={defaultPhone}
        defaultRole={defaultRole}
      />
    </AuthPageShell>
  );
}
