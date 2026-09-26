import { describe, expect, it } from "vitest";
import { canTransition, publishingGate, requiredQaChecks, roleCanTransition } from "./publishing";

const ready = {
  riskClass: "standard" as const,
  lifecycle: "review" as const,
  engineTestsPassed: true,
  formulaReviewPassed: true,
  sourcesPassed: true,
  methodologyPassed: true,
  reverseSolvePassed: true,
  visualizationReconciliationPassed: true,
  scheduleReconciliationPassed: true,
  scenarioReconciliationPassed: true,
  sensitivityValidationPassed: true,
  entitlementValidationPassed: true,
  uxResponsivePassed: true,
  performancePassed: true,
  securityPassed: true,
  seoContentPassed: true,
  accessibilityPassed: true,
  ymylReviewPassed: false,
  reviewerId: null,
  sourceCount: 1
};

describe("B10 publishing policy", () => {
  it("allows a standard calculator through when all general gates pass", () => {
    expect(publishingGate(ready)).toEqual({ ok: true, failures: [] });
  });

  it("blocks certification when final-framework evidence is missing", () => {
    const result = publishingGate({ ...ready, reverseSolvePassed: false, securityPassed: false });
    expect(result.ok).toBe(false);
    expect(result.failures).toContain("Reverse-solve verification must pass or be marked not applicable");
    expect(result.failures).toContain("Security and server-side entitlement validation must pass");
    expect(requiredQaChecks("standard")).toContain("sensitivity-validation");
    expect(requiredQaChecks("standard")).toContain("performance");
  });

  it("requires rule-pack evidence only when regulatory rules are applicable", () => {
    expect(requiredQaChecks("standard")).not.toContain("rule-pack-validation");
    expect(requiredQaChecks("standard", true)).toContain("rule-pack-validation");
    expect(publishingGate({ ...ready, rulePackRequired: true, rulePackValidationPassed: false }).failures)
      .toContain("Applicable regulatory rule-pack validation must pass");
    expect(publishingGate({ ...ready, rulePackRequired: true, rulePackValidationPassed: true })).toEqual({ ok: true, failures: [] });
  });

  it("adds specialist review and reviewer assignment for YMYL calculators", () => {
    const result = publishingGate({ ...ready, riskClass: "health" });
    expect(result.ok).toBe(false);
    expect(result.failures).toContain("YMYL specialist review must pass");
    expect(result.failures).toContain("YMYL calculators require an assigned reviewer");
    expect(requiredQaChecks("tax")).toContain("ymyl-review");
  });

  it("prevents lifecycle skipping", () => {
    expect(canTransition("draft", "published")).toBe(false);
    expect(canTransition("review", "certified")).toBe(true);
    expect(canTransition("certified", "published")).toBe(true);
  });

  it("prevents editors and reviewers from publishing", () => {
    expect(roleCanTransition("editor", "published")).toBe(false);
    expect(roleCanTransition("reviewer", "published")).toBe(false);
    expect(roleCanTransition("admin", "published")).toBe(true);
  });
});
