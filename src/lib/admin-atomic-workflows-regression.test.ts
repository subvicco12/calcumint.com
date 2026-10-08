import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const actions = readFileSync("src/app/admin/actions.ts", "utf8");
const migrations = [
  ["032_atomic_reviewer_qa_audit.sql", "record_calculator_qa_decision", "uuid,text,text,text"],
  ["033_atomic_reviewer_assignment_audit.sql", "assign_calculator_reviewer", "uuid,uuid"],
  ["034_atomic_lifecycle_transition_audit.sql", "transition_calculator_with_audit", "uuid,text,text"],
  ["035_atomic_catalog_creation.sql", "create_catalog_calculator_with_audit", "text,text,text,text,text,jsonb"]
] as const;

describe("transactional admin workflow regression guards", () => {
  for (const [file, functionName, signature] of migrations) {
    it(`${functionName} uses invoker RLS and restricted execution privileges`, () => {
      const sql = readFileSync(`supabase/migrations/${file}`, "utf8");
      expect(sql).toContain(`function public.${functionName}(`);
      expect(sql).toMatch(/security invoker/);
      expect(sql).toContain(`revoke all on function public.${functionName}(${signature}) from public, anon`);
      expect(sql).toContain(`grant execute on function public.${functionName}(${signature}) to authenticated`);
      expect(sql).toContain("insert into public.calculator_review_events");
      expect(actions).toContain(`supabase.rpc("${functionName}"`);
    });
  }

  it("keeps QA decisions and audit events in the same database function", () => {
    const sql = readFileSync("supabase/migrations/032_atomic_reviewer_qa_audit.sql", "utf8");
    expect(sql).toContain("insert into public.calculator_qa_checks");
    expect(sql).toContain("on conflict (calculator_id, check_type) do update");
    expect(sql).toContain("p_status = 'waived' and v_role not in ('owner','admin')");
  });

  it("rejects stale lifecycle state at the database update", () => {
    const sql = readFileSync("supabase/migrations/034_atomic_lifecycle_transition_audit.sql", "utf8");
    expect(sql).toContain("where id = p_calculator_id and lifecycle = p_expected_lifecycle");
    expect(sql).toContain("raise exception 'Calculator lifecycle changed concurrently or was not found'");
  });

  it("creates catalog, QA evidence, and audit event within one function", () => {
    const sql = readFileSync("supabase/migrations/035_atomic_catalog_creation.sql", "utf8");
    expect(sql).toContain("insert into public.calculator_catalog_admin");
    expect(sql).toContain("insert into public.calculator_qa_checks");
    expect(sql).toContain("insert into public.calculator_review_events");
    expect(sql).toContain("v_checks := array_append(v_checks, 'ymyl-review')");
    expect(sql).toContain("v_checks := array_append(v_checks, 'rule-pack-validation')");
  });
});
