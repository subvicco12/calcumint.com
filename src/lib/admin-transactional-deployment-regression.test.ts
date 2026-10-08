import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const actions = readFileSync("src/app/admin/actions.ts", "utf8");
const workflows = [
  ["032_atomic_reviewer_qa_audit.sql", "record_calculator_qa_decision"],
  ["033_atomic_reviewer_assignment_audit.sql", "assign_calculator_reviewer"],
  ["034_atomic_lifecycle_transition_audit.sql", "transition_calculator_with_audit"],
  ["035_atomic_catalog_creation.sql", "create_catalog_calculator_with_audit"]
] as const;

describe("admin transactional RPC deployment dependencies", () => {
  it("requires every RPC referenced by admin actions to have a checked-in migration", () => {
    for (const [file, name] of workflows) {
      expect(actions).toContain(`supabase.rpc("${name}"`);
      const sql = readFileSync(`supabase/migrations/${file}`, "utf8");
      expect(sql).toContain(`create or replace function public.${name}(`);
      expect(sql).toMatch(/security invoker/);
      expect(sql).toContain("revoke all on function");
      expect(sql).toContain("grant execute on function");
    }
  });

  it("does not fall back to direct writes for transactional admin operations", () => {
    const sections = [
      ["createCatalogCalculator", "addCalculatorSourceEvidence"],
      ["updateQaCheck", "transitionCalculator"],
      ["transitionCalculator", "assignReviewer"],
      ["assignReviewer", "importCalculatorInventory"]
    ] as const;
    for (const [start, end] of sections) {
      const section = actions.split(`export async function ${start}`)[1]?.split(`export async function ${end}`)[0] ?? "";
      expect(section).toContain("supabase.rpc(");
      expect(section).not.toContain('from("calculator_review_events").insert(');
      expect(section).not.toContain('from("calculator_catalog_admin").update(');
      expect(section).not.toContain('from("calculator_catalog_admin").insert(');
      expect(section).not.toContain('from("calculator_qa_checks").insert(');
    }
  });
});
