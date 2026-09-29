import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const billing = readFileSync("supabase/migrations/002_b4_billing.sql", "utf8");
const ai = readFileSync("supabase/migrations/007_b9_ai.sql", "utf8");
const optimized = readFileSync("supabase/migrations/030_billing_ai_rls_auth_initplan.sql", "utf8");

describe("billing and AI RLS auth initplan optimization", () => {
  it("alters exactly the existing simple ownership policies", () => {
    for (const policy of ["billing_customers_select_own", "subscriptions_select_own"]) {
      expect(billing).toContain(`create policy "${policy}"`);
      expect(optimized).toContain(`alter policy "${policy}"`);
    }
    expect(ai).toContain('create policy "ai_usage_user_read"');
    expect(optimized).toContain('alter policy "ai_usage_user_read"');
    expect(optimized).not.toContain("drop policy");
    expect(optimized).not.toContain("create policy");
  });

  it("preserves user ownership and introduces no broader authorization", () => {
    const executable = optimized.split("\n").filter((line) => !line.trimStart().startsWith("--")).join("\n");
    expect(executable.match(/\(select auth\.uid\(\)\)/g)?.length).toBe(3);
    expect(executable).not.toMatch(/(?<!select )auth\.uid\(\)/);
    expect(executable).not.toContain("service_role");
    expect(executable).not.toContain("true");
  });
});
