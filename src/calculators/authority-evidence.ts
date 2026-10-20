import { z } from "zod";
import { adminRoles, qaCheckTypes, roleCanTransition } from "../lib/admin/publishing";
import { parseSanitizedDbEvidence } from "./sanitized-db-evidence";

const digest = z.string().regex(/^[a-f0-9]{64}$/);
const identity = { calculatorKey: z.string().regex(/^[a-z0-9][a-z0-9.-]*$/), slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), version: z.number().int().positive() };
const claim = {
  ...identity, authorityRole: z.enum(adminRoles), decision: z.enum(["approved", "HOLD", "rejected"]),
  decisionRef: digest, rationaleRef: digest, authorityRecordRef: digest,
  decidedAt: z.string().datetime(),
};
/** References are sanitized fingerprints, never proof of identity, role or authenticity. */
export const authorityEvidenceSchema = z.object({
  schemaVersion: z.literal(1),
  provenance: z.object({ evidenceId: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), receivedOn: z.string().date(), observedAt: z.string().datetime(), sourceArtifactRef: digest }).strict(),
  base: z.object({ evidenceId: z.string(), payloadSha256: digest }).strict(),
  waivers: z.array(z.object({ ...claim, checkType: z.enum(qaCheckTypes) }).strict()),
  sourceReviews: z.array(z.object({ ...claim, sourceRef: digest }).strict()),
}).strict();
export type AuthorityEvidence = z.infer<typeof authorityEvidenceSchema>;

/** Validate a supplemental observation without changing imported facts or publication gates. */
export function auditAuthorityEvidence(rawBase: unknown, rawSupplement?: unknown) {
  const base = parseSanitizedDbEvidence(rawBase);
  const supplement = rawSupplement === undefined ? null : authorityEvidenceSchema.parse(rawSupplement);
  if (supplement) {
    if (!base.provenance.payloadSha256 || supplement.base.evidenceId !== base.provenance.evidenceId || supplement.base.payloadSha256 !== base.provenance.payloadSha256) throw new Error("Authority evidence base binding mismatch");
    const observed = Date.parse(supplement.provenance.observedAt);
    if (observed > Date.parse(supplement.provenance.receivedOn + "T23:59:59.999Z") || (base.provenance.observedAt && observed < Date.parse(base.provenance.observedAt))) throw new Error("Authority evidence observation time conflict");
    const seen = new Set<string>();
    for (const [kind, records] of [["waiver", supplement.waivers], ["source", supplement.sourceReviews]] as const) {
      for (const record of records) {
        const row = base.rows.find(item => item.calculatorKey === record.calculatorKey && item.slug === record.slug && item.version === record.version);
        if (!row) throw new Error("Authority evidence exact identity mismatch");
        const target = "checkType" in record ? record.checkType : record.sourceRef;
        const key = JSON.stringify([kind, record.calculatorKey, record.slug, record.version, target]);
        if (seen.has(key)) throw new Error("Duplicate authority evidence target");
        seen.add(key);
        if (Date.parse(record.decidedAt) > observed) throw new Error("Authority evidence decision time conflict");
        if ("checkType" in record) {
          if (!row.qa?.some(item => item.checkType === record.checkType && item.status === "waived")) throw new Error("Authority evidence waiver target mismatch");
          if (record.authorityRole !== "owner" && record.authorityRole !== "admin") throw new Error("Authority evidence waiver role conflict");
        } else {
          if (!row.sources?.some(item => item.sourceRef === record.sourceRef)) throw new Error("Authority evidence source target mismatch");
          // Matches source_evidence_reviewer_update in migration 023 (owner/admin/reviewer).
          if (!roleCanTransition(record.authorityRole, "certified")) throw new Error("Authority evidence source review role conflict");
        }
      }
    }
  }
  const observations = base.rows.map(row => {
    const matches = (record: AuthorityEvidence["waivers"][number] | AuthorityEvidence["sourceReviews"][number]) => record.calculatorKey === row.calculatorKey && record.slug === row.slug && record.version === row.version;
    return {
      identity: { calculatorKey: row.calculatorKey, slug: row.slug, version: row.version },
      waivers: (row.qa ?? []).filter(item => item.status === "waived").map(item => ({ checkType: item.checkType, evidence: supplement?.waivers.find(record => matches(record) && record.checkType === item.checkType) ?? "UNKNOWN" as const })),
      sourceReviews: (row.sources ?? []).map(item => ({ sourceRef: item.sourceRef, evidence: supplement?.sourceReviews.find(record => matches(record) && record.sourceRef === item.sourceRef) ?? "UNKNOWN" as const })),
      qaCoverage: row.qa === null ? "UNKNOWN" : "DECLARED", sourceCoverage: row.sources === null ? "UNKNOWN" : "DECLARED",
    };
  });
  return { observations, provenance: supplement?.provenance ?? "UNKNOWN", recordedClaims: supplement ? supplement.waivers.length + supplement.sourceReviews.length : 0,
    unknownWaivers: observations.flatMap(item => item.waivers).filter(item => item.evidence === "UNKNOWN").length,
    unknownSourceReviews: observations.flatMap(item => item.sourceReviews).filter(item => item.evidence === "UNKNOWN").length,
    authorityStatus: supplement ? "RECORDED_REQUIRES_AUTHORIZED_REVIEW" : "UNKNOWN", authenticity: "UNKNOWN", releaseState: "HOLD", grantsCertification: false, grantsPublication: false } as const;
}
