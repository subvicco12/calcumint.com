import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { expect, it } from "vitest";
import { parseMasterCatalogCsv } from "./catalog-csv-ingestion";
import { auditCatalogSlugReviewLedger, type CatalogSlugReview } from "./catalog-slug-review-ledger";
import { buildCatalogReconciliationReport } from "./catalog-reconciliation-report";
import { buildMasterPublicationAudit, type AnonymousCatalogSnapshot } from "./master-publication-audit";
import { listCalculatorImplementationInventory } from "./implementation-inventory";
import { buildMasterIdentityCrosswalk, exportMasterIdentityCrosswalkCsv } from "./master-identity-crosswalk";

it("exports all 540 live-registry crosswalk rows and 27 bounded domain queues from existing evidence", () => {
  const masterSource = readFileSync("data/catalog/master-catalog-2026.csv", "utf8");
  const reviewSource = readFileSync("data/catalog/mixed-category-review-ledger.partial.json", "utf8");
  const snapshotSource = readFileSync("data/catalog/audit-2026-10-15/anonymous-publication-snapshot.json", "utf8");
  const previous = JSON.parse(readFileSync("data/catalog/audit-2026-10-15/master-publication-audit.json", "utf8")) as ReturnType<typeof buildMasterPublicationAudit>;
  const master = parseMasterCatalogCsv(masterSource);
  const review = auditCatalogSlugReviewLedger(JSON.parse(reviewSource) as CatalogSlugReview[]);
  const holds = Object.fromEntries(previous.rows.filter(row => row.holdBasis === "explicit-master-review").map(row => [row.masterId, row.candidateSlug!]));
  const matches = buildCatalogReconciliationReport(master, { slugDomains: review.approvedDomains });
  const inventory = listCalculatorImplementationInventory();
  const audit = buildMasterPublicationAudit(master, inventory, matches.rows, JSON.parse(snapshotSource) as AnonymousCatalogSnapshot, holds, review.held);
  const report = buildMasterIdentityCrosswalk(audit, inventory);
  expect(report.summary).toMatchObject({ totalMaster: 540, registryDefinitions: 574, missingLinkage: 245, singleCandidate: 291, multipleCandidates: 4, reusedSlugs: 8, singleCandidateReusedSlugs: 6 });
  expect(audit.summary.observedPublished).toBe(209); // Historical observation only, never current approval.
  const sha256 = (body: string) => createHash("sha256").update(body).digest("hex");
  const provenance = {
    authority: "Existing committed master catalog, partial domain-review ledger, identity HOLD evidence and live registry",
    masterCatalogSha256: sha256(masterSource), domainReviewSha256: sha256(reviewSource),
    historicalAnonymousSnapshot: { path: "data/catalog/audit-2026-10-15/anonymous-publication-snapshot.json", sha256: sha256(snapshotSource), observedIdentities: 209, currentDatabaseState: "UNKNOWN" },
    mappingApproval: "UNKNOWN", publicationAuthority: false, certificationAuthority: false,
  };
  const outputs = {
    "crosswalk.json": JSON.stringify({ provenance, ...report }, null, 2) + "\n",
    "crosswalk.csv": exportMasterIdentityCrosswalkCsv(report),
    "domain-batches.json": JSON.stringify({ provenance, domainBatches: report.domainBatches }, null, 2) + "\n",
    "summary.json": JSON.stringify({ provenance, summary: report.summary, reusedSlugs: report.reusedSlugs }, null, 2) + "\n",
  };
  const directory = process.env.CALCUMINT_CROSSWALK_OUT ?? "data/catalog/crosswalk-2026-10-20";
  if (process.env.CALCUMINT_CROSSWALK_OUT) mkdirSync(directory, { recursive: true });
  for (const [name, bytes] of Object.entries(outputs)) {
    if (process.env.CALCUMINT_CROSSWALK_OUT) writeFileSync(`${directory}/${name}`, bytes);
    else expect(readFileSync(`${directory}/${name}`, "utf8"), `Stale crosswalk export: ${name}`).toBe(bytes);
  }
});
