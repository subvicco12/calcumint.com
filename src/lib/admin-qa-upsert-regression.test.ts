import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const actions = readFileSync("src/app/admin/actions.ts", "utf8");

describe("admin QA evidence persistence", () => {
  it("upserts QA evidence so missing rows cannot silently remain absent", () => {
    expect(actions).toMatch(/from\("calculator_qa_checks"\)\.upsert\(\{ calculator_id: calculatorId, check_type: checkType,/);
    expect(actions).toContain('{ onConflict: "calculator_id,check_type" }');
  });

  it("does not use update-only persistence for an individual QA check", () => {
    expect(actions).not.toMatch(/from\("calculator_qa_checks"\)\.update\(\{ status, details, checked_by/);
  });
});
