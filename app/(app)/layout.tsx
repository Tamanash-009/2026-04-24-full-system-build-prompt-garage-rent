import { redirect } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { getAuthState } from "@/lib/data";

export default async function ProtectedLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const authState = await getAuthState();

  if (!authState.supabase || !authState.userId) {
    redirect("/sign-in");
  }

  if (!authState.profile) {
    redirect("/onboarding");
  }

  return <AppShell profile={authState.profile}>{children}</AppShell>;
}
