import { redirect } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { getAuthState } from "@/lib/data";

export default async function ProtectedLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const authState = await getAuthState();

  if (!authState.supabase || !authState.user || !authState.profile) {
    redirect("/sign-in");
  }

  return <AppShell profile={authState.profile}>{children}</AppShell>;
}
