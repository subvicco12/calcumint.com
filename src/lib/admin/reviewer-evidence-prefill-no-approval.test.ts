import { describe, expect, it } from "vitest";
import { buildReviewerEvidencePrefill } from "./reviewer-evidence-prefill";
import { requiredQaChecks } from "./publishing";

describe("reviewer evidence prefill remains non-authoritative", () => {
  it("produces pending decisions without fabricating reviewer approval or source review", () => {
    const required = requiredQaChecks("standard", false);
    const packet = { calculatorKey: "sample", slug: "sample", sources: [{ label: "Standard", url: "https://example.org/reference" }], goldenTestCount: 2, formulaCount: 1, requiredQaChecks: required };
    const prefill = buildReviewerEvidencePrefill(packet);
    expect(prefill.qa).toHaveLength(15);
    expect(prefill.qa.every((item) => item.status === "pending" && item.details === "")).toBe(true);
    expect(prefill.qa.map((item) => item.checkType)).toEqual(required);
    expect(prefill.sources).toEqual([{ label: "Standard", url: "https://example.org/reference", sourceKind: "reference" }]);
    expect(prefill.evidenceSummary).toEqual({ goldenTestCount: 2, formulaCount: 1 });
    expect(Object.keys(prefill).sort()).toEqual(["calculatorKey", "evidenceSummary", "qa", "slug", "sources"]);
  });
});
