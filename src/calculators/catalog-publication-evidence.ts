import type { CertificationQueueRow } from "./catalog-certification-queue";

/** Offline evidence only. Never grants certification, publication or route access. */
export type PublicationEvidence = Readonly<{
  slug: string;
  calculatorKey: string;
  version: number;
  lifecycle: string;
  publishedAt: string | null;
}>;

export type PublicationEvidenceResult = Readonly<{
  matched: number;
  unpublished: number;
  identityHold: number;
  conflicts: number;
  rows: readonly Readonly<{
    masterId: number;
    slug: string | null;
    status: "published-record-match" | "unpublished" | "identity-hold" | "conflict";
  }>[];
}>;

/**
 * Requires independently exported, non-personal DB evidence. A matching record
 * is not a certification assertion and cannot be consumed as runtime authority.
 */
export function reconcilePublicationEvidence(
  queue: readonly CertificationQueueRow[],
  evidence: readonly PublicationEvidence[],
): PublicationEvidenceResult {
  const bySlug = new Map<string, PublicationEvidence>();
  const conflicts = new Set<string>();
  for (const item of evidence) {
    if (!item.slug || !item.calculatorKey || !Number.isSafeInteger(item.version) || item.version < 1) {
      throw new Error("Invalid publication evidence");
    }
    if (bySlug.has(item.slug)) conflicts.add(item.slug);
    else bySlug.set(item.slug, item);
  }
  const seenMaster = new Set<number>();
  const rows = queue.map(row => {
    if (seenMaster.has(row.masterId)) throw new Error("Duplicate master catalog ID");
    seenMaster.add(row.masterId);
    const slug = row.registrySlug;
    let status: "published-record-match" | "unpublished" | "identity-hold" | "conflict";
    if (!slug || row.status === "identity-hold") status = "identity-hold";
    else if (conflicts.has(slug)) status = "conflict";
    else {
      const record = bySlug.get(slug);
      status = record && record.lifecycle === "published" && !!record.publishedAt
        ? "published-record-match" : "unpublished";
    }
    return Object.freeze({ masterId: row.masterId, slug, status });
  });
  return Object.freeze({
    matched: rows.filter(r => r.status === "published-record-match").length,
    unpublished: rows.filter(r => r.status === "unpublished").length,
    identityHold: rows.filter(r => r.status === "identity-hold").length,
    conflicts: rows.filter(r => r.status === "conflict").length,
    rows: Object.freeze(rows),
  });
}
