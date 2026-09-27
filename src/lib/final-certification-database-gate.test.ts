import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { qaCheckTypes } from "./admin/publishing";

const migration = readFileSync("supabase/migrations/016_final_certification_evidence_gate.sql", "utf8");
const rulePackMigration = readFileSync("supabase/migrations/017_regulatory_rule_pack_evidence.sql", "utf8");
const rulePackHardeningMigration = readFileSync("supabase/migrations/018_harden_rule_pack_required_metadata.sql", "utf8");
const lifecycleEnforcementMigration = readFileSync("supabase/migrations/019_authoritative_lifecycle_enforcement.sql", "utf8");

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

  it("ships safe rulePackRequired parsing as a forward migration", () => {
    expect(rulePackHardeningMigration).not.toContain("rulePackRequired')::boolean");
    const safeRulePackCheck = "lower(trim(coalesce";
    expect(rulePackHardeningMigration.split(safeRulePackCheck)).toHaveLength(3);
    expect(rulePackHardeningMigration.split("rulePackRequired").length - 1).toBeGreaterThanOrEqual(2);
    expect(rulePackHardeningMigration).toContain("create or replace function public.validate_calculator_publish_gate");
    expect(rulePackHardeningMigration).toContain("insert into public.calculator_qa_checks (calculator_id, check_type)");
  });

  it("enforces the application lifecycle graph at the database boundary", () => {
    const allowedTransitions = [
      "old.lifecycle = 'draft' and new.lifecycle in ('review','archived')",
      "old.lifecycle = 'review' and new.lifecycle in ('draft','certified','archived')",
      "old.lifecycle = 'certified' and new.lifecycle in ('review','published','archived')",
      "old.lifecycle = 'published' and new.lifecycle in ('review','archived')",
      "old.lifecycle = 'archived' and new.lifecycle = 'draft'"
    ];
    for (const transition of allowedTransitions) expect(lifecycleEnforcementMigration).toContain(transition);
    expect(lifecycleEnforcementMigration).toContain("Invalid lifecycle transition");
  });

  it("enforces lifecycle role permissions without blocking the service worker", () => {
    expect(lifecycleEnforcementMigration).toContain("auth.role() <> 'service_role'");
    expect(lifecycleEnforcementMigration).toContain("v_role = 'editor' and new.lifecycle not in ('draft','review')");
    expect(lifecycleEnforcementMigration).toContain("v_role = 'reviewer' and new.lifecycle = 'published'");
    expect(lifecycleEnforcementMigration).toContain("from public.validate_calculator_publish_gate(new.id)");
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
