import { expect, it } from "vitest";
import { reconcilePublicationEvidence } from "./catalog-publication-evidence";
import type { CertificationQueueRow } from "./catalog-certification-queue";

const row = (masterId: number, slug: string | null, status: CertificationQueueRow["status"] = "registry-certified-unverified"): CertificationQueueRow =>
  ({ masterId, domain: "Math", title: "Example", status, registrySlug: slug, riskClass: "standard", registryReviewStatus: "certified", databaseCertificationVerified: false, publicationVerified: false });

it("matches independently supplied publication records without granting certification", () => {
  const result = reconcilePublicationEvidence([row(1, "example")], [{ slug: "example", calculatorKey: "math.example", version: 1, lifecycle: "published", publishedAt: "2026-10-14T00:00:00Z" }]);
  expect(result.matched).toBe(1);
  expect(result.rows[0].status).toBe("published-record-match");
});
it("fails closed for missing records, draft lifecycle and absent timestamps", () => {
  const result = reconcilePublicationEvidence([row(1,"missing"),row(2,"draft"),row(3,"undated")], [
    {slug:"draft",calculatorKey:"math.draft",version:1,lifecycle:"draft",publishedAt:null},
    {slug:"undated",calculatorKey:"math.undated",version:1,lifecycle:"published",publishedAt:null},
  ]);
  expect(result.unpublished).toBe(3);
});
it("holds ambiguous mappings and duplicate publication evidence", () => {
  const record = {slug:"duplicate",calculatorKey:"math.duplicate",version:1,lifecycle:"published",publishedAt:"2026-10-14T00:00:00Z"};
  const result = reconcilePublicationEvidence([row(1,null,"identity-hold"),row(2,"duplicate")],[record,record]);
  expect(result.identityHold).toBe(1);
  expect(result.conflicts).toBe(1);
});
it("rejects invalid versions and repeated catalog identities", () => {
  expect(() => reconcilePublicationEvidence([], [{slug:"a",calculatorKey:"a",version:0,lifecycle:"published",publishedAt:null}])).toThrow();
  expect(() => reconcilePublicationEvidence([row(1,"a"),row(1,"b")],[])).toThrow();
});
