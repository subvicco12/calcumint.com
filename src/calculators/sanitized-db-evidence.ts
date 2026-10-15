import { createHash } from "node:crypto";
import { z } from "zod";
import { adminRoles, lifecycleStates, qaCheckTypes, requiredQaChecks, roleCanTransition } from "../lib/admin/publishing";
import type { CalculatorInventoryRecord } from "./implementation-inventory";
import type { buildMasterPublicationAudit } from "./master-publication-audit";

const digest = z.string().regex(/^[a-f0-9]{64}$/);
const reference = digest.nullable();
const role = z.enum([...adminRoles, "UNKNOWN"]);
const decision = z.enum(["approved", "HOLD", "rejected", "UNKNOWN"]);
const qa = z.object({
  checkType: z.enum(qaCheckTypes), status: z.enum(["pending", "passed", "failed", "waived"]),
  authorityRole: role, decisionRef: reference, rationaleRef: reference,
}).strict();
const review = z.object({
  kind: z.enum(["certification", "specialist", "publication"]), decision,
  authorityRole: role, decisionRef: reference, engineCommit: z.string().regex(/^[a-f0-9]{40}$/).nullable(),
}).strict();
const row = z.object({
  calculatorKey: z.string().regex(/^[a-z0-9][a-z0-9.-]*$/), slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  version: z.number().int().positive(), lifecycle: z.enum(lifecycleStates),
  riskClass: z.enum(["standard", "financial", "health", "tax"]),
  rulePackRequired: z.union([z.boolean(), z.literal("UNKNOWN")]),
  qa: z.array(qa).nullable(),
  sources: z.array(z.object({ sourceRef: digest, sourceKind: z.enum(["reference", "official", "methodology"]), reviewRef: reference }).strict()).nullable(),
  reviews: z.array(review).nullable(),
  masterMapping: z.object({ masterId: z.number().int().positive(), decision, authorityRole: role, decisionRef: reference }).strict().nullable(),
}).strict();
const count = z.number().int().nonnegative();
export const sanitizedDbEvidenceSchema = z.object({
  schemaVersion: z.literal(1),
  provenance: z.object({
    evidenceId: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    sourceKind: z.enum(["user-verified-aggregate", "independent-read-only-db-export"]),
    receivedOn: z.string().date(), observedAt: z.string().datetime().nullable(), payloadSha256: reference,
  }).strict(),
  scope: z.enum(["aggregate-only", "partial-rows", "complete-published-population"]),
  aggregates: z.object({
    publishedIdentities: count, riskClass: z.enum(["standard", "financial", "health", "tax"]), version: z.number().int().positive(),
    qaIdentities: count, qaChecks: count, qaPassed: count, qaWaived: count,
    passedPerIdentity: count, waivedPerIdentity: count, sourceRecords: count, sourceIdentities: count,
  }).strict(),
  rows: z.array(row),
}).strict();
export type SanitizedDbEvidence = z.infer<typeof sanitizedDbEvidenceSchema>;

/** Canonical digest of sanitized facts, not of provenance or an unsanitized DB dump. */
export function evidencePayloadDigest(aggregates: SanitizedDbEvidence["aggregates"], rows: SanitizedDbEvidence["rows"]): string {
  const canonical = (value: unknown): string => {
    if (Array.isArray(value)) return "[" + value.map(canonical).join(",") + "]";
    if (value && typeof value === "object") return "{" + Object.entries(value).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([key, entry]) => JSON.stringify(key) + ":" + canonical(entry)).join(",") + "}";
    return JSON.stringify(value);
  };
  return createHash("sha256").update(canonical({ aggregates, rows })).digest("hex");
}

export function parseSanitizedDbEvidence(value: unknown): SanitizedDbEvidence {
  const result = sanitizedDbEvidenceSchema.safeParse(value);
  if (!result.success) throw new Error("Invalid sanitized DB evidence contract; unknown/private fields are forbidden");
  const evidence = result.data;
  const a = evidence.aggregates;
  if (a.qaPassed + a.qaWaived !== a.qaChecks || a.qaIdentities * a.passedPerIdentity !== a.qaPassed || a.qaIdentities * a.waivedPerIdentity !== a.qaWaived || a.sourceIdentities > a.sourceRecords || a.sourceIdentities > a.publishedIdentities || a.qaIdentities > a.publishedIdentities) throw new Error("Inconsistent aggregate evidence");
  if (evidence.scope === "aggregate-only") {
    if (evidence.rows.length || evidence.provenance.sourceKind !== "user-verified-aggregate" || evidence.provenance.payloadSha256 !== null) throw new Error("Aggregate-only evidence cannot claim identity rows or a row payload hash");
  } else {
    if (evidence.provenance.sourceKind !== "independent-read-only-db-export" || evidence.provenance.payloadSha256 !== evidencePayloadDigest(a, evidence.rows)) throw new Error("Row evidence payload digest mismatch");
  }
  const keys = new Set<string>(), slugs = new Set<string>(), mapped = new Set<number>();
  for (const entry of evidence.rows) {
    if (keys.has(entry.calculatorKey) || slugs.has(entry.slug)) throw new Error("Duplicate DB identity");
    keys.add(entry.calculatorKey); slugs.add(entry.slug);
    for (const [values, label] of [[(entry.qa ?? []).map(check => check.checkType), "QA check"], [(entry.sources ?? []).map(source => source.sourceRef), "source"], [(entry.reviews ?? []).map(item => item.kind), "review"]] as const) {
      if (new Set(values).size !== values.length) throw new Error(`Duplicate ${label}`);
    }
    if (entry.masterMapping) {
      if (mapped.has(entry.masterMapping.masterId)) throw new Error("Duplicate master mapping claim");
      mapped.add(entry.masterMapping.masterId);
    }
  }
  if (evidence.scope === "complete-published-population") {
    if (evidence.rows.length !== a.publishedIdentities || evidence.rows.some(entry => entry.lifecycle !== "published" || entry.riskClass !== a.riskClass || entry.version !== a.version)) throw new Error("Complete population identity coverage mismatch");
    if (evidence.rows.some(entry => entry.qa === null || entry.sources === null)) throw new Error("Complete population QA/source coverage mismatch");
    const allQa = evidence.rows.flatMap(entry => entry.qa ?? []);
    if (allQa.length !== a.qaChecks || allQa.filter(check => check.status === "passed").length !== a.qaPassed || allQa.filter(check => check.status === "waived").length !== a.qaWaived || evidence.rows.filter(entry => entry.qa?.length).length !== a.qaIdentities || evidence.rows.reduce((total, entry) => total + (entry.sources?.length ?? 0), 0) !== a.sourceRecords || evidence.rows.filter(entry => entry.sources?.length).length !== a.sourceIdentities || evidence.rows.some(entry => entry.qa?.filter(check => check.status === "passed").length !== a.passedPerIdentity || entry.qa?.filter(check => check.status === "waived").length !== a.waivedPerIdentity)) throw new Error("Complete population QA/source coverage mismatch");
  }
  return evidence;
}

export function auditImportedIdentity(entry: SanitizedDbEvidence["rows"][number]) {
  const checks = entry.qa ?? [], sources = entry.sources ?? [], reviews = entry.reviews ?? [];
  const required = requiredQaChecks(entry.riskClass, entry.rulePackRequired === true);
  const missingChecks = required.filter(type => !checks.some(check => check.checkType === type));
  const waiverFindings = checks.filter(check => check.status === "waived").map(check => ({
    checkType: check.checkType,
    finding: check.authorityRole === "UNKNOWN" ? "WAIVER_AUTHORITY_UNKNOWN"
      : check.authorityRole !== "owner" && check.authorityRole !== "admin" ? "WAIVER_ROLE_CONFLICT"
      : !check.decisionRef || !check.rationaleRef ? "WAIVER_DECISION_EVIDENCE_UNKNOWN" : "RECORDED_OWNER_ADMIN_WAIVER_REQUIRES_REVIEW",
  }));
  const reviewFindings = reviews.flatMap(item => {
    const findings: { kind: typeof item.kind; finding: string }[] = [];
    if (item.decision !== "UNKNOWN" && (!item.decisionRef || item.authorityRole === "UNKNOWN")) findings.push({ kind: item.kind, finding: "REVIEW_AUTHORITY_EVIDENCE_UNKNOWN" });
    const target = item.kind === "publication" ? "published" : "certified";
    if (item.decision === "approved" && item.authorityRole !== "UNKNOWN" && !roleCanTransition(item.authorityRole, target)) findings.push({ kind: item.kind, finding: "REVIEW_ROLE_CONFLICT" });
    if (item.kind === "certification" && item.decision === "approved" && !item.engineCommit) findings.push({ kind: item.kind, finding: "CERTIFIED_ENGINE_COMMIT_UNKNOWN" });
    if (item.kind === "specialist" && item.decision === "approved") findings.push({ kind: item.kind, finding: "SPECIALIST_SCOPE_REQUIRES_AUTHORIZED_REVIEW" });
    return findings;
  });
  return {
    identity: { calculatorKey: entry.calculatorKey, slug: entry.slug, version: entry.version },
    observedLifecycle: entry.lifecycle, observedRiskClass: entry.riskClass,
    qa: { coverage: entry.qa === null ? "UNKNOWN" : "COMPLETE_DECLARED", passed: entry.qa === null ? null : checks.filter(check => check.status === "passed").length, waived: entry.qa === null ? null : waiverFindings.length, missingChecks,
      failedChecks: checks.filter(check => check.status === "failed").map(check => check.checkType),
      pendingChecks: checks.filter(check => check.status === "pending").map(check => check.checkType),
      authorityFindings: checks.filter(check => check.status !== "pending" && (!check.decisionRef || !["owner", "admin", "reviewer"].includes(check.authorityRole))).map(check => ({ checkType: check.checkType, finding: "QA_AUTHORITY_EVIDENCE_UNKNOWN_OR_CONFLICT" })),
      applicability: entry.rulePackRequired === "UNKNOWN" ? "RULE_PACK_APPLICABILITY_UNKNOWN" : "RECORDED", waiverFindings },
    sources: { coverage: entry.sources === null ? "UNKNOWN" : "COMPLETE_DECLARED", count: entry.sources === null ? null : sources.length, reviewEvidenceMissing: entry.sources === null ? null : sources.filter(source => !source.reviewRef).length },
    certificationDecision: reviews.find(review => review.kind === "certification") ?? "UNKNOWN",
    specialistDecision: reviews.find(review => review.kind === "specialist") ?? "UNKNOWN",
    publicationDecision: reviews.find(review => review.kind === "publication") ?? "UNKNOWN",
    masterMapping: entry.masterMapping ?? "UNKNOWN",
    reviewFindings,
    grantsCertification: false, grantsPublication: false,
  };
}

/** Overlay the existing 540-row audit; never turn an aggregate into per-key facts. */
export function reconcileSanitizedDbEvidence(
  base: ReturnType<typeof buildMasterPublicationAudit>, inventory: readonly CalculatorInventoryRecord[], raw: unknown,
) {
  const evidence = parseSanitizedDbEvidence(raw);
  const bySlug = new Map(inventory.map(entry => [entry.slug, entry]));
  const byKey = new Map(evidence.rows.map(entry => [entry.calculatorKey, entry]));
  const importedBySlug = new Map(evidence.rows.map(entry => [entry.slug, entry]));
  const masterIds = new Set(base.rows.map(entry => entry.masterId));
  for (const entry of evidence.rows) if (entry.masterMapping && !masterIds.has(entry.masterMapping.masterId)) throw new Error("Unknown master mapping claim");
  const observations = evidence.rows.map(entry => {
    const definition = bySlug.get(entry.slug);
    const registryMatch = !definition ? "REGISTRY_MISSING" : definition.id !== entry.calculatorKey ? "KEY_CONFLICT" : definition.version !== entry.version ? "VERSION_CONFLICT" : "EXACT_KEY_SLUG_VERSION";
    return { ...auditImportedIdentity(entry), registryMatch };
  });
  const observationByKey = new Map(observations.map(entry => [entry.identity.calculatorKey, entry]));
  const rows = base.rows.map(entry => {
    const candidates = entry.candidates.map(candidate => ({ calculatorKey: candidate.id, imported: byKey.get(candidate.id) ?? importedBySlug.get(candidate.slug) }));
    for (const imported of evidence.rows.filter(item => item.masterMapping?.masterId === entry.masterId)) {
      if (!candidates.some(candidate => candidate.imported?.calculatorKey === imported.calculatorKey)) candidates.push({ calculatorKey: imported.calculatorKey, imported });
    }
    return { ...entry, independentEvidence: candidates.map(candidate => {
      const imported = candidate.imported;
      if (!imported) return { calculatorKey: candidate.calculatorKey, status: "UNKNOWN" as const };
      const observation = observationByKey.get(imported.calculatorKey)!;
      return { calculatorKey: candidate.calculatorKey, status: observation.registryMatch === "EXACT_KEY_SLUG_VERSION" ? "IDENTITY_MATCHED_OBSERVATION" : "IDENTITY_CONFLICT", observation,
        masterMappingStatus: imported.masterMapping?.masterId === entry.masterId
          ? imported.masterMapping.decision === "approved" && imported.masterMapping.decisionRef && (imported.masterMapping.authorityRole === "owner" || imported.masterMapping.authorityRole === "admin") ? "RECORDED_APPROVED_MAPPING_REQUIRES_REVIEW" : "RECORDED_MAPPING_DECISION_REQUIRES_REVIEW"
          : "CANDIDATE_ONLY" };
    }) };
  });
  return {
    ...base, rows, independentEvidence: evidence, observations,
    importSummary: {
      scope: evidence.scope, provenance: evidence.provenance, aggregateObservations: evidence.aggregates,
      importedIdentities: evidence.rows.length,
      registryIdentityMatches: observations.filter(entry => entry.registryMatch === "EXACT_KEY_SLUG_VERSION").length,
      registryIdentityConflicts: observations.filter(entry => entry.registryMatch !== "EXACT_KEY_SLUG_VERSION").length,
      masterRowsWithImportedIdentity: rows.filter(entry => entry.independentEvidence.some(item => item.status === "IDENTITY_MATCHED_OBSERVATION")).length,
      rowLevelWaiversObserved: observations.reduce((total, entry) => total + (entry.qa.waived ?? 0), 0),
      importedRowsWithUnknownQa: observations.filter(entry => entry.qa.coverage === "UNKNOWN").length,
      importedRowsWithUnknownSources: observations.filter(entry => entry.sources.coverage === "UNKNOWN").length,
      populationIdentityCoverage: evidence.scope === "complete-published-population" ? "COMPLETE_DECLARED" : evidence.scope === "aggregate-only" ? "UNKNOWN" : "PARTIAL",
      anonymousAggregateCountComparison: base.summary.observedPublished === evidence.aggregates.publishedIdentities ? "COUNTS_AGREE_IDENTITIES_UNPROVEN" : "COUNT_DIFFERENCE_REQUIRES_REVIEW",
      recordedHoldIdentities: observations.filter(entry => [entry.masterMapping, entry.certificationDecision, entry.specialistDecision, entry.publicationDecision].some(item => typeof item === "object" && item.decision === "HOLD")).length,
      waiverAuthorityConflicts: observations.reduce((total, entry) => total + entry.qa.waiverFindings.filter(item => item.finding === "WAIVER_ROLE_CONFLICT").length, 0),
      missingRowExport: evidence.scope === "aggregate-only", approvalsGranted: false,
      aggregateWaiverChecksRequiringDecisionEvidence: evidence.aggregates.qaWaived,
    },
  };
}
