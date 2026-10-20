/** Offline Node-only evidence collection. Never import this module into application/client code. */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import { calculatorRegistry } from "./registry";
import type { buildMasterIdentityCrosswalk, buildIdentityEvidenceTriage } from "./master-identity-crosswalk";

type Probe = { label: string; input: Record<string, number> };
type ContractScope = { sourcePath: string; unitScope: string; scopeLimit: string; probes: Probe[] };
const scopes: Record<string, ContractScope> = {
  "fixed-term-deposit-calculator": {
    sourcePath: "src/calculators/finance/term-deposit.ts",
    unitScope: "Principal and maturity share currency units; annual rate and yield in percent; term in months; compounding events per year.",
    scopeLimit: "Compound deposit growth only; master CSV does not supply product terms, taxes or jurisdiction scope.",
    probes: [{ label: "unsupported compounding frequency", input: { principal: 1000, annualRatePercent: 5, termMonths: 12, compoundingPerYear: 3 } }],
  },
  "root-finder-calculator": {
    sourcePath: "src/calculators/advanced-math/catalog-batch-8.ts",
    unitScope: "Numeric polynomial coefficients and root coordinates; physical units unspecified.",
    scopeLimit: "Nonconstant polynomial up to degree three; bounded bisection, endpoint root or sign-changing bracket; not an arbitrary function solver.",
    probes: [{ label: "constant polynomial", input: { a: 0, b: 0, c: 0, d: 1, left: 0, right: 2 } },
      { label: "no sign-changing bracket", input: { a: 0, b: 1, c: 0, d: 1, left: -1, right: 1 } }],
  },
  "fuel-economy-calculator": {
    sourcePath: "src/calculators/automotive/catalog-batch-2.ts",
    unitScope: "distanceKm / fuelUsedLiters yields km/L.",
    scopeLimit: "Distance and fuel consumption calculation; no selectable fuel-economy unit conversion input.",
    probes: [{ label: "conversion-shaped input unsupported", input: { usMpg: 30 } }],
  },
  "power-calculator": {
    sourcePath: "src/calculators/physics/catalog-batch-1.ts",
    unitScope: "Work / time; numerical schema does not enforce SI unit labels.",
    scopeLimit: "Average physical power from work and positive time; does not establish Math ID 222 or full equivalence to the competing engine.",
    probes: [{ label: "tiny positive time", input: { work: 1, time: 1e-12 } }],
  },
  "power-from-work-calculator": {
    sourcePath: "src/calculators/launch-portfolio.ts",
    unitScope: "Work / time in generic compatible input units; no SI enforcement.",
    scopeLimit: "Time lower bound 1e-9 differs from physics.power; title and formula do not establish master scope.",
    probes: [{ label: "tiny positive time", input: { work: 1, time: 1e-12 } }],
  },
  "aspect-ratio-calculator": {
    sourcePath: "src/calculators/technology-computing/catalog-batch-1.ts",
    unitScope: "Dimensionless width / height for dimensions in compatible units.",
    scopeLimit: "Positive width and height, each bounded by 1e100; master selection still requires authority.",
    probes: [{ label: "zero width", input: { width: 0, height: 1080 } }],
  },
  "aspect-ratio-value-calculator": {
    sourcePath: "src/calculators/launch-portfolio.ts",
    unitScope: "Dimensionless width / height for dimensions in compatible units.",
    scopeLimit: "Nonnegative width; height lower bound 1e-9 differs from technology implementation.",
    probes: [{ label: "zero width", input: { width: 0, height: 1080 } }],
  },
  "travel-time-calculator": {
    sourcePath: "src/calculators/automotive/catalog-batch-1.ts",
    unitScope: "distanceKm in km / averageSpeedKmh in km/h yields hours.",
    scopeLimit: "Moving time only; excludes stops and delays; fixed units differ from generic competing implementation.",
    probes: [{ label: "generic input shape", input: { distance: 120, speed: 60 } }],
  },
  "time-from-distance-speed-calculator": {
    sourcePath: "src/calculators/launch-portfolio.ts",
    unitScope: "distance / speed in generic compatible units; no km or km/h enforcement.",
    scopeLimit: "Speed lower bound 1e-9; generic input names differ from fixed-unit travel engine.",
    probes: [{ label: "fixed-unit input shape", input: { distanceKm: 120, averageSpeedKmh: 60 } }],
  },
};

/** Attests current repository contracts only. Observations never create identity or lifecycle authority. */
export function buildMasterIdentityContractEvidence(repositoryRoot: string) {
  const read = (path: string) => readFileSync(join(repositoryRoot, path), "utf8");
  const provenance = (path: string) => ({ path, sha256: createHash("sha256").update(read(path)).digest("hex") });
  // Prevent hashing an unrelated checkout while executing this module's loaded registry.
  const loadedRoot = fileURLToPath(new URL("../../", import.meta.url));
  for (const path of ["src/calculators/registry.ts", ...Object.values(scopes).map(scope => scope.sourcePath)]) {
    if (read(path) !== readFileSync(join(loadedRoot, path), "utf8")) throw new Error(`Source differs from loaded registry checkout: ${path}`);
  }
  const triagePath = "data/catalog/crosswalk-2026-10-20/review-triage.json";
  const crosswalkPath = "data/catalog/crosswalk-2026-10-20/crosswalk.json";
  const crosswalk = JSON.parse(read(crosswalkPath)) as ReturnType<typeof buildMasterIdentityCrosswalk>;
  const ledgerPath = "data/catalog/mixed-category-review-ledger.partial.json";
  const triage = JSON.parse(read(triagePath)) as ReturnType<typeof buildIdentityEvidenceTriage>;
  const ledger = JSON.parse(read(ledgerPath)) as { slug: string; decision: string; inputContract: string; outputContract: string; sourcePath: string }[];
  const caseIds = ["master-scope:55", "master-scope:222+308", "master-scope:254", "master-scope:377", "master-scope:435", "master-scope:510"];
  const cases = caseIds.map(reviewCaseId => {
    const item = triage.cases.find(row => row.reviewCaseId === reviewCaseId);
    if (!item) throw new Error(`Missing reviewed identity case ${reviewCaseId}`);
    const slugs = [...item.candidateSlugs, ...item.labelHints.map(hint => hint.slug)].sort();
    const contracts = slugs.map(slug => {
      const definition = calculatorRegistry.getBySlug(slug);
      const scope = scopes[slug];
      if (!definition || !scope) throw new Error(`Missing reviewed contract ${slug}`);
      const hint = item.labelHints.find(row => row.slug === slug);
      const bindings = crosswalk.rows.filter(row => item.masterIds.includes(row.masterId))
        .flatMap(row => row.candidates.filter(candidate => candidate.slug === slug));
      if (!hint && (!bindings.length || bindings.some(binding => binding.calculatorKey !== definition.id || binding.version !== definition.version))) {
        throw new Error(`Stale candidate identity ${slug}`);
      }
      if (hint && (item.candidateSlugs.includes(slug) || bindings.length)) throw new Error(`Hint promoted to candidate ${slug}`);
      if (hint && (hint.calculatorKey !== definition.id || hint.version !== definition.version)) throw new Error(`Stale hint identity ${slug}`);
      const execute = (input: unknown) => {
        const parsed = definition.inputSchema.safeParse(input);
        if (!parsed.success) return { schemaAccepted: false, execution: "NOT_RUN" as const, output: null };
        try { return { schemaAccepted: true, execution: "RETURNED" as const, output: definition.calculate(parsed.data, {}) }; }
        catch { return { schemaAccepted: true, execution: "REJECTED" as const, output: null }; }
      };
      return {
        calculatorKey: definition.id, slug, version: definition.version,
        registryBinding: "EXACT_KEY_SLUG_VERSION" as const,
        linkageEvidence: hint ? "LABEL_HINT_ONLY" as const : "EXISTING_UNAPPROVED_CANDIDATE" as const,
        definitionSource: provenance(scope.sourcePath),
        inputSchema: z.toJSONSchema(definition.inputSchema, { unrepresentable: "any" }),
        schemaLimit: "JSON Schema is structural evidence; refinements and runtime rejection are additionally demonstrated by probes and source. It is not a complete executable contract.",
        formulas: definition.formulas, sources: definition.sources,
        unitScope: scope.unitScope, scopeLimit: scope.scopeLimit,
        examples: definition.examples.map(example => ({ label: example.label, input: example.input, ...execute(example.input) })),
        probes: scope.probes.map(probe => ({ ...probe, ...execute(probe.input) })),
        existingReview: ledger.find(row => row.slug === slug) ?? null,
      };
    });
    return {
      reviewCaseId, masterIds: item.masterIds, domains: item.domains, titles: item.titles,
      candidateSlugs: item.candidateSlugs, existingHold: item.existingHold,
      masterContractStatus: "NOT_SUPPLIED_BY_MASTER_TITLE_CSV" as const,
      contracts, identityDecision: "UNKNOWN" as const, aliasResolved: false as const,
      implementationAuthorized: false as const,
      blocker: "No explicit source-backed master key/slug/version alias binding or domain-qualified master input/output contract was supplied. Engine scope observations cannot supply that authority.",
    };
  });
  return {
    schemaVersion: 1,
    purpose: "Current-repository engine-contract observations for identity review; examples are not independent mathematical verification or master mapping proof.",
    provenance: [provenance(triagePath), provenance(crosswalkPath), provenance("data/catalog/master-catalog-2026.csv"), provenance(ledgerPath), provenance("src/calculators/registry.ts"), provenance("src/calculators/master-identity-contract-evidence.ts")],
    provenanceLimit: "Hashes attest listed files only, not the complete transitive source/build closure, deployment or external source validation.",
    summary: { reviewCases: cases.length, masterIds: cases.flatMap(row => row.masterIds).length,
      implementationContracts: new Set(cases.flatMap(row => row.contracts.map(contract => contract.slug))).size,
      mechanicallyProvedMasterAliases: 0, approvedMappings: 0, provenMissingEngines: 0 },
    cases,
  };
}
