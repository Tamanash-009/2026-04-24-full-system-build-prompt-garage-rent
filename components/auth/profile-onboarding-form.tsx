"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { completeOnboardingAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ProfileOnboardingForm({
  defaultName,
  defaultEmail,
  defaultPhone = "",
  defaultRole = "tenant"
}: {
  defaultName: string;
  defaultEmail: string;
  defaultPhone?: string;
  defaultRole?: "admin" | "tenant";
}) {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState(defaultName);
  const [phone, setPhone] = useState(defaultPhone);
  const [role, setRole] = useState<"admin" | "tenant">(defaultRole);
  const [inviteCode, setInviteCode] = useState("");

  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle className="text-3xl">Finish your workspace profile</CardTitle>
        <CardDescription>
          Google sign-in is ready. Add your role and phone once so GarageFlow can open the correct
          workspace and keep your records synced.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-5"
          onSubmit={(event) => {
            event.preventDefault();
            startTransition(async () => {
              const result = await completeOnboardingAction({
                name,
                phone,
                role,
                inviteCode
              });

              if (result?.error) {
                toast.error(result.error);
              }
            });
          }}
        >
          <div className="grid gap-2">
            <Label htmlFor="email">Google account</Label>
            <Input id="email" value={defaultEmail} readOnly disabled />
          </div>

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
              placeholder="Required only for admin setup"
              onChange={(event) => setInviteCode(event.target.value)}
            />
          </div>

          <Button type="submit" size="lg" disabled={isPending}>
            {isPending ? "Saving profile..." : "Continue to GarageFlow"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
