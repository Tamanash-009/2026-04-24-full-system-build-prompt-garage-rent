import type { UserRole } from "@/lib/types";

export function getRoleRedirectPath(role: UserRole | null | undefined) {
  return role === "admin" ? "/dashboard" : "/tenants";
}

export function resolveRequestedRole(
  requestedRole: UserRole,
  inviteCode: string | undefined,
  adminInviteCode: string
) {
  if (requestedRole !== "admin") {
    return "tenant" as const;
  }

  if (!adminInviteCode) {
    return "tenant" as const;
  }

  return inviteCode?.trim() === adminInviteCode ? "admin" : "tenant";
}
