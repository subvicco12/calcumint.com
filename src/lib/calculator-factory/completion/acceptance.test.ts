import { describe, expect, it } from "vitest";
import { assessCompletionReceipt, type CompletionReceipt, type CompletionEvidence } from "./acceptance";

function fixture(): CompletionReceipt {
  const identity = { catalogId: 218, engineId: "launch-square-calculator", slug: "square-calculator", version: 1 };
  const sourceSHA = "1".repeat(40);
  const evidence = (path: string): CompletionEvidence => ({ path, identity: { ...identity }, sourceSHA, sha256: "2".repeat(64) });
  const criteria = ["identity-scope", "native-feature-applicability", "formula-provenance-domain-precision", "three-plan-entitlements", "browser-interaction",
    "accessibility-recovery", "performance", "independent-review", "exact-source-ci"].map(id => ({
      id, source: "BP0655–0661", applicability: "required" as const, rationale: "Applies to the declared finite scalar delivery",
    }));
  return {
    sourceSHA, identity, scope: "scalar-personal-delivery", scopeStatement: "Finite binary64 scalar and personal saved-record delivery only",
    criteria: [...criteria, ...["team-client-sharing", "api", "embed", "automation"].map(id => ({
      id, source: "Master Catalog!K219", applicability: "outside-declared-scope" as const,
      rationale: "Native K remains pending; this receipt is explicitly limited to personal scalar delivery",
    }))],
    observations: criteria.map(row => ({ criterionId: row.id, passed: true, evidence: [evidence(`${row.id}.json`)] })),
    downloads: (["json", "csv", "pdf"] as const).map(format => ({ ...evidence(`download.${format}`), format,
      byteLength: 123, downloadedInBrowser: true, identityAndValuesReconciled: true })),
    persistence: (["free", "pro", "business"] as const).map(plan => ({ ...evidence(`replay-${plan}.json`), plan,
      created: true, reloaded: true, replayedOriginalVersion: true })),
  };
}

describe("completion evidence boundary", () => {
  it("admits a complete explicitly scoped receipt without granting human or release authority", () => {
    const result = assessCompletionReceipt(fixture());
    expect(result.failures).toEqual([]);
    expect(result.scopedEngineeringComplete).toBe(true);
    expect([result.fullEngineeringComplete, result.canonicalAccepted, result.certificationGranted, result.publicationEligible]).toEqual([false,false,false,false]);
  });
  it("rejects relabeling scalar proof as full engineering while native K is excluded", () => {
    const receipt = fixture(); receipt.scope = "full-engineering";
    expect(assessCompletionReceipt(receipt).failures).toContain("Missing required applicability: api");
  });
  it("rejects stale source and cross-calculator downloaded artifacts", () => {
    const receipt = fixture(); receipt.downloads[0].sourceSHA = "3".repeat(40);
    receipt.downloads[1].identity.catalogId = 219;
    expect(assessCompletionReceipt(receipt).failures).toEqual(expect.arrayContaining([
      "Missing or invalid actual download: json", "Missing or invalid actual download: csv",
    ]));
  });
  it("requires actual nonempty browser bytes and original-version persisted replay", () => {
    const receipt = fixture(); receipt.downloads[2].byteLength = 0;
    receipt.persistence[1].reloaded = false; receipt.persistence[2].replayedOriginalVersion = false;
    expect(assessCompletionReceipt(receipt).failures).toEqual(expect.arrayContaining([
      "Missing or invalid actual download: pdf", "Missing or invalid persisted replay: pro", "Missing or invalid persisted replay: business",
    ]));
  });
  it("refuses adapter-only proof missing review and accessibility", () => {
    const receipt = fixture(); receipt.observations = receipt.observations.filter(row => !["independent-review", "accessibility-recovery"].includes(row.criterionId));
    expect(assessCompletionReceipt(receipt).failures).toEqual(expect.arrayContaining([
      "Missing observation: independent-review", "Missing observation: accessibility-recovery",
    ]));
  });
  it("requires per-ID extra applicable criteria instead of ignoring manifest clauses", () => {
    const receipt = fixture(); receipt.criteria.push({ id: "reverse-branch", source: "Master Catalog!J219", applicability: "required", rationale: "Square inverse requires both branches" });
    expect(assessCompletionReceipt(receipt).failures).toContain("Missing observation: reverse-branch");
  });
  it("rejects unsupported exclusions and digestless evidence", () => {
    const receipt = fixture(); receipt.criteria[9].rationale = ""; receipt.observations[0].evidence[0].sha256 = "passed";
    expect(assessCompletionReceipt(receipt).failures).toEqual(expect.arrayContaining([
      "Unreasoned applicability: team-client-sharing", "Unproven criterion: identity-scope",
    ]));
  });
  it("rejects repeated proof rows masquerading as coverage", () => {
    const receipt = fixture(); receipt.observations.push(receipt.observations[0]); receipt.persistence.push(receipt.persistence[0]);
    expect(assessCompletionReceipt(receipt).failures).toEqual(expect.arrayContaining([
      "Duplicate or unknown observation: identity-scope", "Missing or invalid persisted replay: free",
    ]));
  });
});
