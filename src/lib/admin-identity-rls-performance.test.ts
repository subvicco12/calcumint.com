import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const admin = readFileSync("supabase/migrations/008_b10_admin_factory.sql", "utf8");
const evidence = readFileSync("supabase/migrations/023_structured_source_evidence.sql", "utf8");
const optimized = readFileSync("supabase/migrations/031_admin_identity_rls_auth_initplan.sql", "utf8");

const policies = [
  "admins_read_self",
  "catalog_editor_insert",
  "events_admin_insert",
  "jobs_admin_insert",
  "source_evidence_reviewer_insert",
  "source_evidence_reviewer_update",
];

describe("admin identity RLS auth initplan optimization", () => {
  it("alters only existing governed identity policies", () => {
    for (const policy of policies.slice(0, 4)) {
      expect(admin).toContain(`create policy "${policy}"`);
    }
    for (const policy of policies.slice(4)) {
      expect(evidence).toContain(`create policy "${policy}"`);
    }
    for (const policy of policies) {
      expect(optimized).toContain(`alter policy "${policy}"`);
    }
    expect(optimized).not.toContain("drop policy");
    expect(optimized).not.toContain("create policy");
  });

  it("preserves role/admin checks and optimizes only direct auth identity evaluation", () => {
    const executable = optimized.split("\n").filter((line) => !line.trimStart().startsWith("--")).join("\n");
    expect(executable.match(/\(select auth\.uid\(\)\)/g)?.length).toBe(6);
    expect(executable).not.toMatch(/(?<!select )auth\.uid\(\)/);
    expect(executable).toContain("has_platform_role(array['owner','admin','reviewer','editor'])");
    expect(executable).toContain("is_platform_admin()");
    expect(executable).toContain("has_platform_role(array['owner','admin'])");
    expect(executable.match(/has_platform_role\(array\['owner','admin','reviewer'\]\)/g)?.length).toBe(3);
    expect(executable).not.toContain("service_role");
  });
});
