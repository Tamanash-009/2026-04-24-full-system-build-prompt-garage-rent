"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { signUpAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function SignUpForm() {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "tenant">("tenant");
  const [inviteCode, setInviteCode] = useState("");

  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle className="text-3xl">Create your workspace account</CardTitle>
        <CardDescription>
          Tenant accounts can self-register. Admin registration also supports an optional invite code.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-5"
          onSubmit={(event) => {
            event.preventDefault();
            startTransition(async () => {
              const result = await signUpAction({
                name,
                phone,
                email,
                password,
                role,
                inviteCode
              });

              if (result?.error) {
                toast.error(result.error);
              }

              if (result?.success) {
                toast.success(result.success);
              }
            });
          }}
        >
          <div className="grid gap-2">
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              value={name}
              placeholder="Arjun Mehta"
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={phone}
                placeholder="+91 98765 43210"
                onChange={(event) => setPhone(event.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={(value) => setRole(value as "admin" | "tenant")}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Choose role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tenant">Tenant</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="inviteCode">Admin invite code</Label>
            <Input
              id="inviteCode"
              value={inviteCode}
              placeholder="Required only for admin sign-up"
              onChange={(event) => setInviteCode(event.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              placeholder="tenant@garageflow.app"
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
              placeholder="At least 6 characters"
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <Button type="submit" size="lg" disabled={isPending}>
            {isPending ? "Creating account..." : "Create account"}
          </Button>

          <p className="text-sm text-muted-foreground">
            Already signed up?{" "}
            <Link href="/sign-in" className="font-semibold text-cyan-800 hover:text-cyan-900">
              Sign in instead
            </Link>
            .
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
