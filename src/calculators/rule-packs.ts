import type { CalculatorSource, JurisdictionRef, UnitSystem } from "./types";

export type RulePack = {
  id: string;
  jurisdiction: JurisdictionRef;
  ruleVersion: string;
  effectiveFrom: string;
  effectiveTo?: string;
  taxYear?: string;
  currency?: string;
  unitSystem?: UnitSystem;
  officialSources: readonly CalculatorSource[];
  lastVerifiedAt: string;
};

const registry = new Map<string, RulePack>();

function key(country: string, region?: string): string {
  return `${country.trim().toUpperCase()}:${region?.trim().toUpperCase() ?? "*"}`;
}

function validDate(value: string): boolean {
  if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

export function registerRulePack(pack: RulePack): void {
  if (!pack.id.trim() || !pack.ruleVersion.trim()) throw new Error("Rule pack id and version are required");
  if (!pack.jurisdiction.country.trim()) throw new Error("Rule pack country is required");
  if (!pack.officialSources.length || pack.officialSources.some((source)=>!source.url?.trim()||!source.label?.trim())) throw new Error("Rule packs require official source metadata");
  if (!validDate(pack.effectiveFrom) || (pack.effectiveTo && !validDate(pack.effectiveTo)) || !validDate(pack.lastVerifiedAt)) {
    throw new Error("Rule pack dates must use a valid YYYY-MM-DD calendar date");
  }
  if (pack.effectiveTo && pack.effectiveTo < pack.effectiveFrom) throw new Error("Rule pack effectiveTo cannot precede effectiveFrom");
  const bucket = key(pack.jurisdiction.country, pack.jurisdiction.region);
  const duplicate = listRulePacks(pack.jurisdiction).some((candidate) => candidate.id === pack.id && candidate.ruleVersion === pack.ruleVersion);
  if (duplicate) throw new Error(`Duplicate rule pack ${pack.id}@${pack.ruleVersion}`);
  registry.set(`${bucket}:${pack.id}:${pack.ruleVersion}`, Object.freeze({ ...pack }));
}

export function listRulePacks(jurisdiction?: JurisdictionRef): readonly RulePack[] {
  const packs = [...registry.values()];
  if (!jurisdiction) return packs;
  const country = jurisdiction.country.trim().toUpperCase();
  const region = jurisdiction.region?.trim().toUpperCase();
  return packs.filter((pack) => pack.jurisdiction.country.toUpperCase() === country && (region === undefined || pack.jurisdiction.region?.toUpperCase() === region));
}

export type RulePackSelection = {
  jurisdiction: JurisdictionRef;
  asOf: string;
  id?: string;
  ruleVersion?: string;
  taxYear?: string;
};

export function selectRulePack(selection: RulePackSelection): RulePack | undefined {
  if (!validDate(selection.asOf)) throw new Error("Rule-pack selection date must use a valid YYYY-MM-DD calendar date");
  return listRulePacks(selection.jurisdiction)
    .filter((pack) => (!selection.id || pack.id === selection.id)
      && (!selection.ruleVersion || pack.ruleVersion === selection.ruleVersion)
      && (!selection.taxYear || pack.taxYear === selection.taxYear)
      && pack.effectiveFrom <= selection.asOf
      && (!pack.effectiveTo || pack.effectiveTo >= selection.asOf))
    .sort((a, b) => b.effectiveFrom.localeCompare(a.effectiveFrom) || b.ruleVersion.localeCompare(a.ruleVersion))[0];
}

/** Test-only/reset utility. The production registry is populated explicitly by rule modules. */
export function clearRulePackRegistry(): void {
  registry.clear();
}
