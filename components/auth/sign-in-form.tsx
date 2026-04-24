"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { signInAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignInForm() {
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle className="text-3xl">Welcome back</CardTitle>
        <CardDescription>
          Sign in with your Supabase-authenticated workspace to access the admin or tenant dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-5"
          onSubmit={(event) => {
            event.preventDefault();
            startTransition(async () => {
              const result = await signInAction({ email, password });
              if (result?.error) {
                toast.error(result.error);
              }
            });
          }}
        >
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              placeholder="admin@garageflow.app"
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              placeholder="Enter your password"
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <Button type="submit" size="lg" disabled={isPending}>
            {isPending ? "Signing in..." : "Sign in"}
          </Button>

          <p className="text-sm text-muted-foreground">
            Need an account?{" "}
            <Link href="/sign-up" className="font-semibold text-cyan-800 hover:text-cyan-900">
              Create one here
            </Link>
            .
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
