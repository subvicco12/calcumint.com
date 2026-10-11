import type { CalculatorDefinition } from "./types";

export type PublishedCalculatorManifestEntry = {
  calculator_key: string;
  slug: string;
  version: number;
};

/** Validate the entire minimal RPC payload; ambiguous identities cannot authorize routes. */
export function parsePublishedCalculatorManifest(value: unknown): readonly PublishedCalculatorManifestEntry[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const bySlug = new Map<string, PublishedCalculatorManifestEntry>();
  const byKey = new Map<string, string>();
  for (const row of value) {
    if (!row || typeof row !== "object" || Array.isArray(row)) return undefined;
    const { calculator_key, slug, version } = row as Record<string, unknown>;
    if (typeof calculator_key !== "string" || !calculator_key.trim() || calculator_key !== calculator_key.trim() ||
        typeof slug !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ||
        typeof version !== "number" || !Number.isSafeInteger(version) || version < 1) return undefined;
    const previous = bySlug.get(slug);
    if (previous && (previous.calculator_key !== calculator_key || previous.version !== version)) return undefined;
    const previousSlug = byKey.get(calculator_key);
    if (previousSlug !== undefined && previousSlug !== slug) return undefined;
    bySlug.set(slug, { calculator_key, slug, version });
    byKey.set(calculator_key, slug);
  }
  return [...bySlug.values()];
}

type RegistryCalculator = CalculatorDefinition<unknown, unknown>;

export function isRepositoryPublicationEligible(definition: RegistryCalculator | undefined): definition is RegistryCalculator {
  return Boolean(
    definition &&
    definition.reviewStatus === "certified" &&
    definition.formulas.length > 0 &&
    definition.examples.length > 0 &&
    definition.sources.length > 0
  );
}

export function composePublishedCalculatorSlugs(
  definitions: readonly RegistryCalculator[],
  manifest: readonly PublishedCalculatorManifestEntry[]
): ReadonlySet<string> {
  const parsed = parsePublishedCalculatorManifest(manifest);
  if (!parsed) return new Set();
  const manifestBySlug = new Map(parsed.map((entry) => [entry.slug, entry]));
  const published = new Set<string>();

  for (const definition of definitions) {
    if (!isRepositoryPublicationEligible(definition)) continue;
    const entry = manifestBySlug.get(definition.slug);
    if (!entry) continue;
    if (entry.calculator_key !== definition.id || entry.version !== definition.version) continue;
    published.add(definition.slug);
  }

  return published;
}
