import type { buildMasterPublicationAudit } from "./master-publication-audit";
import { parseSanitizedDbEvidence } from "./sanitized-db-evidence";

type Audit = ReturnType<typeof buildMasterPublicationAudit>;

/** Reviewer queue only. Uses existing candidate edges; never discovers aliases or grants approvals. */
export function buildMasterIdentityProposals(audit: Audit, rawEvidence: unknown) {
  if (new Set(audit.rows.map(row => row.masterId)).size !== audit.rows.length
    || audit.rows.some(row => !Number.isSafeInteger(row.masterId) || row.masterId < 1)) throw new Error("Invalid or duplicate master identity");
  for (const row of audit.rows) {
    if (new Set(row.candidates.map(candidate => candidate.slug)).size !== row.candidates.length
      || row.candidates.some(candidate => !Number.isSafeInteger(candidate.version) || candidate.version < 1)) throw new Error("Invalid candidate identity/version");
  }
  const evidence = parseSanitizedDbEvidence(rawEvidence);
  const imported = new Map(evidence.rows.map(row => [row.slug, row]));
  const users = new Map<string, number[]>();
  for (const row of audit.rows) for (const candidate of row.candidates) {
    users.set(candidate.slug, [...(users.get(candidate.slug) ?? []), row.masterId]);
  }
  const rows = [...audit.rows].sort((a, b) => a.masterId - b.masterId).map(row => {
    const candidates = row.candidates.map(candidate => {
      const db = imported.get(candidate.slug);
      const dbIdentity = !db ? "UNKNOWN" : db.calculatorKey !== candidate.id ? "KEY_CONFLICT"
        : db.version !== candidate.version ? "VERSION_CONFLICT" : "EXACT_KEY_SLUG_VERSION";
      const sharedMasterIds = [...(users.get(candidate.slug) ?? [])].sort((a, b) => a - b);
      // Ranking is review order, never confidence/probability of mathematical equivalence.
      const reviewTier = dbIdentity.includes("CONFLICT") ? 0 : sharedMasterIds.length > 1 ? 1 : 2;
      return {
        calculatorKey: candidate.id, slug: candidate.slug, version: candidate.version,
        reviewTier, dbIdentity, sharedMasterIds,
        evidence: [row.mappingBasis, `anonymous:${candidate.dbPublication}`, `sanitized:${dbIdentity}`],
        evidenceRef: db ? `${evidence.provenance.evidenceId}#${candidate.slug}` : null,
        rationale: reviewTier === 0 ? "Resolve immutable identity conflict first"
          : reviewTier === 1 ? "Candidate reused across master scopes; compare contracts for every listed master ID"
          : "Existing candidate only; compare master domain and feature contract before requesting identity approval",
      };
    }).sort((a, b) => a.reviewTier - b.reviewTier || a.slug.localeCompare(b.slug));
    const conflict = candidates.some(candidate => candidate.dbIdentity.includes("CONFLICT"));
    const state = row.hold === "HOLD" ? "HOLD" : conflict ? "conflict" : candidates.length ? "proposed" : "UNKNOWN";
    return {
      masterId: row.masterId, domain: row.domain, title: row.title, classification: row.classification,
      state, holdBasis: row.holdBasis, priority: row.priority, candidates,
      decisionOwner: "authorized catalog identity reviewer", ownerAssignment: "UNKNOWN",
      requiredEvidence: ["master scope and feature contract", "registry key/slug/version and engine SHA", "domain-qualified mapping decision reference", "reviewer authority and decision date"],
      nextAction: row.hold === "HOLD" ? row.nextAction : conflict ? "Resolve key/version discrepancy against authoritative export; preserve existing identities and versions"
        : !candidates.length ? "Catalog reviewer must supply source-backed alias or feature-contract evidence; do not infer absence or invent a candidate"
        : "Compare each candidate contract and shared master scope; record accept/reject/UNKNOWN with authority and evidence references",
      identityDecision: row.hold === "HOLD" ? "HOLD" : "UNKNOWN",
      mappingApproved: false, publicationAuthorized: false, certificationAuthorized: false,
    };
  });
  return { schemaVersion: 1, evidenceId: evidence.provenance.evidenceId, provenance: evidence.provenance,
    rankingMeaning: "Conflict-first review order; no score implies equivalence or approval",
    summary: { total: rows.length, proposed: rows.filter(row => row.state === "proposed").length,
      unknown: rows.filter(row => row.state === "UNKNOWN").length, conflict: rows.filter(row => row.state === "conflict").length,
      holds: rows.filter(row => row.state === "HOLD").length,
      explicitHolds: rows.filter(row => row.holdBasis === "explicit-master-review").length,
      candidateHolds: rows.filter(row => row.holdBasis === "candidate-source-review").length,
      approvedMappings: 0 }, rows };
}
