import { describe, expect, it } from "vitest";
import { assessCertificationReview, type CertificationReviewPacket } from "./certification-review-policy";

const sha = "a".repeat(40), hash = "b".repeat(64);
function packet(): CertificationReviewPacket {
  return {
    policyVersion: "risk-review-2026-10-26",
    identity: { masterId: 134, calculatorId: "test.effective-ratio", version: 1, implementationSha: sha },
    calculationContext: { mode: "current", targetDate: "2026-10-26", contractContextRef: "review/134-contract" },
    riskTier: "bounded-arithmetic", riskAssessmentRef: "review/134-risk-assessment",
    intendedClaims: "Ratio of separately supplied tax and positive income only; no liability or advice.",
    selectedContractRef: "review/134-contract", unresolvedPolicyChoices: 0, unresolvedSourceConflicts: false, applicabilityRef: "review/134-scope-and-exclusions",
    obligations: { status: "screened-no-external-mandate", evidenceRef: "review/134-applicability-screen" },
    reviewer: { authorId: "author", reviewerId: "independent-engineer", competenceRef: "review/competence", reviewedAt: "2026-10-26" },
    sources: [{ url: "https://www.gov.uk/income-tax-rates", clause: "Selected ratio definition, not tax liability rules", revision: "captured-2026-10-26", snapshotSha256: hash, retrievedAt: "2026-10-26", fullTextVerified: true, applicabilityVerified: true, kind: "primary" }],
    verification: { independentExpectedCases: true, boundaryAndRounding: true, outputReconciliation: true, securityAndAccessibility: true, exactHeadReportSha256: hash }
  };
}
const rules = () => ({ jurisdiction: "GB", asOf: "2026-10-26", version: "selected-2026", effectiveFrom: "2026-04-06", effectiveTo: "2027-04-05", currencyVerifiedAt: "2026-10-26", jurisdictionTestsPassed: true, rulePackRef: "review/rules" });

describe("prospective risk-based certification review, never lifecycle authority", () => {
  it("allows independent engineering review of bounded source-backed arithmetic without a specialist", () => {
    const result = assessCertificationReview(packet(), "2026-10-26");
    expect(result).toMatchObject({ reviewReady: true, reviewRoute: "engineering-source-review", certificationAuthorized: false, publicationAuthorized: false });
    expect(result.failures).toEqual([]);
  });
  it.each([undefined, {}, { ...packet(), riskTier: "unknown" }, { ...packet(), riskTier: "unassessed" }])("fails closed for absent, malformed or unassessed evidence %#", (input) => {
    expect(assessCertificationReview(input, "2026-10-26").reviewReady).toBe(false);
  });
  it("does not infer legal exemption from unknown obligations", () => {
    const p = packet(); p.obligations.status = "unknown";
    expect(assessCertificationReview(p, "2026-10-26").failures).toContain("obligation-screening-incomplete");
  });
  it("does not let the author supply independent technical review", () => {
    const p = packet(); p.reviewer.reviewerId = p.reviewer.authorId;
    expect(assessCertificationReview(p, "2026-10-26").failures).toContain("independent-technical-review-required");
  });
  it("rejects dates that are normalized, future or invalid", () => {
    for (const date of ["2026-02-30", "2026-10-27", "not-a-date"]) {
      const p = packet(); p.reviewer.reviewedAt = date;
      expect(assessCertificationReview(p, "2026-10-26").reviewReady).toBe(false);
    }
    expect(assessCertificationReview(packet(), "2026-02-30").reviewReady).toBe(false);
  });
  it("requires full applicable source content, not a URL or arithmetic witness alone", () => {
    for (const field of ["fullTextVerified", "applicabilityVerified"] as const) {
      const p = packet(); p.sources[0][field] = false;
      expect(assessCertificationReview(p, "2026-10-26").reviewReady).toBe(false);
    }
    const p = packet(); p.sources = [];
    expect(assessCertificationReview(p, "2026-10-26").reviewReady).toBe(false);
  });
  it.each(["independentExpectedCases", "boundaryAndRounding", "outputReconciliation", "securityAndAccessibility"] as const)("keeps %s mandatory", (key) => {
    const p = packet(); p.verification[key] = false;
    expect(assessCertificationReview(p, "2026-10-26").reviewReady).toBe(false);
  });
  it("requires official applicable rule sources and jurisdiction tests for rule-dependent review", () => {
    const p = { ...packet(), riskTier: "rule-dependent", rulePack: rules() };
    expect(assessCertificationReview(p, "2026-10-26").failures).toContain("official-rule-source-required");
    p.sources[0].kind = "official";
    p.sources[0].ruleBinding = { jurisdiction: "GB", version: "selected-2026", effectiveFrom: "2026-04-06", effectiveTo: "2027-04-05" };
    expect(assessCertificationReview(p, "2026-10-26").reviewReady).toBe(true);
    p.rulePack.jurisdictionTestsPassed = false;
    expect(assessCertificationReview(p, "2026-10-26").failures).toContain("jurisdiction-rule-tests-required");
  });
  it("does not permit a future, expired or unverifiably current rule pack", () => {
    const p = { ...packet(), riskTier: "rule-dependent", rulePack: rules() };
    p.sources[0].kind = "official";
    p.sources[0].ruleBinding = { jurisdiction: "GB", version: "selected-2026", effectiveFrom: "2026-04-06", effectiveTo: "2027-04-05" };
    for (const bad of [{ effectiveFrom: "2026-10-27" }, { effectiveTo: "2026-10-25" }, { currencyVerifiedAt: "2026-10-25" }]) {
      expect(assessCertificationReview({ ...p, rulePack: { ...p.rulePack, ...bad } }, "2026-10-26").reviewReady).toBe(false);
    }
    expect(assessCertificationReview({ ...p, rulePack: undefined }, "2026-10-26").reviewReady).toBe(false);
  });
  it("retains qualified review for unresolved clinical, safety or high-consequence models", () => {
    const p = { ...packet(), riskTier: "safety-or-high-consequence" };
    expect(assessCertificationReview(p, "2026-10-26")).toMatchObject({ reviewReady: false, reviewRoute: "qualified-external-review" });
    expect(assessCertificationReview(p, "2026-10-26").failures).toContain("qualified-version-bound-review-required");
  });
  it("retains an identified external mandate even for ordinary arithmetic", () => {
    const p = packet(); p.obligations.status = "qualified-review-required";
    expect(assessCertificationReview(p, "2026-10-26").reviewRoute).toBe("qualified-external-review");
    expect(assessCertificationReview(p, "2026-10-26").reviewReady).toBe(false);
  });
  it("requires qualified evidence for the exact implementation and competent independent reviewer", () => {
    const p = { ...packet(), riskTier: "safety-or-high-consequence", qualifiedReview: { reviewerId: "qualified-clinician", qualificationRef: "evidence/credentials", decisionRef: "evidence/exact-scope-decision", implementationSha: sha, masterId: 134, calculatorId: "test.effective-ratio", version: 1, reviewedAt: "2026-10-26", decision: "approved" } };
    expect(assessCertificationReview(p, "2026-10-26").reviewReady).toBe(true);
    for (const bad of [{ implementationSha: "c".repeat(40) }, { version: 2 }, { masterId: 409 }, { calculatorId: "another" }, { reviewerId: "author" }, { decision: "pending" }]) {
      expect(assessCertificationReview({ ...p, qualifiedReview: { ...p.qualifiedReview, ...bad } }, "2026-10-26").reviewReady).toBe(false);
    }
  });
  it("rejects unresolved policy choices and conflicting source interpretations", () => {
    expect(assessCertificationReview({ ...packet(), unresolvedPolicyChoices: 1 }, "2026-10-26").reviewReady).toBe(false);
    expect(assessCertificationReview({ ...packet(), unresolvedSourceConflicts: true }, "2026-10-26").reviewReady).toBe(false);
  });
  it("binds official rules to the exact jurisdiction, version and period", () => {
    const p = { ...packet(), riskTier: "rule-dependent", rulePack: rules() };
    p.sources[0].kind = "official";
    p.sources[0].ruleBinding = { jurisdiction: "GB", version: "selected-2026", effectiveFrom: "2026-04-06", effectiveTo: "2027-04-05" };
    for (const bad of [{ jurisdiction: "US:CA" }, { version: "other-rule" }, { effectiveFrom: "2025-04-06" }]) {
      expect(assessCertificationReview({ ...p, rulePack: { ...p.rulePack, ...bad } }, "2026-10-26").failures).toContain("current-bound-official-source-required");
    }
  });
  it("requires the same exact-bound official source to be current", () => {
    const p = { ...packet(), riskTier: "rule-dependent", rulePack: rules() };
    p.sources[0].kind = "official";
    p.sources[0].ruleBinding = { jurisdiction: "GB", version: "selected-2026", effectiveFrom: "2026-04-06", effectiveTo: "2027-04-05" };
    p.sources[0].retrievedAt = "2026-10-25";
    p.sources.push({ ...p.sources[0], retrievedAt: "2026-10-26", ruleBinding: { ...p.sources[0].ruleBinding, jurisdiction: "US" } });
    expect(assessCertificationReview(p, "2026-10-26").failures).toContain("current-bound-official-source-required");
  });
  it("rejects expired rules masquerading as current calculations", () => {
    const p = { ...packet(), riskTier: "rule-dependent", rulePack: { ...rules(), asOf: "2025-10-26", effectiveFrom: "2025-04-06", effectiveTo: "2026-04-05" } };
    p.sources[0].kind = "official";
    p.sources[0].ruleBinding = { jurisdiction: "GB", version: "selected-2026", effectiveFrom: "2025-04-06", effectiveTo: "2026-04-05" };
    expect(assessCertificationReview(p, "2026-10-26").reviewReady).toBe(false);
  });
  it("permits old rules only for an explicitly bound historical calculation", () => {
    const p = { ...packet(), riskTier: "rule-dependent", rulePack: { ...rules(), asOf: "2025-10-26", effectiveFrom: "2025-04-06", effectiveTo: "2026-04-05" }, calculationContext: { mode: "historical", targetDate: "2025-10-26", contractContextRef: "review/134-contract" } };
    p.sources[0].kind = "official";
    p.sources[0].ruleBinding = { jurisdiction: "GB", version: "selected-2026", effectiveFrom: "2025-04-06", effectiveTo: "2026-04-05" };
    expect(assessCertificationReview(p, "2026-10-26").reviewReady).toBe(true);
    expect(assessCertificationReview({ ...p, calculationContext: undefined }, "2026-10-26").reviewReady).toBe(false);
    expect(assessCertificationReview({ ...p, calculationContext: { ...p.calculationContext, contractContextRef: "different-contract" } }, "2026-10-26").reviewReady).toBe(false);
  });
  it("does not accept client-supplied certification or publication authorization", () => {
    expect(assessCertificationReview({ ...packet(), certificationAuthorized: true }, "2026-10-26").reviewReady).toBe(false);
  });
});
