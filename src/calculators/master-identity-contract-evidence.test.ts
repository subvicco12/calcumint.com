import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { expect, it } from "vitest";
import { calculatorRegistry } from "./registry";
import { buildMasterIdentityContractEvidence } from "./master-identity-contract-evidence";

const build = () => buildMasterIdentityContractEvidence(process.cwd());
it("attests nine existing implementation contracts across six cases without establishing master aliases", () => {
  const report = build();
  expect(report.summary).toEqual({ reviewCases: 6, masterIds: 7, implementationContracts: 9, mechanicallyProvedMasterAliases: 0, approvedMappings: 0, provenMissingEngines: 0 });
  expect(report.cases.flatMap(row => row.masterIds)).toEqual([55, 222, 308, 254, 377, 435, 510]);
  expect(report.cases.every(row => row.identityDecision === "UNKNOWN" && !row.aliasResolved && !row.implementationAuthorized)).toBe(true);
  for (const row of report.cases) for (const contract of row.contracts) {
    const engine = calculatorRegistry.getBySlug(contract.slug)!;
    expect(contract.registryBinding).toBe("EXACT_KEY_SLUG_VERSION");
    expect(contract.calculatorKey).toBe(engine.id);
    expect(contract.version).toBe(engine.version);
    expect(contract.definitionSource.sha256).toMatch(/^[a-f0-9]{64}$/);
    expect(contract.examples.length).toBeGreaterThan(0);
    expect(contract.inputSchema).toHaveProperty("properties");
  }
});
it("keeps label-only hints separate from existing candidate edges and retains HOLD provenance", () => {
  const report = build();
  for (const id of [55, 254, 435]) {
    const row = report.cases.find(row => row.masterIds.includes(id))!;
    expect(row.contracts.every(contract => contract.linkageEvidence === "LABEL_HINT_ONLY")).toBe(true);
    expect(row.candidateSlugs).toEqual([]);
    expect(row.masterContractStatus).toBe("NOT_SUPPLIED_BY_MASTER_TITLE_CSV");
  }
  for (const id of [222, 510]) {
    const row = report.cases.find(row => row.masterIds.includes(id))!;
    expect(row.existingHold).toBe(true);
    expect(row.contracts.every(contract => contract.existingReview?.decision === "hold")).toBe(true);
  }
});
it("records real contract differences despite matching nominal formula or title", () => {
  const contracts = build().cases.flatMap(row => row.contracts);
  const get = (slug: string) => contracts.find(row => row.slug === slug)!;
  expect(get("power-calculator").probes.find(row => row.label === "tiny positive time")?.schemaAccepted).toBe(true);
  expect(get("power-from-work-calculator").probes.find(row => row.label === "tiny positive time")?.schemaAccepted).toBe(false);
  expect(get("aspect-ratio-calculator").probes[0].schemaAccepted).toBe(false);
  expect(get("aspect-ratio-value-calculator").probes[0].schemaAccepted).toBe(true);
  expect(get("travel-time-calculator").unitScope).toContain("km/h");
  expect(get("time-from-distance-speed-calculator").unitScope).toContain("generic");
  expect(get("fuel-economy-calculator").probes[0].schemaAccepted).toBe(false);
  expect(get("root-finder-calculator").probes.some(row => row.schemaAccepted && row.execution === "REJECTED")).toBe(true);
});
it("reproduces committed evidence and leaves crosswalk and triage unchanged", () => {
  const paths = ["crosswalk.json", "review-triage.json"].map(name => `data/catalog/crosswalk-2026-10-20/${name}`);
  const before = paths.map(path => readFileSync(path, "utf8"));
  const report = build();
  expect(report).toEqual(build());
  expect(report).toEqual(JSON.parse(readFileSync("data/catalog/crosswalk-2026-10-20/contract-evidence.json", "utf8")));
  expect(paths.map(path => readFileSync(path, "utf8"))).toEqual(before);
});

it("fails closed for stale exact candidate bindings and label hint versions", () => {
  const report = build();
  const fixture = mkdtempSync(join(tmpdir(), "identity-contract-"));
  try {
    const paths = new Set([...report.provenance.map(row => row.path), ...report.cases.flatMap(row => row.contracts.map(contract => contract.definitionSource.path))]);
    for (const path of paths) {
      mkdirSync(dirname(join(fixture, path)), { recursive: true });
      cpSync(path, join(fixture, path));
    }
    const path = join(fixture, "data/catalog/crosswalk-2026-10-20/crosswalk.json");
    const original = readFileSync(path, "utf8");
    const crosswalk = JSON.parse(original);
    crosswalk.rows.find((row: { masterId: number }) => row.masterId === 222).candidates[0].version = 999;
    writeFileSync(path, JSON.stringify(crosswalk));
    expect(() => buildMasterIdentityContractEvidence(fixture)).toThrow(/Stale candidate identity/);
    writeFileSync(path, original);
    const triagePath = join(fixture, "data/catalog/crosswalk-2026-10-20/review-triage.json");
    const triageOriginal = readFileSync(triagePath, "utf8");
    const triage = JSON.parse(triageOriginal);
    triage.cases.find((row: { reviewCaseId: string }) => row.reviewCaseId === "master-scope:55").labelHints[0].version = 999;
    writeFileSync(triagePath, JSON.stringify(triage));
    expect(() => buildMasterIdentityContractEvidence(fixture)).toThrow(/Stale hint identity/);
    writeFileSync(triagePath, triageOriginal);
    writeFileSync(join(fixture, "src/calculators/finance/term-deposit.ts"), "// unrelated checkout");
    expect(() => buildMasterIdentityContractEvidence(fixture)).toThrow(/Source differs from loaded registry checkout/);
  } finally { rmSync(fixture, { recursive: true, force: true }); }
});
