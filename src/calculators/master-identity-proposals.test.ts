import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { expect, it } from "vitest";
import type { buildMasterPublicationAudit } from "./master-publication-audit";
import { evidencePayloadDigest } from "./sanitized-db-evidence";
import { buildMasterIdentityProposals } from "./master-identity-proposals";

const audit = JSON.parse(readFileSync("data/catalog/audit-2026-10-15/master-publication-audit.json", "utf8")) as ReturnType<typeof buildMasterPublicationAudit>;
const evidence = JSON.parse(readFileSync("data/catalog/independent-db-evidence-2026-10-15/sanitized-row-export.json", "utf8"));
it("exports all master rows without inventing candidates, versions, or approval", () => {
  const report = buildMasterIdentityProposals(audit, evidence);
  expect(report.summary).toEqual({ total: 540, proposed: 283, unknown: 245, conflict: 0, holds: 12, explicitHolds: 6, candidateHolds: 6, approvedMappings: 0 });
  expect(audit.summary.counts).toEqual({ verified: 0, missing: 245, ambiguous: 174, "approval pending": 121, "version conflict": 0 });
  for (const row of report.rows) {
    const source = audit.rows.find(entry => entry.masterId === row.masterId)!;
    expect(row.candidates.map(c => [c.calculatorKey, c.slug, c.version]).sort()).toEqual(source.candidates.map(c => [c.id, c.slug, c.version]).sort());
    expect(row.mappingApproved || row.publicationAuthorized || row.certificationAuthorized).toBe(false);
  }
  expect(buildMasterIdentityProposals({ ...audit, rows: [...audit.rows].reverse() }, evidence)).toEqual(report);
  const output = JSON.stringify(report, null, 2) + "\n";
  if (process.env.CALCUMINT_IDENTITY_PROPOSALS_OUT) {
    mkdirSync(process.env.CALCUMINT_IDENTITY_PROPOSALS_OUT, { recursive: true });
    writeFileSync(`${process.env.CALCUMINT_IDENTITY_PROPOSALS_OUT}/proposals.json`, output);
  } else expect(readFileSync("data/catalog/identity-proposals-2026-10-15/proposals.json", "utf8")).toBe(output);
});
it("surfaces DB key and version discrepancies without rewriting registry identity", () => {
  const changed = structuredClone(evidence);
  const slug = audit.rows.flatMap(row => row.candidates).find(c => evidence.rows.some((db: { slug: string }) => db.slug === c.slug))!.slug;
  const db = changed.rows.find((row: { slug: string }) => row.slug === slug);
  db.version = 2;
  // Tampered payloads fail integrity checks before ranking.
  expect(() => buildMasterIdentityProposals(audit, changed)).toThrow();
  changed.provenance.payloadSha256 = evidencePayloadDigest(changed.aggregates, changed.rows);
  // Complete-population aggregate version remains v1, so a v2 row is rejected too.
  expect(() => buildMasterIdentityProposals(audit, changed)).toThrow();
});

it("routes a valid immutable-key discrepancy into conflict without promoting mappings", () => {
  const changed = structuredClone(evidence);
  const slug = audit.rows.filter(row => row.hold !== "HOLD").flatMap(row => row.candidates).find(c => evidence.rows.some((db: { slug: string }) => db.slug === c.slug))!.slug;
  changed.rows.find((row: { slug: string }) => row.slug === slug).calculatorKey = "review.synthetic-conflict";
  changed.provenance.payloadSha256 = evidencePayloadDigest(changed.aggregates, changed.rows);
  const report = buildMasterIdentityProposals(audit, changed);
  expect(report.rows.some(row => row.state === "conflict" && row.candidates.some(c => c.slug === slug && c.dbIdentity === "KEY_CONFLICT"))).toBe(true);
  expect(report.summary.approvedMappings).toBe(0);
});
it("rejects duplicate master IDs and invalid candidate versions", () => {
  expect(() => buildMasterIdentityProposals({ ...audit, rows: [...audit.rows, audit.rows[0]] }, evidence)).toThrow("duplicate master");
  const invalid = structuredClone(audit);
  invalid.rows.find(row => row.candidates.length)!.candidates[0].version = 0;
  expect(() => buildMasterIdentityProposals(invalid, evidence)).toThrow("candidate identity/version");
});
