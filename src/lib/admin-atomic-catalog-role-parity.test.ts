import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("atomic catalog creation authorization", () => {
  it("requires a QA-writing role before attempting the atomic insert", () => {
    const sql = readFileSync("supabase/migrations/035_atomic_catalog_creation.sql", "utf8");
    expect(sql).toContain("v_role not in ('owner','admin','reviewer')");
    expect(sql).not.toContain("v_role not in ('owner','admin','reviewer','editor')");
    expect(sql).toContain("insert into public.calculator_qa_checks");
  });
});
