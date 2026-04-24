"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export function SsoCallbackHandler() {
  return <AuthenticateWithRedirectCallback signInUrl="/sign-in" signUpUrl="/sign-up" />;
}
