"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSignIn } from "@clerk/nextjs";

function GoogleMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 48 48" className="h-5 w-5">
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303C33.655 32.657 29.211 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.96 3.04l5.657-5.657C34.046 6.053 29.28 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.651-.389-3.917Z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.96 3.04l5.657-5.657C34.046 6.053 29.28 4 24 4c-7.682 0-14.347 4.337-17.694 10.691Z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.178 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.149 35.091 26.693 36 24 36c-5.19 0-9.627-3.331-11.289-7.957l-6.522 5.025C9.5 39.556 16.227 44 24 44Z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303c-.79 2.237-2.232 4.166-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.651-.389-3.917Z"
      />
    </svg>
  );
}

function getErrorMessage(error: unknown) {
  if (typeof error === "object" && error !== null && "errors" in error) {
    const firstError = (error as { errors?: Array<{ longMessage?: string; message?: string }> }).errors?.[0];

    if (firstError?.longMessage || firstError?.message) {
      return firstError.longMessage ?? firstError.message ?? "Google sign-in failed.";
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Google sign-in failed. Please try again.";
}

export function GoogleAuthCard({
  mode
}: {
  mode: "sign-in" | "sign-up";
}) {
  const { signIn } = useSignIn();
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isSignIn = mode === "sign-in";

  const handleGoogleContinue = async () => {
    if (!signIn || isPending) {
      return;
    }

    try {
      setIsPending(true);
      setErrorMessage(null);

      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/auth-complete"
      });
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      setIsPending(false);
    }
  };

  return (
    <Card className="w-full max-w-xl rounded-[2rem] border border-white/60 bg-white/80 shadow-2xl shadow-slate-950/10 backdrop-blur-2xl">
      <CardHeader className="space-y-3">
        <CardTitle className="font-display text-3xl font-semibold text-slate-950">
          {isSignIn ? "Continue with Google" : "Create your account with Google"}
        </CardTitle>
        <CardDescription className="text-base text-slate-600">
          {isSignIn
            ? "Use your Google account to open the right dashboard instantly and keep your live rent data synced."
            : "Google handles secure sign-in first. After that, GarageFlow asks for your phone number and role once."}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Button
          type="button"
          size="lg"
          variant="secondary"
          className="h-12 justify-center rounded-2xl border border-slate-200 bg-white text-slate-900 hover:border-cyan-200 hover:bg-cyan-50"
          onClick={handleGoogleContinue}
          disabled={!signIn || isPending}
        >
          <GoogleMark />
          {isPending ? "Redirecting to Google..." : isSignIn ? "Sign in with Google" : "Sign up with Google"}
        </Button>

        <p className="text-sm text-slate-500">
          {isSignIn
            ? "New Google users will finish a short onboarding step before entering the app."
            : "Admin accounts still require the admin invite code during onboarding."}
        </p>

        {errorMessage ? (
          <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {errorMessage}
          </p>
        ) : null}

        <p className="text-sm text-slate-500">
          {isSignIn ? "Need an account?" : "Already have an account?"}{" "}
          <Link
            href={isSignIn ? "/sign-up" : "/sign-in"}
            className="font-semibold text-cyan-800 hover:text-cyan-900"
          >
            {isSignIn ? "Start with Google sign-up" : "Go to Google sign-in"}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
