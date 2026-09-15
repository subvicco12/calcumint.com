import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const migration = readFileSync("supabase/migrations/007_b9_ai.sql", "utf8");

describe("B9 AI database security", () => {
  it("enables RLS and derives quotas from authenticated plan", () => {
    expect(migration).toMatch(/alter table public\.ai_usage_events enable row level security/i);
    expect(migration).toMatch(/select plan into v_plan from public\.profiles where id = v_user/i);
    expect(migration).toMatch(/when 'business' then 1000 when 'pro' then 200 else 10/i);
  });

  it("does not grant anonymous execution of quota functions", () => {
    expect(migration).toMatch(/revoke all on function public\.consume_ai_quota\(text\) from public/i);
    expect(migration).toMatch(/grant execute on function public\.consume_ai_quota\(text\) to authenticated/i);
  });

  it("keeps builder AI Business-only at the database boundary", () => {
    expect(migration).toMatch(/p_feature = 'builder' and v_plan <> 'business'/i);
  });
});
