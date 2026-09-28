import type { CalculatorDefinition } from "./types";

export type PublishedCalculatorManifestEntry = {
  calculator_key: string;
  slug: string;
  version: number;
};

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
  const manifestBySlug = new Map(manifest.map((entry) => [entry.slug, entry]));
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
