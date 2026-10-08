import { describe, expect, it } from "vitest";
import { requiredQaChecks } from "./publishing";

describe("reviewer QA coverage remains explicit across risk classes", () => {
  it.each(["standard", "financial", "health", "tax"] as const)("keeps all baseline evidence requirements for %s", (riskClass) => {
    const checks = requiredQaChecks(riskClass);
    for (const type of ["engine-tests", "formula-review", "sources", "methodology", "security", "entitlement-validation", "accessibility"] as const) {
      expect(checks).toContain(type);
    }
  });
  it("does not treat regulatory rule-pack checks as a substitute for specialist review", () => {
    for (const riskClass of ["financial", "health", "tax"] as const) {
      const checks = requiredQaChecks(riskClass, true);
      expect(checks).toContain("rule-pack-validation");
      expect(checks).toContain("ymyl-review");
    }
  });
});
