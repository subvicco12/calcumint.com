import { describe, expect, it } from "vitest";
import { publishingGate, requiredQaChecks, type PublishingRecord } from "./publishing";

const baseline: PublishingRecord = {
  riskClass: "standard", lifecycle: "review", engineTestsPassed: true,
  formulaReviewPassed: true, sourcesPassed: true, methodologyPassed: true,
  reverseSolvePassed: true, visualizationReconciliationPassed: true,
  scheduleReconciliationPassed: true, scenarioReconciliationPassed: true,
  sensitivityValidationPassed: true, entitlementValidationPassed: true,
  uxResponsivePassed: true, performancePassed: true, securityPassed: true,
  seoContentPassed: true, accessibilityPassed: true, ymylReviewPassed: false,
  reviewerId: null, sourceCount: 1
};

describe("regulatory rule-pack and specialist review are cumulative gates", () => {
  it.each(["financial", "health", "tax"] as const)("blocks %s until both rule-pack and specialist gates pass", (riskClass) => {
    expect(requiredQaChecks(riskClass, true)).toContain("rule-pack-validation");
    expect(requiredQaChecks(riskClass, true)).toContain("ymyl-review");
    const record = { ...baseline, riskClass, rulePackRequired: true, rulePackValidationPassed: false, reviewerId: "assigned", ymylReviewPassed: true };
    expect(publishingGate(record).failures).toContain("Applicable regulatory rule-pack validation must pass");
    expect(publishingGate({ ...record, rulePackValidationPassed: true }).ok).toBe(true);
    expect(publishingGate({ ...record, rulePackValidationPassed: true, ymylReviewPassed: false }).ok).toBe(false);
  });
  it("requires reviewed source evidence even when all other QA gates pass", () => {
    expect(publishingGate({ ...baseline, sourceCount: 0 }).failures).toContain("At least one reviewed source is required");
    expect(publishingGate({ ...baseline, sourcesPassed: false }).ok).toBe(false);
  });
});
