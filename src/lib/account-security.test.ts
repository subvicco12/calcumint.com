import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(join(process.cwd(), "supabase/migrations/001_b3_accounts.sql"), "utf8");

describe("B3 account security migration", () => {
  it("enables RLS on every user-owned table", () => {
    for (const table of ["profiles", "user_preferences", "favorites", "calculation_history"]) {
      expect(migration).toContain(`alter table public.${table} enable row level security;`);
    }
  });

  it("keeps plan entitlement server controlled", () => {
    expect(migration).toContain("revoke update on public.profiles from authenticated;");
    expect(migration).toContain("grant update(display_name) on public.profiles to authenticated;");
  });

  it("scopes user data policies to auth.uid()", () => {
    expect(migration).toContain("auth.uid() = user_id");
    expect(migration).toContain("auth.uid() = id");
  });
});
