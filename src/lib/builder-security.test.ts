import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const sql = readFileSync("supabase/migrations/004_b6_builder.sql", "utf8");

describe("B6 builder security contract", () => {
  it("enables RLS for every custom builder table", () => {
    expect(sql).toContain("alter table public.custom_calculators enable row level security");
    expect(sql).toContain("alter table public.custom_calculator_versions enable row level security");
    expect(sql).toContain("alter table public.custom_calculator_runs enable row level security");
  });

  it("requires Business workspace roles for builder mutations", () => {
    expect(sql).toContain("array['owner','admin','manager']");
    expect(sql).toContain("Builder permission required");
  });

  it("uses versioned immutable definitions and explicit publication", () => {
    expect(sql).toContain("unique (calculator_id, version)");
    expect(sql).toContain("published_version");
    expect(sql).toContain("publish_custom_calculator");
  });
});
