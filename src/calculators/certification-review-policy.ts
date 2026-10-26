import { z } from "zod";

/**
 * Prospective, offline assessment of a documented review packet, not an attestation
 * service. References/hashes describe evidence to inspect; this function cannot
 * authenticate a reviewer, verify source contents, certify or publish a calculator.
 * Do not use it instead of the application/database publication gates.
 */
export const certificationReviewPolicyVersion = "risk-review-2026-10-26" as const;
export const certificationReviewRiskTiers = [
  "bounded-arithmetic", "deterministic-model", "rule-dependent",
  "safety-or-high-consequence", "unassessed"
] as const;

const text = z.string().trim().min(1);
const gitSha = z.string().regex(/^[a-f0-9]{40}$/);
const evidenceSha = z.string().regex(/^[a-f0-9]{64}$/);
function validDay(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(d.getTime()) && d.toISOString().slice(0, 10) === value;
}
const day = z.string().refine(validDay);
const httpsUrl = z.string().url().refine((value) => new URL(value).protocol === "https:");
const identity = z.object({ masterId: z.number().int().min(1).max(540), calculatorId: text, version: z.number().int().positive(), implementationSha: gitSha }).strict();
const packetSchema = z.object({
  policyVersion: z.literal(certificationReviewPolicyVersion),
  identity,
  riskTier: z.enum(certificationReviewRiskTiers),
  riskAssessmentRef: text,
  intendedClaims: text,
  selectedContractRef: text,
  unresolvedPolicyChoices: z.number().int().nonnegative(),
  unresolvedSourceConflicts: z.boolean(),
  applicabilityRef: text,
  obligations: z.object({ status: z.enum(["screened-no-external-mandate", "qualified-review-required", "unknown"]), evidenceRef: text }).strict(),
  reviewer: z.object({ authorId: text, reviewerId: text, competenceRef: text, reviewedAt: day }).strict(),
  sources: z.array(z.object({
    url: httpsUrl, clause: text, revision: text, snapshotSha256: evidenceSha, retrievedAt: day,
    fullTextVerified: z.boolean(), applicabilityVerified: z.boolean(), kind: z.enum(["official", "primary", "standard"]),
    ruleBinding: z.object({ jurisdiction: text, version: text, effectiveFrom: day, effectiveTo: day.optional() }).strict().optional()
  }).strict()).min(1),
  verification: z.object({
    independentExpectedCases: z.boolean(), boundaryAndRounding: z.boolean(), outputReconciliation: z.boolean(),
    securityAndAccessibility: z.boolean(), exactHeadReportSha256: evidenceSha
  }).strict(),
  calculationContext: z.object({ mode: z.enum(["current", "historical"]), targetDate: day, contractContextRef: text }).strict().optional(),
  rulePack: z.object({
    jurisdiction: text, asOf: day, version: text, effectiveFrom: day, effectiveTo: day.optional(),
    currencyVerifiedAt: day, jurisdictionTestsPassed: z.boolean(), rulePackRef: text
  }).strict().optional(),
  qualifiedReview: z.object({
    reviewerId: text, qualificationRef: text, decisionRef: text, implementationSha: gitSha,
    masterId: z.number().int().min(1).max(540), calculatorId: text, version: z.number().int().positive(),
    reviewedAt: day, decision: z.enum(["approved", "pending", "rejected"])
  }).strict().optional()
}).strict();

export type CertificationReviewPacket = z.infer<typeof packetSchema>;
export type CertificationReviewAssessment = Readonly<{
  policyVersion: typeof certificationReviewPolicyVersion;
  reviewReady: boolean;
  reviewRoute: "engineering-source-review" | "qualified-external-review" | "unassessed";
  failures: readonly string[];
  certificationAuthorized: false;
  publicationAuthorized: false;
}>;

export function assessCertificationReview(input: unknown, asOf: string): CertificationReviewAssessment {
  const result = packetSchema.safeParse(input);
  const finish = (failures: string[], reviewRoute: CertificationReviewAssessment["reviewRoute"]): CertificationReviewAssessment => Object.freeze({
    policyVersion: certificationReviewPolicyVersion, reviewReady: failures.length === 0, reviewRoute,
    failures: Object.freeze(failures), certificationAuthorized: false, publicationAuthorized: false
  });
  if (!result.success || !validDay(asOf)) return finish(["invalid-review-packet-or-date"], "unassessed");
  const p = result.data, failures: string[] = [];
  if (p.riskTier === "unassessed") return finish(["risk-assessment-required"], "unassessed");
  if (p.unresolvedPolicyChoices > 0) failures.push("contract-policy-selection-incomplete");
  if (p.unresolvedSourceConflicts) failures.push("source-conflict-unresolved");
  const qualified = p.riskTier === "safety-or-high-consequence" || p.obligations.status === "qualified-review-required";
  const route = qualified ? "qualified-external-review" : "engineering-source-review";
  if (p.obligations.status === "unknown") failures.push("obligation-screening-incomplete");
  if (p.reviewer.reviewerId === p.reviewer.authorId) failures.push("independent-technical-review-required");
  if (p.reviewer.reviewedAt > asOf) failures.push("future-technical-review");
  if (p.sources.some(s => !s.fullTextVerified || !s.applicabilityVerified || s.retrievedAt > asOf)) failures.push("complete-applicable-source-review-required");
  if (!p.verification.independentExpectedCases) failures.push("independent-numerical-cases-required");
  if (!p.verification.boundaryAndRounding) failures.push("boundary-and-rounding-tests-required");
  if (!p.verification.outputReconciliation) failures.push("output-reconciliation-required");
  if (!p.verification.securityAndAccessibility) failures.push("security-and-accessibility-review-required");
  // Supplied rule metadata can never silently escape regulatory verification merely
  // because a packet was labelled as a lower tier.
  if (p.riskTier === "rule-dependent" || p.rulePack) {
    const rules = p.rulePack;
    if (!p.sources.some(s => s.kind === "official" && s.retrievedAt === asOf)) failures.push("official-rule-source-required");
    if (!rules) failures.push("complete-rule-pack-required");
    else {
      if (rules.asOf > asOf || rules.effectiveFrom > rules.asOf || (rules.effectiveTo && rules.effectiveTo < rules.asOf) ||
          (rules.effectiveTo && rules.effectiveTo < rules.effectiveFrom) || rules.currencyVerifiedAt !== asOf) failures.push("rule-effective-period-or-currency-unverified");
      const context = p.calculationContext;
      if (!context || context.contractContextRef !== p.selectedContractRef || context.targetDate !== rules.asOf ||
          context.targetDate > asOf || (context.mode === "current" && context.targetDate !== asOf)) failures.push("explicit-calculation-context-required");
      if (!p.sources.some(s => s.kind === "official" && s.retrievedAt === asOf && s.ruleBinding?.jurisdiction === rules.jurisdiction &&
          s.ruleBinding.version === rules.version && s.ruleBinding.effectiveFrom === rules.effectiveFrom &&
          s.ruleBinding.effectiveTo === rules.effectiveTo)) failures.push("current-bound-official-source-required");
      if (!rules.jurisdictionTestsPassed) failures.push("jurisdiction-rule-tests-required");
    }
  }
  if (qualified) {
    const q = p.qualifiedReview;
    if (!q || q.decision !== "approved" || q.masterId !== p.identity.masterId || q.calculatorId !== p.identity.calculatorId ||
        q.version !== p.identity.version || q.implementationSha !== p.identity.implementationSha ||
        q.reviewerId === p.reviewer.authorId || q.reviewedAt > asOf) failures.push("qualified-version-bound-review-required");
  }
  return finish(failures, route);
}
