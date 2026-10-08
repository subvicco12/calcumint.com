import { describe, expect, it } from "vitest";
import { requiredQaChecks } from "./publishing";

describe("risk-aware reviewer QA applicability", () => {
  it.each(["standard", "financial", "health", "tax"] as const)("returns exact risk-specific check sets for %s", (riskClass) => {
    const withoutRulePack = requiredQaChecks(riskClass, false);
    const withRulePack = requiredQaChecks(riskClass, true);
    expect(new Set(withRulePack).size).toBe(withRulePack.length);
    expect(withRulePack).toEqual([...withoutRulePack.slice(0, -Number(riskClass !== "standard")), "rule-pack-validation", ...withoutRulePack.slice(withoutRulePack.length - Number(riskClass !== "standard"))]);
    expect(withoutRulePack.includes("ymyl-review")).toBe(riskClass !== "standard");
    expect(withoutRulePack.includes("rule-pack-validation")).toBe(false);
  });
});
