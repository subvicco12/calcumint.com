import { describe, expect, it } from "vitest";
import { requiredQaChecks } from "../lib/admin/publishing";
import { buildMasterPublicationAudit, exportMasterPublicationAuditCsv } from "./master-publication-audit";
import { auditImportedIdentity, evidencePayloadDigest, parseSanitizedDbEvidence, reconcileSanitizedDbEvidence, type SanitizedDbEvidence } from "./sanitized-db-evidence";

const ref = "a".repeat(64);
function fixture(): SanitizedDbEvidence {
  const evidence: SanitizedDbEvidence = {
    schemaVersion: 1, scope: "complete-published-population",
    provenance: { evidenceId: "synthetic-offline-fixture", sourceKind: "independent-read-only-db-export", receivedOn: "2026-10-15", observedAt: null, payloadSha256: null },
    aggregates: { publishedIdentities: 1, riskClass: "standard", version: 1, qaIdentities: 1, qaChecks: 15, qaPassed: 11, qaWaived: 4, passedPerIdentity: 11, waivedPerIdentity: 4, sourceRecords: 1, sourceIdentities: 1 },
    rows: [{ calculatorKey: "math.example", slug: "example-calculator", version: 1, lifecycle: "published", riskClass: "standard", rulePackRequired: false,
      qa: requiredQaChecks("standard").map((checkType, i) => ({ checkType, status: i < 11 ? "passed" : "waived", authorityRole: "owner", decisionRef: ref, rationaleRef: i < 11 ? null : ref })),
      sources: [{ sourceRef: ref, sourceKind: "reference", reviewRef: ref }],
      reviews: [{ kind: "certification", decision: "approved", authorityRole: "owner", decisionRef: ref, engineCommit: null }],
      masterMapping: { masterId: 1, decision: "approved", authorityRole: "owner", decisionRef: ref },
    }],
  };
  return seal(evidence);
}
function seal(evidence: SanitizedDbEvidence) {
  evidence.provenance.payloadSha256 = evidencePayloadDigest(evidence.aggregates, evidence.rows);
  return evidence;
}
const inventory = [{ id: "math.example", slug: "example-calculator", title: "Example Calculator", category: "math", version: 1, riskClass: "standard" as const, reviewStatus: "certified" as const }];
const master = [{ masterId: 1, domain: "Math", title: "Example Calculator" }];
const matches = [{ ...master[0], status: "exact" as const, slug: inventory[0].slug, evidence: "domain-title" as const }];
const base = (held = false) => buildMasterPublicationAudit(master, inventory, matches, { manifestState: "available", manifest: [{ calculator_key: inventory[0].id, slug: inventory[0].slug, version: 1 }] }, held ? { 1: inventory[0].slug } : {});

describe("strict sanitized DB evidence import", () => {
  it("accepts a digest-pinned synthetic population and verifies counts without granting approval", () => {
    const result = reconcileSanitizedDbEvidence(base(), inventory, fixture());
    expect(result.importSummary.registryIdentityMatches).toBe(1);
    expect(result.importSummary.rowLevelWaiversObserved).toBe(4);
    expect(result.rows[0].classification).toBe("approval pending");
    expect(result.rows[0].publicationAuthorized).toBe(false);
    expect(result.observations[0].qa.waiverFindings.every(item => item.finding === "RECORDED_OWNER_ADMIN_WAIVER_REQUIRES_REVIEW")).toBe(true);
  });
  it("does not assign aggregate-only QA or sources to known anonymous identities", () => {
    const e = fixture(); e.scope = "aggregate-only"; e.rows = []; e.provenance.sourceKind = "user-verified-aggregate"; e.provenance.payloadSha256 = null;
    const result = reconcileSanitizedDbEvidence(base(), inventory, e);
    expect(result.importSummary.importedIdentities).toBe(0);
    expect(result.importSummary.masterRowsWithImportedIdentity).toBe(0);
    expect(result.rows[0].independentEvidence).toEqual([{ calculatorKey: "math.example", status: "UNKNOWN" }]);
    expect(result.rows[0].dbCertification).toBe("UNKNOWN");
  });
  it("rejects personal/credential/free-text fields at every nested boundary", () => {
    for (const location of ["root", "provenance", "row", "qa", "source", "review", "mapping"]) {
      const e = fixture();
      const target = location === "root" ? e : location === "provenance" ? e.provenance : location === "row" ? e.rows[0] : location === "qa" ? e.rows[0].qa![0] : location === "source" ? e.rows[0].sources![0] : location === "review" ? e.rows[0].reviews![0] : e.rows[0].masterMapping;
      Object.assign(target!, { reviewer_email: "synthetic@example.invalid", credentials: "not-a-real-secret" });
      expect(() => parseSanitizedDbEvidence(e)).toThrow(/Invalid sanitized/);
    }
  });
  it("rejects tampering, contradictory aggregates and duplicate QA/identity records", () => {
    const tampered = fixture(); tampered.rows[0].version = 2;
    expect(() => parseSanitizedDbEvidence(tampered)).toThrow(/digest mismatch/);
    const counts = fixture(); counts.aggregates.qaChecks++;
    expect(() => parseSanitizedDbEvidence(seal(counts))).toThrow(/aggregate/);
    const duplicate = fixture(); duplicate.scope = "partial-rows"; duplicate.rows.push(structuredClone(duplicate.rows[0]));
    expect(() => parseSanitizedDbEvidence(seal(duplicate))).toThrow(/Duplicate DB/);
    const checks = fixture(); checks.rows[0].qa!.push(checks.rows[0].qa![0]);
    expect(() => parseSanitizedDbEvidence(seal(checks))).toThrow(/Duplicate QA/);
  });
  it("rejects a complete claim when records or source/QA coverage are missing", () => {
    const e = fixture(); e.rows[0].sources = [];
    expect(() => parseSanitizedDbEvidence(seal(e))).toThrow(/coverage mismatch/);
  });
  it("flags prohibited and undocumented waivers without rewriting their recorded status", () => {
    const e = fixture(); const waiver = e.rows[0].qa!.find(check => check.status === "waived")!;
    waiver.authorityRole = "reviewer";
    expect(auditImportedIdentity(e.rows[0]).qa.waiverFindings.some(item => item.finding === "WAIVER_ROLE_CONFLICT")).toBe(true);
    waiver.authorityRole = "UNKNOWN";
    expect(auditImportedIdentity(e.rows[0]).qa.waiverFindings.some(item => item.finding === "WAIVER_AUTHORITY_UNKNOWN")).toBe(true);
    waiver.authorityRole = "admin"; waiver.rationaleRef = null;
    expect(auditImportedIdentity(e.rows[0]).qa.waiverFindings.some(item => item.finding === "WAIVER_DECISION_EVIDENCE_UNKNOWN")).toBe(true);
    expect(waiver.status).toBe("waived");
  });
  it("audits missing checks, YMYL and unknown rule-pack applicability using existing requirements", () => {
    const e = fixture(); e.rows[0].riskClass = "health"; e.rows[0].rulePackRequired = "UNKNOWN"; e.rows[0].qa = [];
    const audit = auditImportedIdentity(e.rows[0]);
    expect(audit.qa.missingChecks).toContain("ymyl-review");
    expect(audit.qa.missingChecks).toContain("security");
    expect(audit.qa.applicability).toBe("RULE_PACK_APPLICABILITY_UNKNOWN");
    expect(audit.specialistDecision).toBe("UNKNOWN");
  });
  it("never clears an existing HOLD or promotes a recorded mapping/certification decision", () => {
    const result = reconcileSanitizedDbEvidence(base(true), inventory, fixture());
    expect(result.rows[0].hold).toBe("HOLD");
    expect(result.rows[0].identityApproval).toBe("HOLD");
    expect(result.rows[0].classification).toBe("approval pending");
    expect(result.importSummary.approvalsGranted).toBe(false);
  });
  it("attaches key conflicts by slug instead of hiding the mismatched DB row", () => {
    const e = fixture(); e.rows[0].calculatorKey = "other.example";
    const result = reconcileSanitizedDbEvidence(base(), inventory, seal(e));
    expect(result.importSummary.registryIdentityConflicts).toBe(1);
    expect(result.rows[0].independentEvidence[0].status).toBe("IDENTITY_CONFLICT");
  });
  it("records an explicit mapping claim even when title discovery had no candidate", () => {
    const original = buildMasterPublicationAudit([{ ...master[0], title: "Unmatched master" }], inventory, [{ ...master[0], title: "Unmatched master", status: "unmatched" }], { manifestState: "unavailable", manifest: [] });
    const result = reconcileSanitizedDbEvidence(original, inventory, fixture());
    expect(result.rows[0].independentEvidence).toHaveLength(1);
    expect(result.rows[0].classification).toBe("missing");
    expect(result.rows[0].candidateKey).toBeNull();
  });
  it("preserves unknown QA/source sections instead of interpreting omissions as zero DB records", () => {
    const e = fixture(); e.scope = "partial-rows"; e.rows[0].qa = null; e.rows[0].sources = null; e.rows[0].reviews = null;
    const result = reconcileSanitizedDbEvidence(base(), inventory, seal(e));
    expect(result.observations[0].qa.passed).toBeNull();
    expect(result.observations[0].qa.waived).toBeNull();
    expect(result.observations[0].sources.count).toBeNull();
    expect(result.observations[0].certificationDecision).toBe("UNKNOWN");
    expect(result.importSummary.importedRowsWithUnknownQa).toBe(1);
  });
  it("checks the complete 209-identity / 3135-QA / 210-source synthetic population", () => {
    const e = fixture(); const original = e.rows[0];
    e.rows = Array.from({ length: 209 }, (_, index) => ({ ...structuredClone(original), calculatorKey: `synthetic.example-${index}`, slug: `synthetic-example-${index}`, masterMapping: null }));
    e.rows[0].sources!.push({ sourceRef: "b".repeat(64), sourceKind: "methodology", reviewRef: ref });
    e.aggregates = { publishedIdentities: 209, riskClass: "standard", version: 1, qaIdentities: 209, qaChecks: 3135, qaPassed: 2299, qaWaived: 836, passedPerIdentity: 11, waivedPerIdentity: 4, sourceRecords: 210, sourceIdentities: 209 };
    expect(parseSanitizedDbEvidence(seal(e)).rows).toHaveLength(209);
    expect(e.rows.flatMap(entry => entry.qa ?? [])).toHaveLength(3135);
    e.rows[0].qa![0].status = "waived";
    expect(() => parseSanitizedDbEvidence(seal(e))).toThrow(/coverage mismatch/);
  });
  it("flags imported version conflicts and retains the original registry version", () => {
    const e = fixture(); e.rows[0].version = 2; e.aggregates.version = 2;
    const result = reconcileSanitizedDbEvidence(base(), inventory, seal(e));
    expect(result.observations[0].registryMatch).toBe("VERSION_CONFLICT");
    expect(result.rows[0].independentEvidence[0].status).toBe("IDENTITY_CONFLICT");
    expect(result.rows[0].candidateVersion).toBe(1);
  });
  it("keeps the existing CSV stable and rejects incomplete or conflicting evidence columns", () => {
    const original = exportMasterPublicationAuditCsv(base());
    expect(exportMasterPublicationAuditCsv(base(), {})).toBe(original);
    expect(() => exportMasterPublicationAuditCsv(base(), { independentEvidence: [] })).toThrow();
    expect(() => exportMasterPublicationAuditCsv(base(), { masterId: [1] })).toThrow();
    expect(exportMasterPublicationAuditCsv(base(), { independentEvidence: ["UNKNOWN"] })).toContain('"independentEvidence"');
  });
  it("flags publication-role contradictions and approvals lacking an exact certified engine commit", () => {
    const e = fixture();
    e.rows[0].reviews!.push({ kind: "publication", decision: "approved", authorityRole: "reviewer", decisionRef: ref, engineCommit: null });
    const audit = auditImportedIdentity(e.rows[0]);
    expect(audit.reviewFindings).toContainEqual({ kind: "publication", finding: "REVIEW_ROLE_CONFLICT" });
    expect(audit.reviewFindings).toContainEqual({ kind: "certification", finding: "CERTIFIED_ENGINE_COMMIT_UNKNOWN" });
    expect(audit.grantsPublication).toBe(false);
  });
});
