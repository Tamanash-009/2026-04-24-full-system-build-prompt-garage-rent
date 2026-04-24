import { describe, expect, it } from "vitest";

import { getRoleRedirectPath, resolveRequestedRole } from "@/lib/auth-utils";

describe("auth utilities", () => {
  it("routes admins and tenants to the correct workspace", () => {
    expect(getRoleRedirectPath("admin")).toBe("/dashboard");
    expect(getRoleRedirectPath("tenant")).toBe("/tenants");
  });

  it("keeps admin access gated behind the invite code", () => {
    expect(resolveRequestedRole("admin", "secret", "secret")).toBe("admin");
    expect(resolveRequestedRole("admin", "wrong", "secret")).toBe("tenant");
    expect(resolveRequestedRole("tenant", "", "secret")).toBe("tenant");
  });
});
