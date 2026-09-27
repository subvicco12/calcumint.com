import type { CalculatorDefinition, CalculatorRuleMetadata } from "./types";

export type CatalogRuleMetadata = {
  jurisdiction: { country: string; region?: string };
  ruleVersion: string;
  effectiveFrom: string;
  effectiveTo?: string;
  taxYear?: string;
  officialSources: readonly { label: string; url: string }[];
  lastVerifiedAt: string;
};

function validDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

export function validateCalculatorRuleMetadata(metadata: CalculatorRuleMetadata): readonly string[] {
  const failures: string[] = [];
  if (!metadata.jurisdiction.country.trim()) failures.push("jurisdiction country is required");
  if (!metadata.ruleVersion.trim()) failures.push("rule version is required");
  if (!metadata.effectiveFrom || !validDate(metadata.effectiveFrom)) failures.push("valid effectiveFrom is required");
  if (metadata.effectiveTo && !validDate(metadata.effectiveTo)) failures.push("effectiveTo must be a valid date");
  if (metadata.effectiveFrom && metadata.effectiveTo && metadata.effectiveTo < metadata.effectiveFrom) failures.push("effectiveTo cannot precede effectiveFrom");
  if (!metadata.lastVerifiedAt || !validDate(metadata.lastVerifiedAt)) failures.push("valid lastVerifiedAt is required");
  if (!metadata.officialSources?.length) failures.push("at least one official source is required");
  else if (metadata.officialSources.some((source) => !source.label.trim() || !source.url?.trim())) failures.push("official sources require labels and URLs");
  return failures;
}

export function serializeRuleMetadata(metadata: CalculatorRuleMetadata): CatalogRuleMetadata {
  const failures = validateCalculatorRuleMetadata(metadata);
  if (failures.length) throw new Error(`Incomplete calculator rule metadata: ${failures.join("; ")}`);
  return {
    jurisdiction: {
      country: metadata.jurisdiction.country.trim().toUpperCase(),
      ...(metadata.jurisdiction.region?.trim() ? { region: metadata.jurisdiction.region.trim().toUpperCase() } : {})
    },
    ruleVersion: metadata.ruleVersion.trim(),
    effectiveFrom: metadata.effectiveFrom!,
    ...(metadata.effectiveTo ? { effectiveTo: metadata.effectiveTo } : {}),
    ...(metadata.taxYear?.trim() ? { taxYear: metadata.taxYear.trim() } : {}),
    officialSources: metadata.officialSources!.map((source) => ({ label: source.label.trim(), url: source.url!.trim() })),
    lastVerifiedAt: metadata.lastVerifiedAt!
  };
}

export function buildCatalogRegulatoryMetadata(definition: Pick<CalculatorDefinition<unknown, unknown>, "ruleMetadata">): {
  rulePackRequired: boolean;
  ruleMetadata: readonly CatalogRuleMetadata[];
} {
  const rules = definition.ruleMetadata ?? [];
  return { rulePackRequired: rules.length > 0, ruleMetadata: rules.map(serializeRuleMetadata) };
}
