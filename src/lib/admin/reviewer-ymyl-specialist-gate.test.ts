import { describe, expect, it } from "vitest";
import { requiredQaChecks, publishingGate, type PublishingRecord } from "./publishing";

const passingRecord = (): PublishingRecord => ({
  riskClass: "standard", lifecycle: "review", engineTestsPassed: true,
  formulaReviewPassed: true, sourcesPassed: true, methodologyPassed: true,
  reverseSolvePassed: true, visualizationReconciliationPassed: true,
  scheduleReconciliationPassed: true, scenarioReconciliationPassed: true,
  sensitivityValidationPassed: true, entitlementValidationPassed: true,
  uxResponsivePassed: true, performancePassed: true, securityPassed: true,
  seoContentPassed: true, accessibilityPassed: true, ymylReviewPassed: false,
  reviewerId: null, sourceCount: 1
});

describe("specialist review is a separate YMYL publication prerequisite", () => {
  it.each(["financial", "health", "tax"] as const)("requires reviewer assignment and specialist approval for %s", (riskClass) => {
    expect(requiredQaChecks(riskClass)).toContain("ymyl-review");
    const record = { ...passingRecord(), riskClass };
    const blocked = publishingGate(record);
    expect(blocked.ok).toBe(false);
    expect(blocked.failures).toContain("YMYL specialist review must pass");
    expect(blocked.failures).toContain("YMYL calculators require an assigned reviewer");
    expect(publishingGate({ ...record, reviewerId: "assigned" }).ok).toBe(false);
    expect(publishingGate({ ...record, ymylReviewPassed: true }).ok).toBe(false);
    expect(publishingGate({ ...record, reviewerId: "assigned", ymylReviewPassed: true }).ok).toBe(true);
  });
  it("does not require specialist review for standard risk", () => {
    expect(requiredQaChecks("standard")).not.toContain("ymyl-review");
    expect(publishingGate(passingRecord()).ok).toBe(true);
  });
});
