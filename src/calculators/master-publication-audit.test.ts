import { describe, expect, it } from "vitest";
import { buildMasterPublicationAudit, exportMasterPublicationAuditCsv } from "./master-publication-audit";
import type { CalculatorInventoryRecord } from "./implementation-inventory";
import type { CatalogMatch } from "./catalog-reconciliation";

const master = [{ masterId: 1, domain: "Math", title: "Example Calculator" }];
const inventory: CalculatorInventoryRecord[] = [{ id: "math.example", slug: "example-calculator", version: 1, title: "Example Calculator", category: "math", reviewStatus: "certified", riskClass: "standard" }];
const matches: CatalogMatch[] = [{ ...master[0], status: "exact", slug: "example-calculator", evidence: "domain-title" }];
const record = { calculator_key: "math.example", slug: "example-calculator", version: 1 };
describe("master publication audit never grants approvals", () => {
  it("keeps protected certification UNKNOWN even when the public identity matches", () => {
    const result = buildMasterPublicationAudit(master, inventory, matches, { manifestState: "available", manifest: [record] });
    expect(result.rows).toHaveLength(1);
    expect(result.rows[0].classification).toBe("approval pending");
    expect(result.rows[0].dbCertification).toBe("UNKNOWN");
    expect(result.rows[0].dbPublication).toBe("OBSERVED_PUBLISHED");
  });
  it("preserves unavailable evidence as UNKNOWN, not zero publication", () => {
    const result = buildMasterPublicationAudit(master, inventory, matches, { manifestState: "unavailable", manifest: [] });
    expect(result.summary.observedPublished).toBeNull();
    expect(result.rows[0].dbPublication).toBe("UNKNOWN");
  });
  it("distinguishes absent public evidence from a private unpublished decision", () => {
    const result = buildMasterPublicationAudit(master, inventory, matches, { manifestState: "available", manifest: [] });
    expect(result.rows[0].dbPublication).toBe("NOT_IN_PUBLIC_MANIFEST");
  });
  it("flags exact-key version conflicts without rewriting versions", () => {
    const result = buildMasterPublicationAudit(master, inventory, matches, { manifestState: "available", manifest: [{ ...record, version: 2 }] });
    expect(result.rows[0].classification).toBe("version conflict");
    expect(inventory[0].version).toBe(1);
  });
  it("retains explicit HOLD despite matching published identity", () => {
    const result = buildMasterPublicationAudit(master, inventory, matches, { manifestState: "available", manifest: [record] }, { 1: "example-calculator" });
    expect(result.rows[0].hold).toBe("HOLD");
    expect(result.rows[0].classification).toBe("approval pending");
  });
  it("never resolves competing title candidates by row order", () => {
    const result = buildMasterPublicationAudit(master, [...inventory, { ...inventory[0], id: "other.example", slug: "other-example" }], matches, { manifestState: "available", manifest: [record] });
    expect(result.rows[0].classification).toBe("ambiguous");
    expect(result.rows[0].candidates).toHaveLength(2);
  });
  it("rejects malformed public manifests rather than manufacturing empty evidence", () => {
    expect(() => buildMasterPublicationAudit(master, inventory, matches, { manifestState: "available", manifest: [{ ...record, version: 0 }] })).toThrow();
  });
  it("rejects duplicate master IDs", () => {
    expect(() => buildMasterPublicationAudit([...master, ...master], inventory, matches, { manifestState: "available", manifest: [] })).toThrow();
  });
  it("rejects duplicate registry identities and incomplete match sets", () => {
    expect(() => buildMasterPublicationAudit(master, [...inventory, ...inventory], matches, { manifestState: "available", manifest: [] })).toThrow();
    expect(() => buildMasterPublicationAudit(master, inventory, [], { manifestState: "available", manifest: [] })).toThrow();
  });
  it("retains existing candidate HOLD evidence without asserting a master approval", () => {
    const result = buildMasterPublicationAudit(master, inventory, [{ ...master[0], status: "unmatched" }], { manifestState: "available", manifest: [] }, {}, ["example-calculator"]);
    expect(result.rows[0].hold).toBe("HOLD");
    expect(result.rows[0].holdBasis).toBe("candidate-source-review");
    expect(result.rows[0].classification).toBe("ambiguous");
    expect(result.rows[0].identityApproval).toBe("UNKNOWN");
  });
  it("exports UNKNOWN explicitly and protects spreadsheet formula-like titles", () => {
    const input = [{ ...master[0], title: "=1+1" }];
    const result = buildMasterPublicationAudit(input, inventory, [{ ...matches[0], title: "=1+1" }], { manifestState: "unavailable", manifest: [] });
    const csv = exportMasterPublicationAuditCsv(result);
    expect(csv).toContain('"\'=1+1"');
    expect(csv).toContain('"UNKNOWN"');
    expect(csv).toContain('"false"');
  });
});
