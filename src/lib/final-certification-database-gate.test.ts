import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { qaCheckTypes } from "./admin/publishing";

const migration = readFileSync("supabase/migrations/016_final_certification_evidence_gate.sql", "utf8");
const rulePackMigration = readFileSync("supabase/migrations/017_regulatory_rule_pack_evidence.sql", "utf8");

describe("Final Master database certification gate", () => {
  it("keeps the database QA vocabulary aligned with the application gate", () => {
    for (const checkType of qaCheckTypes) {
      const authoritativeMigration = checkType === "rule-pack-validation" ? rulePackMigration : migration;
      expect(authoritativeMigration).toContain(`'${checkType}'`);
    }
  });

  it("seeds new evidence checks for existing catalog records", () => {
    expect(migration).toContain("insert into public.calculator_qa_checks (calculator_id, check_type)");
    expect(migration).toContain("from public.calculator_catalog_admin c");
    expect(migration).toContain("on conflict (calculator_id, check_type) do nothing");
  });

  it("requires every non-YMYL Final Master evidence check in the authoritative RPC", () => {
    for (const checkType of qaCheckTypes.filter((type) => type !== "ymyl-review" && type !== "rule-pack-validation")) {
      expect(migration).toContain(`'${checkType}'`);
    }
    expect(rulePackMigration).toContain("'rule-pack-validation'");
    expect(migration).toMatch(/coalesce\(v_status, 'pending'\) not in \('passed','waived'\)/i);
  });

  it("requires regulatory rule-pack evidence only when catalog metadata declares applicability", () => {
    expect(rulePackMigration).toContain("'rule-pack-validation'");
    expect(rulePackMigration).toMatch(/metadata ->> 'rulePackRequired'/);
    expect(rulePackMigration).toMatch(/v_required := array_append\(v_required, 'rule-pack-validation'\)/);
    expect(rulePackMigration).toMatch(/on conflict \(calculator_id, check_type\) do nothing/i);
  });

  it("preserves specialist review and reviewer assignment for YMYL calculators", () => {
    expect(migration).toMatch(/risk_class in \('financial','health','tax'\)/i);
    expect(migration).toContain("v_required := array_append(v_required, 'ymyl-review')");
    expect(migration).toContain("YMYL reviewer is required");
  });

  it("preserves database-side authorization for gate evaluation", () => {
    expect(migration).toMatch(/auth\.role\(\) <> 'service_role' and not public\.is_platform_admin\(\)/i);
    expect(migration).toMatch(/revoke execute on function public\.validate_calculator_publish_gate\(uuid\) from public, anon/i);
  });
});
