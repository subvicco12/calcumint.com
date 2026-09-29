import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const business = readFileSync("supabase/migrations/003_b5_business.sql", "utf8");
const builder = readFileSync("supabase/migrations/004_b6_builder.sql", "utf8");
const delivery = readFileSync("supabase/migrations/005_b7_delivery.sql", "utf8");
const automation = readFileSync("supabase/migrations/006_b8_api_automation.sql", "utf8");
const optimized = readFileSync("supabase/migrations/032_business_builder_rls_auth_initplan.sql", "utf8");

const policies = [
  "invites_admin_insert",
  "projects_manager_insert",
  "clients_manager_insert",
  "shared_editor_insert",
  "custom_calculators_insert_builders",
  "custom_versions_insert_builders",
  "embed_configs_admin_write",
  "share_links_builder_write",
  "api_keys_admin_insert",
  "webhook_admin_insert",
];

describe("Business and builder RLS auth initplan optimization", () => {
  it("alters only existing policies", () => {
    const origins = [business, builder, delivery, automation].join("\n");
    for (const policy of policies) {
      expect(origins).toContain(`create policy "${policy}"`);
      expect(optimized).toContain(`alter policy "${policy}"`);
    }
    expect(optimized).not.toContain("drop policy");
    expect(optimized).not.toContain("create policy");
  });

  it("optimizes only direct auth identity evaluation and preserves organization-role checks", () => {
    const executable = optimized.split("\n").filter((line) => !line.trimStart().startsWith("--")).join("\n");
    expect(executable.match(/\(select auth\.uid\(\)\)/g)?.length).toBe(10);
    expect(executable).not.toMatch(/(?<!select )auth\.uid\(\)/);
    expect(executable).toContain("has_org_role(organization_id, array['owner','admin'])");
    expect(executable).toContain("has_org_role(organization_id, array['owner','admin','manager'])");
    expect(executable).toContain("has_org_role(organization_id, array['owner','admin','manager','member'])");
    expect(executable).toContain("has_org_role(c.organization_id, array['owner','admin','manager'])");
    expect(executable).not.toContain("service_role");
  });

  it("keeps the two ALL policies' USING predicates as well as their WITH CHECK predicates", () => {
    for (const policy of ["embed_configs_admin_write", "share_links_builder_write"]) {
      const start = optimized.indexOf(`alter policy "${policy}"`);
      expect(start).toBeGreaterThanOrEqual(0);
      const next = optimized.indexOf("alter policy", start + 1);
      const statement = optimized.slice(start, next === -1 ? undefined : next);
      expect(statement).toContain("using (public.has_org_role");
      expect(statement).toContain("with check (public.has_org_role");
    }
  });
});
