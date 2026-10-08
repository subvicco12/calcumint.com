import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { qaCheckTypes, requiredQaChecks } from "./admin/publishing";

const sql = readFileSync("supabase/migrations/035_atomic_catalog_creation.sql", "utf8");
const match = sql.match(/v_checks text\[\] := array\[([\s\S]*?)\];/);
const baseline = [...(match?.[1] ?? "").matchAll(/'([^']+)'/g)].map((item) => item[1]);

describe("atomic catalog creation QA parity", () => {
  it("initializes exactly the canonical baseline checks, in canonical order", () => {
    expect(match).not.toBeNull();
    expect(baseline).toEqual(requiredQaChecks("standard", false));
  });

  it("retains conditional rule-pack and specialist review evidence", () => {
    expect(sql).toContain("p_metadata ->> 'rulePackRequired' = 'true'");
    expect(sql).toContain("v_checks := array_append(v_checks, 'rule-pack-validation')");
    expect(sql).toContain("p_risk_class in ('financial','health','tax')");
    expect(sql).toContain("v_checks := array_append(v_checks, 'ymyl-review')");
    for (const risk of ["standard", "financial", "health", "tax"] as const) {
      for (const rulePack of [false, true]) {
        const actual = [...baseline, ...(rulePack ? ["rule-pack-validation"] : []), ...(risk !== "standard" ? ["ymyl-review"] : [])];
        expect(actual).toEqual(requiredQaChecks(risk, rulePack));
        expect(actual.every((check) => qaCheckTypes.includes(check as typeof qaCheckTypes[number]))).toBe(true);
      }
    }
  });
});
