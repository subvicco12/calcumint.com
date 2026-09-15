import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const migration = readFileSync("supabase/migrations/003_b5_business.sql", "utf8");

describe("B5 Business security contract", () => {
  it("enables RLS across Business-owned data", () => {
    for (const table of ["organizations", "organization_members", "organization_invitations", "business_projects", "client_workspaces", "shared_calculations", "organization_audit_log"]) {
      expect(migration).toContain(`alter table public.${table} enable row level security`);
    }
  });

  it("requires Business plan for workspace creation", () => {
    expect(migration).toContain("plan = 'business'");
    expect(migration).toContain("Business plan required");
  });

  it("enforces invitation identity and included seat limit", () => {
    expect(migration).toContain("Invitation email does not match signed-in account");
    expect(migration).toContain("member_count >= 5");
  });

  it("keeps ownership transfer out of generic member updates", () => {
    expect(migration).toContain("role <> 'owner' or public.org_role(organization_id) = 'owner'");
    expect(migration).toContain("members_admin_delete");
  });
});
