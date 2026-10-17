import { describe, expect, it } from "vitest";
import imported from "../../data/catalog/independent-db-evidence-2026-10-15/sanitized-row-export.json";
import { auditAuthorityEvidence, type AuthorityEvidence } from "./authority-evidence";
import { parseSanitizedDbEvidence } from "./sanitized-db-evidence";
const base = parseSanitizedDbEvidence(imported);
function fixture(): AuthorityEvidence {
  const row = base.rows[0];
  const identity = { calculatorKey: row.calculatorKey, slug: row.slug, version: row.version };
  const claim = { ...identity, authorityRole: "owner" as const, decision: "approved" as const, decisionRef: "a".repeat(64), rationaleRef: "b".repeat(64), authorityRecordRef: "c".repeat(64), decidedAt: "2026-10-15T12:00:00Z" };
  return { schemaVersion: 1, provenance: { evidenceId: "synthetic-offline-only", receivedOn: "2026-10-15", observedAt: "2026-10-15T13:00:00Z", sourceArtifactRef: "d".repeat(64) }, base: { evidenceId: base.provenance.evidenceId, payloadSha256: base.provenance.payloadSha256! }, waivers: [{ ...claim, checkType: row.qa!.find(item => item.status === "waived")!.checkType }], sourceReviews: [{ ...claim, sourceRef: row.sources![0].sourceRef }] };
}
describe("supplemental authority observations (synthetic claims only)", () => {
  it("keeps all actual missing authority UNKNOWN and RELEASE HOLD", () => {
    const result = auditAuthorityEvidence(base);
    expect(result.unknownWaivers).toBe(836); expect(result.unknownSourceReviews).toBe(210);
    expect(result.recordedClaims).toBe(0); expect(result.authenticity).toBe("UNKNOWN"); expect(result.releaseState).toBe("HOLD");
    expect(result.grantsPublication).toBe(false); expect(result.grantsCertification).toBe(false);
  });
  it("records exact claims without asserting authenticity, approving, or modifying base", () => {
    const before = JSON.stringify(base), result = auditAuthorityEvidence(base, fixture());
    expect(result.recordedClaims).toBe(2); expect(result.unknownWaivers).toBe(835); expect(result.unknownSourceReviews).toBe(209);
    expect(result.authorityStatus).toBe("RECORDED_REQUIRES_AUTHORIZED_REVIEW"); expect(result.authenticity).toBe("UNKNOWN");
    expect(result.grantsPublication).toBe(false); expect(JSON.stringify(base)).toBe(before);
  });
  it("rejects stale base hashes, identity/version/slug changes and nonwaived targets", () => {
    const changes = [ (s: AuthorityEvidence) => { s.base.payloadSha256 = "f".repeat(64); }, (s: AuthorityEvidence) => { s.base.evidenceId += "-other"; }, (s: AuthorityEvidence) => { s.waivers[0].version++; }, (s: AuthorityEvidence) => { s.waivers[0].slug += "-other"; }, (s: AuthorityEvidence) => { s.waivers[0].calculatorKey += ".other"; }, (s: AuthorityEvidence) => { s.waivers[0].checkType = base.rows[0].qa!.find(q => q.status === "passed")!.checkType; }, (s: AuthorityEvidence) => { s.sourceReviews[0].sourceRef = "f".repeat(64); } ];
    for (const change of changes) { const s = fixture(); change(s); expect(() => auditAuthorityEvidence(base, s)).toThrow(); }
  });
  it("rejects duplicate claims, forbidden roles and contradictory timestamps", () => {
    const changes = [ (s: AuthorityEvidence) => { s.waivers.push(s.waivers[0]); }, (s: AuthorityEvidence) => { s.sourceReviews.push(s.sourceReviews[0]); }, (s: AuthorityEvidence) => { s.waivers[0].authorityRole = "reviewer"; }, (s: AuthorityEvidence) => { s.sourceReviews[0].authorityRole = "editor"; }, (s: AuthorityEvidence) => { s.waivers[0].decidedAt = "2026-10-16T12:00:00Z"; }, (s: AuthorityEvidence) => { s.provenance.receivedOn = "2026-10-14"; } ];
    for (const change of changes) { const s = fixture(); change(s); expect(() => auditAuthorityEvidence(base, s)).toThrow(); }
  });
  it("rejects private fields, UNKNOWN roles, absent references and explicit null supplements", () => {
    for (const target of ["root", "provenance", "base", "waiver", "source"]) {
      const s = fixture(); const obj = target === "root" ? s : target === "provenance" ? s.provenance : target === "base" ? s.base : target === "waiver" ? s.waivers[0] : s.sourceReviews[0];
      Object.assign(obj, { email: "synthetic@example.invalid" }); expect(() => auditAuthorityEvidence(base, s)).toThrow();
    }
    const s = fixture(); Object.assign(s.waivers[0], { authorityRole: "UNKNOWN", decisionRef: null }); expect(() => auditAuthorityEvidence(base, s)).toThrow();
    expect(() => auditAuthorityEvidence(base, null)).toThrow();
  });
  it("accepts historical decisions preceding the base snapshot as recorded claims only", () => {
    const historicalBase = structuredClone(base); historicalBase.provenance.observedAt = "2026-10-15T11:00:00Z";
    const s = fixture(); s.waivers[0].decidedAt = "2026-10-01T12:00:00Z";
    expect(auditAuthorityEvidence(historicalBase, s).authenticity).toBe("UNKNOWN");
  });
  it("binds shared source fingerprints to each exact identity", () => {
    const s = fixture(), target = s.sourceReviews[0];
    const other = base.rows.find(row => row.calculatorKey !== target.calculatorKey && row.sources?.some(source => source.sourceRef === target.sourceRef))!;
    s.sourceReviews.push({ ...target, calculatorKey: other.calculatorKey, slug: other.slug, version: other.version });
    expect(auditAuthorityEvidence(base, s).unknownSourceReviews).toBe(208);
  });
});
