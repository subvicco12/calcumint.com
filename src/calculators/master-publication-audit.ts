import type { MasterCatalogRow, CatalogMatch } from "./catalog-reconciliation";
import type { CalculatorInventoryRecord } from "./implementation-inventory";
import { buildCatalogIdentityCandidateReport } from "./catalog-identity-candidate-report";
import { parsePublishedCalculatorManifest } from "./publication-authority";

export type AnonymousCatalogSnapshot = Readonly<{
  manifestState: "available" | "unavailable";
  manifest: unknown;
}>;
export type MasterAuditStatus = "verified" | "missing" | "ambiguous" | "version conflict" | "approval pending";
export function buildMasterPublicationAudit(
  master: readonly MasterCatalogRow[], inventory: readonly CalculatorInventoryRecord[],
  matches: readonly CatalogMatch[], snapshot: AnonymousCatalogSnapshot,
  holds: Readonly<Record<number, string>> = {}, heldSlugs: readonly string[] = [],
) {
  const manifest = snapshot.manifestState === "available" ? parsePublishedCalculatorManifest(snapshot.manifest) : undefined;
  if (snapshot.manifestState === "available" && !manifest) throw new Error("Invalid publication manifest");
  const bySlug = new Map(inventory.map(row => [row.slug, row]));
  if (bySlug.size !== inventory.length || new Set(inventory.map(row => row.id)).size !== inventory.length) throw new Error("Duplicate registry identity");
  const matchMap = new Map(matches.map(row => [row.masterId, row]));
  if (matchMap.size !== matches.length || matches.length !== master.length) throw new Error("Incomplete or duplicate master matches");
  const ids = new Set<number>();
  for (const row of master) {
    if (!Number.isSafeInteger(row.masterId) || row.masterId < 1 || ids.has(row.masterId)) throw new Error("Invalid or duplicate master ID");
    ids.add(row.masterId);
    const match = matchMap.get(row.masterId);
    if (!match || match.title !== row.title || match.domain !== row.domain) throw new Error("Master match metadata mismatch");
  }
  if (Object.keys(holds).some(id => !ids.has(Number(id)))) throw new Error("Unknown held master ID");
  const published = new Map(manifest?.map(row => [row.slug, row]));
  const titleCandidates = new Map(buildCatalogIdentityCandidateReport(master, inventory).map(row => [row.masterId, row]));
  const candidateHolds = new Set(heldSlugs);
  const observe = (entry: CalculatorInventoryRecord) => {
    const db = published.get(entry.slug);
    const dbPublication = !manifest ? "UNKNOWN" : !db ? "NOT_IN_PUBLIC_MANIFEST"
      : db.calculator_key !== entry.id ? "KEY_CONFLICT"
      : db.version !== entry.version ? "VERSION_CONFLICT" : "OBSERVED_PUBLISHED";
    return { ...entry, dbPublication, observedDbKey: db?.calculator_key ?? null, observedDbVersion: db?.version ?? null };
  };
  const rows = [...master].sort((a, b) => a.masterId - b.masterId).map(row => {
    const match = matchMap.get(row.masterId)!;
    const title = titleCandidates.get(row.masterId)!;
    const slugs = new Set(title.candidates.map(candidate => candidate.slug));
    if (match.status === "exact" || match.status === "alias") slugs.add(match.slug);
    if (match.status === "ambiguous") match.candidates.forEach(slug => slugs.add(slug));
    if (holds[row.masterId]) slugs.add(holds[row.masterId]);
    const candidates = [...slugs].sort().map(slug => {
      const entry = bySlug.get(slug);
      if (!entry) throw new Error("Candidate missing from registry");
      return observe(entry);
    });
    const unique = candidates.length === 1 ? candidates[0] : null;
    const explicitMasterHold = Boolean(holds[row.masterId]);
    const candidateHold = candidates.some(candidate => candidateHolds.has(candidate.slug));
    const hold = explicitMasterHold || candidateHold ? "HOLD" : "UNKNOWN";
    const holdBasis = explicitMasterHold ? "explicit-master-review" : candidateHold ? "candidate-source-review" : "UNKNOWN";
    const matched = match.status === "exact" || match.status === "alias";
    let classification: MasterAuditStatus;
    let reason: string;
    if (!candidates.length) { classification = "missing"; reason = "No reviewed-match or exact-title candidate; implementation absence not proven"; }
    else if (unique?.dbPublication === "VERSION_CONFLICT") { classification = "version conflict"; reason = "Same public key/slug has a different engine version"; }
    else if (explicitMasterHold) { classification = "approval pending"; reason = "Explicit repository identity HOLD; protected decisions remain UNKNOWN"; }
    else if (!unique || unique.dbPublication === "KEY_CONFLICT" || match.status === "ambiguous" || title.disposition === "shared-slug-hold" || !matched) {
      classification = "ambiguous"; reason = "Competing/reused candidate, key conflict or unreviewed domain/title mapping";
    } else { classification = "approval pending"; reason = "Provisional source match; authoritative identity, certification and specialist decisions unavailable"; }
    const priority = hold === "HOLD" || classification === "version conflict" ? "P0"
      : classification === "missing" || classification === "ambiguous" ? "P1" : "P2";
    const nextAction = hold === "HOLD" ? "Retain HOLD; review exact master scope/identity and protected approval evidence"
      : classification === "version conflict" ? "Review version compatibility and authoritative DB identity; do not rewrite versions"
      : classification === "missing" ? "Review aliases and feature contracts; absence of a title candidate is not proof of missing engine"
      : classification === "ambiguous" ? "Adjudicate domain-qualified candidate identities and shared-title mappings without guessing"
      : "Obtain authorized identity, certification and applicable specialist evidence before release";
    return {
      ...row, classification, reason, priority, nextAction, mappingBasis: matched ? match.evidence : "candidate-only",
      candidateKey: unique?.id ?? null, candidateSlug: unique?.slug ?? null, candidateVersion: unique?.version ?? null,
      codeReviewStatus: unique?.reviewStatus ?? "UNKNOWN", hold, holdBasis,
      identityApproval: explicitMasterHold ? "HOLD" : "UNKNOWN", dbPublication: unique?.dbPublication ?? "UNKNOWN",
      observedDbKey: unique?.observedDbKey ?? null, observedDbVersion: unique?.observedDbVersion ?? null,
      dbCertification: "UNKNOWN", specialistApproval: "UNKNOWN", deployment: "UNKNOWN",
      publicationAuthorized: false, certificationAuthorized: false, candidates,
    };
  });
  const counts: Record<MasterAuditStatus, number> = { verified: 0, missing: 0, ambiguous: 0, "version conflict": 0, "approval pending": 0 };
  rows.forEach(row => counts[row.classification]++);
  const databaseOnly: string[] = [], keyConflicts: string[] = [], versionConflicts: string[] = [], codeNotCertified: string[] = [];
  let registryPublishedMatches = 0;
  for (const entry of manifest ?? []) {
    const definition = bySlug.get(entry.slug);
    if (!definition) databaseOnly.push(entry.slug);
    else if (definition.id !== entry.calculator_key) keyConflicts.push(entry.slug);
    else if (definition.version !== entry.version) versionConflicts.push(entry.slug);
    else { registryPublishedMatches++; if (definition.reviewStatus !== "certified") codeNotCertified.push(entry.slug); }
  }
  return { rows, summary: {
    totalMaster: rows.length, totalRegistered: inventory.length, counts,
    observedPublished: manifest ? manifest.length : null,
    registryPublishedMatches: manifest ? registryPublishedMatches : null,
    registryPublishedCodeCertified: manifest ? registryPublishedMatches - codeNotCertified.length : null,
    masterRowsWithPublishedCandidate: rows.filter(row => row.dbPublication === "OBSERVED_PUBLISHED").length,
    protectedCertificationUnknown: rows.length, specialistApprovalUnknown: rows.length,
    explicitHolds: rows.filter(row => row.holdBasis === "explicit-master-review").length,
    candidateHoldRows: rows.filter(row => row.holdBasis === "candidate-source-review").length,
    rowsWithAnyHold: rows.filter(row => row.hold === "HOLD").length,
    mismatches: { databaseOnly: databaseOnly.sort(), keyConflicts: keyConflicts.sort(), versionConflicts: versionConflicts.sort(), codeNotCertified: codeNotCertified.sort() },
    publicationAuthority: false, certificationAuthority: false,
  } };
}

export function exportMasterPublicationAuditCsv(report: ReturnType<typeof buildMasterPublicationAudit>, additionalColumns: Readonly<Record<string, readonly unknown[]>> = {}): string {
  const columns = ["masterId", "domain", "title", "classification", "reason", "priority", "nextAction", "mappingBasis", "candidateKey", "candidateSlug", "candidateVersion", "codeReviewStatus", "hold", "holdBasis", "identityApproval", "dbPublication", "observedDbKey", "observedDbVersion", "dbCertification", "specialistApproval", "deployment", "publicationAuthorized", "certificationAuthorized", "candidates"] as const;
  const cell = (value: unknown) => {
    const text = value === null ? "UNKNOWN" : typeof value === "object" ? JSON.stringify(value) : String(value);
    const safe = /^[=+@\-\t\r]/.test(text) ? "'" + text : text;
    return '"' + safe.replace(/"/g, '""') + '"';
  };
  const extra = Object.entries(additionalColumns);
  if (extra.some(([name, values]) => columns.some(column => column === name) || values.length !== report.rows.length)) throw new Error("Invalid additional CSV evidence columns");
  return [[...columns, ...extra.map(([name]) => name)].map(cell).join(","), ...report.rows.map((row, index) => [...columns.map(column => row[column]), ...extra.map(([, values]) => values[index])].map(cell).join(","))].join("\r\n") + "\r\n";
}
