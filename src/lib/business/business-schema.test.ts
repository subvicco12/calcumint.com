import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(join(process.cwd(), "supabase/migrations/003_b5_business_workspaces.sql"), "utf8");

describe("B5 business tenancy schema", () => {
  it("defines the organization role hierarchy and core tenancy tables", () => {
    expect(migration).toContain("create type public.organization_role as enum ('owner','admin','manager','member','viewer')");
    expect(migration).toContain("create table public.organizations");
    expect(migration).toContain("create table public.organization_members");
    expect(migration).toContain("create table public.business_projects");
    expect(migration).toContain("create table public.client_workspaces");
    expect(migration).toContain("create table public.shared_calculations");
    expect(migration).toContain("create table public.shared_templates");
    expect(migration).toContain("create table public.organization_audit_events");
  });

  it("requires Business entitlement before organization creation", () => {
    expect(migration).toContain("plan = 'business'");
    expect(migration).toContain("raise exception 'Business plan required'");
  });

  it("enables RLS and scopes workspace reads through membership", () => {
    expect(migration).toContain("alter table public.organizations enable row level security");
    expect(migration).toContain("alter table public.organization_members enable row level security");
    expect(migration).toContain("public.has_organization_role(organization_id, 'viewer')");
    expect(migration).toContain("public.has_organization_role(organization_id, 'manager')");
  });

  it("protects ownership from invitation assignment", () => {
    expect(migration).toContain("role <> 'owner'");
    expect(migration).toContain("accept_business_invitation");
  });
});
