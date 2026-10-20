import type { CatalogMatch } from "./catalog-reconciliation";
import type { CalculatorInventoryRecord } from "./implementation-inventory";

/**
 * Read-only prioritization evidence. Registry reviewStatus is not database
 * certification, specialist approval, or publication authority.
 */
export type CertificationQueueStatus =
  | "identity-hold"
  | "implementation-missing"
  | "registry-draft"
  | "registry-reviewed"
  | "registry-certified-unverified";

export type CertificationQueueRow = Readonly<{
  masterId: number;
  domain: string;
  title: string;
  status: CertificationQueueStatus;
  registrySlug: string | null;
  riskClass: CalculatorInventoryRecord["riskClass"] | null;
  registryReviewStatus: CalculatorInventoryRecord["reviewStatus"] | null;
  databaseCertificationVerified: false;
  publicationVerified: false;
}>;

export function buildCatalogCertificationQueue(
  matches: readonly CatalogMatch[],
  inventory: readonly CalculatorInventoryRecord[],
): readonly CertificationQueueRow[] {
  const bySlug = new Map<string, CalculatorInventoryRecord>();
  for (const record of inventory) {
    if (bySlug.has(record.slug)) throw new Error(`Duplicate registry slug: ${record.slug}`);
    bySlug.set(record.slug, record);
  }
  const ids = new Set<number>();
  return Object.freeze(matches.map(match => {
    if (ids.has(match.masterId)) throw new Error(`Duplicate master catalog ID: ${match.masterId}`);
    ids.add(match.masterId);
    const matched = match.status === "exact" || match.status === "alias";
    const definition = matched ? bySlug.get(match.slug) : undefined;
    // An unverified alias/exact identity must not be represented as certified.
    if (matched && !definition) throw new Error(`Missing registry definition: ${match.slug}`);
    const status: CertificationQueueStatus = match.status === "ambiguous"
      ? "identity-hold"
      : !matched
        ? "implementation-missing"
        : definition!.reviewStatus === "certified"
          ? "registry-certified-unverified"
          : definition!.reviewStatus === "reviewed"
            ? "registry-reviewed"
            : "registry-draft";
    return Object.freeze({
      masterId: match.masterId,
      domain: match.domain,
      title: match.title,
      status,
      registrySlug: definition?.slug ?? null,
      riskClass: definition?.riskClass ?? null,
      registryReviewStatus: definition?.reviewStatus ?? null,
      databaseCertificationVerified: false as const,
      publicationVerified: false as const,
    });
  }));
}
