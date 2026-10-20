import { expect, it } from "vitest";
import { readFileSync } from "node:fs";
import type { buildMasterPublicationAudit } from "./master-publication-audit";
import { buildMasterIdentityCrosswalk, exportMasterIdentityCrosswalkCsv } from "./master-identity-crosswalk";
import { listCalculatorImplementationInventory } from "./implementation-inventory";

type Audit = ReturnType<typeof buildMasterPublicationAudit>;
const audit = JSON.parse(readFileSync("data/catalog/audit-2026-10-15/master-publication-audit.json", "utf8")) as Audit;
const inventory = listCalculatorImplementationInventory();
it("reconciles the complete portfolio without converting candidate counts into engine gaps or approvals", () => {
  const report = buildMasterIdentityCrosswalk(audit, inventory);
  expect(report.summary).toMatchObject({ totalMaster: 540, registryDefinitions: 574, singleCandidate: 291, multipleCandidates: 4, missingLinkage: 245, selectionDecisions: 249, reusedSlugs: 8, singleCandidateReusedSlugs: 6, approvedMappings: 0, provenMissingEngines: 0 });
  expect(report.domainBatches).toHaveLength(27);
  expect(report.domainBatches.reduce((sum, domain) => sum + domain.totalMaster, 0)).toBe(540);
  expect(report.rows.every(row => !row.mappingApproved && !row.publicationAuthorized && !row.certificationAuthorized && row.engineAbsenceProven === false)).toBe(true);
  expect(report.rows.find(row => row.masterId === 276)).toMatchObject({ identityApproval: "HOLD", lifecycle: { hold: "HOLD" } });
  expect(report.rows.find(row => row.masterId === 276)!.candidates.find(row => row.slug === "slope-calculator")!.version).toBe(2);
  expect(report.historyPolicy).toContain("v1");
});
it("is byte-deterministic across master, registry and candidate input ordering", () => {
  const reordered = structuredClone(audit);
  reordered.rows.reverse();
  reordered.rows.forEach(row => row.candidates.reverse());
  expect(buildMasterIdentityCrosswalk(reordered, [...inventory].reverse())).toEqual(buildMasterIdentityCrosswalk(audit, inventory));
});
it("fails closed on duplicate master or registry identities", () => {
  expect(() => buildMasterIdentityCrosswalk({ ...audit, rows: [...audit.rows, audit.rows[0]] }, inventory)).toThrow(/master/);
  expect(() => buildMasterIdentityCrosswalk(audit, [...inventory, inventory[0]])).toThrow(/registry/);
});
it("surfaces stale key/version evidence rather than rewriting current registry or historical evidence", () => {
  const changed = structuredClone(audit);
  const row = changed.rows.find(row => row.candidates.length === 1)!;
  row.candidates[0].version += 1;
  const before = JSON.stringify(changed);
  const report = buildMasterIdentityCrosswalk(changed, inventory);
  expect(report.rows.find(entry => entry.masterId === row.masterId)!.candidates[0].registryBinding).toBe("VERSION_CONFLICT");
  expect(report.rows.find(entry => entry.masterId === row.masterId)!.linkageState).toBe("REGISTRY_IDENTITY_CONFLICT");
  expect(JSON.stringify(changed)).toBe(before);
});
it("escapes CSV evidence and preserves each one-to-many candidate and exact technical version", () => {
  const report = buildMasterIdentityCrosswalk(audit, inventory);
  const output = exportMasterIdentityCrosswalkCsv(report);
  expect(output.split("\r\n")).toHaveLength(542);
  expect(output).toContain('"candidate_identities"');
  expect(output).toContain('"MAPPING_EVIDENCE_MISSING"');
  const changed = structuredClone(report);
  changed.rows[0].title = '=HYPERLINK("bad")';
  expect(exportMasterIdentityCrosswalkCsv(changed)).toContain("'=HYPERLINK");
});

it("retains missing registry evidence as a conflict, not an absent-engine verdict", () => {
  const row = audit.rows.find(row => row.candidates.length === 1)!;
  const report = buildMasterIdentityCrosswalk(audit, inventory.filter(entry => entry.slug !== row.candidates[0].slug));
  const missing = report.rows.find(entry => entry.masterId === row.masterId)!;
  expect(missing.candidates[0].registryBinding).toBe("NOT_IN_CURRENT_REGISTRY");
  expect(missing.engineAbsenceProven).toBe(false);
});
it("keeps all reused-slug scopes together and separates single-candidate reuse from competing power engines", () => {
  const report = buildMasterIdentityCrosswalk(audit, inventory);
  expect(report.reusedSlugs.find(row => row.slug === "power-calculator")!.masterIds).toEqual([222, 308]);
  expect(report.reusedSlugs.find(row => row.slug === "power-from-work-calculator")!.masterIds).toEqual([222, 308]);
  expect(report.summary.singleCandidateReusedSlugs).toBe(6);
  expect(report.summary.reusedSlugs).toBe(8);
  expect(report.rows.find(row => row.masterId === 222)!.linkageState).toBe("MULTIPLE_CANDIDATES");
});
it("rejects zero, unsafe or duplicate candidate technical versions and IDs", () => {
  const changed = structuredClone(audit);
  changed.rows.find(row => row.candidates.length)!.candidates[0].version = Number.MAX_SAFE_INTEGER + 1;
  expect(() => buildMasterIdentityCrosswalk(changed, inventory)).toThrow(/candidate/);
  const invalidRegistry = inventory.map((row, index) => index ? row : { ...row, version: 0 });
  expect(() => buildMasterIdentityCrosswalk(audit, invalidRegistry)).toThrow(/registry/);
});
