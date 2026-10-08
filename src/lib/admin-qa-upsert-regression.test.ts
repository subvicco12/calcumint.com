import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const actions = readFileSync("src/app/admin/actions.ts", "utf8");
const migration = readFileSync("supabase/migrations/032_atomic_reviewer_qa_audit.sql", "utf8");

describe("admin QA evidence persistence", () => {
  it("records QA evidence and audit event through one transactional RPC", () => {
    expect(actions).toContain('supabase.rpc("record_calculator_qa_decision"');
    expect(migration).toMatch(/insert into public\.calculator_qa_checks/);
    expect(migration).toMatch(/on conflict \(calculator_id, check_type\) do update/);
    expect(migration).toMatch(/insert into public\.calculator_review_events/);
    expect(migration).toMatch(/security invoker/);
  });

  it("does not use update-only persistence or separate non-atomic audit writes", () => {
    const qaAction = actions.split("export async function updateQaCheck")[1]?.split("export async function transitionCalculator")[0] ?? "";
    expect(qaAction).not.toContain('from("calculator_qa_checks").update(');
    expect(qaAction).not.toContain('from("calculator_review_events").insert(');
  });

  it("retains database reviewer and waiver authorization checks", () => {
    expect(migration).toContain("v_role not in ('owner','admin','reviewer')");
    expect(migration).toContain("p_status = 'waived' and v_role not in ('owner','admin')");
    expect(migration).toContain("QA check is not applicable to this calculator");
    expect(migration).toContain("grant execute on function public.record_calculator_qa_decision(uuid,text,text,text) to authenticated");
  });
});
