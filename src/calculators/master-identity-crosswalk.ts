import type { buildMasterPublicationAudit } from "./master-publication-audit";
import type { CalculatorInventoryRecord } from "./implementation-inventory";

type Audit = ReturnType<typeof buildMasterPublicationAudit>;
const compare = (a: string, b: string) => a < b ? -1 : a > b ? 1 : 0;

/** Offline crosswalk of existing evidence only; no new aliases or mapping decisions. */
export function buildMasterIdentityCrosswalk(audit: Audit, inventory: readonly CalculatorInventoryRecord[]) {
  const bySlug = new Map(inventory.map(entry => [entry.slug, entry]));
  if (bySlug.size !== inventory.length || new Set(inventory.map(entry => entry.id)).size !== inventory.length
    || inventory.some(entry => !entry.id || !entry.slug || !Number.isSafeInteger(entry.version) || entry.version < 1)) {
    throw new Error("Invalid or duplicate registry identity/version");
  }
  if (new Set(audit.rows.map(row => row.masterId)).size !== audit.rows.length
    || audit.rows.some(row => !Number.isSafeInteger(row.masterId) || row.masterId < 1 || !row.domain || !row.title)) {
    throw new Error("Invalid or duplicate master identity");
  }
  const usages = new Map<string, Set<number>>();
  for (const row of audit.rows) {
    if (new Set(row.candidates.map(candidate => candidate.slug)).size !== row.candidates.length
      || row.candidates.some(candidate => !candidate.id || !candidate.slug || !Number.isSafeInteger(candidate.version) || candidate.version < 1)) {
      throw new Error("Invalid or duplicate candidate identity/version");
    }
    for (const candidate of row.candidates) {
      if (!usages.has(candidate.slug)) usages.set(candidate.slug, new Set());
      usages.get(candidate.slug)!.add(row.masterId);
    }
  }
  const rows = [...audit.rows].sort((a, b) => a.masterId - b.masterId).map(row => {
    const candidates = [...row.candidates].sort((a, b) => compare(a.slug, b.slug)).map(candidate => {
      const current = bySlug.get(candidate.slug);
      const registryBinding = !current ? "NOT_IN_CURRENT_REGISTRY" : current.id !== candidate.id ? "KEY_CONFLICT"
        : current.version !== candidate.version ? "VERSION_CONFLICT" : "EXACT_KEY_SLUG_VERSION";
      return {
        calculatorKey: candidate.id, slug: candidate.slug, version: candidate.version,
        registryBinding,
        currentRegistry: current ? { calculatorKey: current.id, slug: current.slug, version: current.version,
          codeReviewStatus: current.reviewStatus, riskClass: current.riskClass, category: current.category } : null,
        sharedMasterIds: [...usages.get(candidate.slug)!].sort((a, b) => a - b),
        dbPublication: candidate.dbPublication, observedDbKey: candidate.observedDbKey,
        observedDbVersion: candidate.observedDbVersion,
      };
    });
    const conflict = candidates.some(candidate => candidate.registryBinding !== "EXACT_KEY_SLUG_VERSION");
    const reused = candidates.some(candidate => candidate.sharedMasterIds.length > 1);
    const linkageState = !candidates.length ? "MAPPING_EVIDENCE_MISSING" : conflict ? "REGISTRY_IDENTITY_CONFLICT"
      : candidates.length > 1 ? "MULTIPLE_CANDIDATES" : reused ? "SHARED_CANDIDATE" : "SINGLE_CANDIDATE_REVIEW_REQUIRED";
    return {
      masterId: row.masterId, domain: row.domain, title: row.title,
      mappingBasis: row.mappingBasis, linkageState, candidates,
      // Registry absence/name mismatch cannot establish absence of an engine.
      engineAbsenceProven: false as const,
      identityApproval: row.identityApproval === "HOLD" ? "HOLD" as const : "UNKNOWN" as const,
      lifecycle: { hold: row.hold, holdBasis: row.holdBasis,
        codeReviewStatus: row.codeReviewStatus, dbCertification: row.dbCertification,
        specialistApproval: row.specialistApproval, deployment: row.deployment },
      nextAction: conflict ? "Resolve immutable key/version evidence against the exact registry revision; do not rewrite history"
        : !candidates.length ? "Review master scope, aliases and unlinked registry implementations before proposing any new engine"
        : reused || candidates.length > 1 ? "Review every candidate and master scope together; no name-only merge or alias approval"
        : "Obtain domain-qualified mapping authority and required lifecycle evidence",
      mappingApproved: false as const, publicationAuthorized: false as const, certificationAuthorized: false as const,
    };
  });
  const reusedSlugs = [...usages].filter(([, ids]) => ids.size > 1).sort(([a], [b]) => compare(a, b))
    .map(([slug, ids]) => ({ slug, masterIds: [...ids].sort((a, b) => a - b) }));
  const domainBatches = [...new Set(rows.map(row => row.domain))].sort(compare).map(domain => {
    const domainRows = rows.filter(row => row.domain === domain);
    return {
      domain, totalMaster: domainRows.length,
      mappingEvidenceMissing: domainRows.filter(row => !row.candidates.length).map(row => row.masterId),
      candidateAdjudication: domainRows.filter(row => row.candidates.length > 1 || row.candidates.some(candidate => candidate.sharedMasterIds.length > 1)).map(row => row.masterId),
      immutableIdentityConflicts: domainRows.filter(row => row.linkageState === "REGISTRY_IDENTITY_CONFLICT").map(row => row.masterId),
      held: domainRows.filter(row => row.lifecycle.hold === "HOLD").map(row => row.masterId),
      singleCandidateReview: domainRows.filter(row => row.candidates.length === 1).map(row => row.masterId),
      implementationBatchReady: false as const,
      batchGate: "Identity reviewer must establish missing implementation versus missing linkage before authorizing domain engine work",
    };
  });
  return {
    schemaVersion: 1,
    historyPolicy: "Preserve immutable key/slug/version evidence and Slope v1 history; a current v2 candidate never authorizes legacy reinterpretation",
    summary: {
      totalMaster: rows.length, registryDefinitions: inventory.length,
      singleCandidate: rows.filter(row => row.candidates.length === 1).length,
      multipleCandidates: rows.filter(row => row.candidates.length > 1).length,
      missingLinkage: rows.filter(row => !row.candidates.length).length,
      selectionDecisions: rows.filter(row => row.candidates.length !== 1).length,
      reusedSlugs: reusedSlugs.length,
      singleCandidateReusedSlugs: reusedSlugs.filter(group => rows.filter(row => group.masterIds.includes(row.masterId)).every(row => row.candidates.length === 1)).length,
      registryIdentityConflictRows: rows.filter(row => row.linkageState === "REGISTRY_IDENTITY_CONFLICT").length,
      approvedMappings: 0, provenMissingEngines: 0,
    },
    unlinkedRegistryIdentities: [...inventory].filter(entry => !usages.has(entry.slug)).sort((a, b) => compare(a.slug, b.slug))
      .map(({ id, slug, version, category }) => ({ calculatorKey: id, slug, version, category })),
    reusedSlugs, domainBatches, rows,
  };
}

export function exportMasterIdentityCrosswalkCsv(report: ReturnType<typeof buildMasterIdentityCrosswalk>): string {
  const cell = (value: unknown) => {
    const text = typeof value === "object" ? JSON.stringify(value) : String(value);
    const safe = /^[=+@\-\t\r]/.test(text) ? "'" + text : text;
    return '"' + safe.replace(/"/g, '""') + '"';
  };
  const header = ["master_id", "domain", "title", "linkage_state", "candidate_identities", "identity_approval", "lifecycle", "engine_absence_proven", "mapping_approved", "publication_authorized", "certification_authorized"];
  return [header, ...report.rows.map(row => [row.masterId, row.domain, row.title, row.linkageState, row.candidates,
    row.identityApproval, row.lifecycle, row.engineAbsenceProven, row.mappingApproved,
    row.publicationAuthorized, row.certificationAuthorized])].map(row => row.map(cell).join(",")).join("\r\n") + "\r\n";
}
