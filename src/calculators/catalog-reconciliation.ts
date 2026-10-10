import type { CalculatorInventoryRecord } from "./implementation-inventory";

/**
 * Offline planning reconciliation only. Neither matching nor reviewStatus
 * authorizes DB publication, certification, specialist approval, or visibility.
 */
export type MasterCatalogRow = Readonly<{ masterId: number; domain: string; title: string }>;
export type CatalogMatch =
  | Readonly<{ masterId: number; domain: string; title: string; status: "exact" | "alias"; slug: string; evidence: "domain-title" | "explicit-alias" }>
  | Readonly<{ masterId: number; domain: string; title: string; status: "ambiguous"; candidates: readonly string[] }>
  | Readonly<{ masterId: number; domain: string; title: string; status: "unmatched" }>;

const normalize = (value: string) => value.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]/g, "");
const nameKey = (value: string) => normalize(value.replace(/\b(calculator|converter)\b/gi, ""));
const key = (domain: string, title: string) => `${normalize(domain)}:${nameKey(title)}`;

export function reconcileMasterCatalog(
  master: readonly MasterCatalogRow[],
  inventory: readonly CalculatorInventoryRecord[],
  options: Readonly<{
    /** Only reviewed aliases belong here; never infer mathematical equivalence from similar names. */
    aliases?: Readonly<Record<string, string>>;
    /** Explicitly map registry category labels to master domains. */
    categoryDomains?: Readonly<Record<string, string>>;
  }> = {},
): readonly CatalogMatch[] {
  const slugs = new Set<string>();
  const candidates = new Map<string, Set<string>>();
  for (const record of inventory) {
    if (slugs.has(record.slug)) throw new Error(`Duplicate registry slug: ${record.slug}`);
    slugs.add(record.slug);
    const domain = options.categoryDomains?.[record.category] ?? record.category;
    const k = key(domain, record.title);
    if (!candidates.has(k)) candidates.set(k, new Set());
    candidates.get(k)!.add(record.slug);
  }
  const ids = new Set<number>();
  return master.map((row) => {
    if (!Number.isSafeInteger(row.masterId) || row.masterId < 1 || ids.has(row.masterId)) {
      throw new Error(`Invalid or duplicate master ID: ${row.masterId}`);
    }
    ids.add(row.masterId);
    const common = { masterId: row.masterId, domain: row.domain, title: row.title };
    const k = key(row.domain, row.title);
    const exact = [...(candidates.get(k) ?? [])].sort();
    const alias = options.aliases?.[k];
    if (alias && !slugs.has(alias)) throw new Error(`Alias points to unknown registry slug: ${alias}`);
    if (alias && exact.length && !exact.includes(alias)) {
      return { ...common, status: "ambiguous" as const, candidates: [...new Set([...exact, alias])].sort() };
    }
    if (exact.length > 1) return { ...common, status: "ambiguous" as const, candidates: exact };
    if (exact.length === 1) return { ...common, status: "exact" as const, slug: exact[0], evidence: "domain-title" as const };
    if (alias) return { ...common, status: "alias" as const, slug: alias, evidence: "explicit-alias" as const };
    return { ...common, status: "unmatched" as const };
  });
}
