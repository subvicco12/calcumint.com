import { describe, expect, it } from "vitest";
import { requiredQaChecks } from "./publishing";

describe("risk-aware reviewer QA applicability", () => {
  it.each(["standard", "financial", "health", "tax"] as const)("returns exact risk-specific check sets for %s", (riskClass) => {
    const withoutRulePack = requiredQaChecks(riskClass, false);
    const withRulePack = requiredQaChecks(riskClass, true);
    expect(new Set(withRulePack).size).toBe(withRulePack.length);
    const baseChecks = withoutRulePack.filter((check) => check !== "ymyl-review");
    expect(withRulePack).toEqual([...baseChecks, "rule-pack-validation", ...(riskClass === "standard" ? [] : ["ymyl-review"])]);
    expect(withoutRulePack.includes("ymyl-review")).toBe(riskClass !== "standard");
    expect(withoutRulePack.includes("rule-pack-validation")).toBe(false);
  });
});
