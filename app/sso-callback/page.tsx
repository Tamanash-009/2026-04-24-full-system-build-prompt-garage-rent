import { redirect } from "next/navigation";

import { SsoCallbackHandler } from "@/components/auth/sso-callback-handler";
import { hasClerkEnv } from "@/lib/env";

export default function SsoCallbackPage() {
  if (!hasClerkEnv()) {
    redirect("/sign-in");
  }

  return <SsoCallbackHandler />;
}
