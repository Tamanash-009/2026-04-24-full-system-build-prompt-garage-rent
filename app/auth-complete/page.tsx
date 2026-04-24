import { redirect } from "next/navigation";

import { getAuthState } from "@/lib/data";
import { getRoleRedirectPath } from "@/lib/auth-utils";
import { hasClerkEnv } from "@/lib/env";

export default async function AuthCompletePage() {
  if (!hasClerkEnv()) {
    redirect("/");
  }

  const authState = await getAuthState();

  if (!authState.userId) {
    redirect("/sign-in");
  }

  if (!authState.profile) {
    redirect("/onboarding");
  }

  redirect(getRoleRedirectPath(authState.profile.role));
}
