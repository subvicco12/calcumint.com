import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const original = readFileSync("supabase/migrations/001_b3_accounts.sql", "utf8");
const optimized = readFileSync("supabase/migrations/029_account_rls_auth_initplan.sql", "utf8");

const policies = [
  "profiles_select_own", "profiles_update_own",
  "preferences_select_own", "preferences_insert_own", "preferences_update_own",
  "favorites_select_own", "favorites_insert_own", "favorites_delete_own",
  "history_select_own", "history_insert_own", "history_delete_own"
];

describe("account RLS auth initplan optimization", () => {
  it("alters every B3 ownership policy instead of replacing or broadening it", () => {
    for (const policy of policies) {
      expect(original).toContain(`create policy "${policy}"`);
      expect(optimized).toContain(`alter policy "${policy}"`);
    }
    expect(optimized).not.toContain("drop policy");
    expect(optimized).not.toContain("create policy");
  });

  it("keeps ownership bound to auth.uid while using scalar subqueries", () => {
    const executable = optimized.split("\n").filter((line) => !line.trimStart().startsWith("--")).join("\n");
    expect(executable).not.toMatch(/(?<!select )auth\.uid\(\)/);
    expect(executable.match(/\(select auth\.uid\(\)\)/g)?.length).toBe(13);
    expect(optimized).not.toContain("true");
    expect(optimized).not.toContain("service_role");
  });
});
