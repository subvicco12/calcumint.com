import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, it } from "vitest";
import { parseMasterCatalogCsv } from "./catalog-csv-ingestion";
import { buildCatalogReconciliationReport } from "./catalog-reconciliation-report";
import { auditCatalogSlugReviewLedger, type CatalogSlugReview } from "./catalog-slug-review-ledger";
import { listCalculatorImplementationInventory } from "./implementation-inventory";
import { buildMasterPublicationAudit, exportMasterPublicationAuditCsv, type AnonymousCatalogSnapshot } from "./master-publication-audit";

it("reproduces all 540 rows from existing identity evidence and the anonymous observation", () => {
  const master = parseMasterCatalogCsv(readFileSync("data/catalog/master-catalog-2026.csv", "utf8"));
  const reviews = JSON.parse(readFileSync("data/catalog/mixed-category-review-ledger.partial.json", "utf8")) as CatalogSlugReview[];
  const reviewAudit = auditCatalogSlugReviewLedger(reviews);
  const domains = reviewAudit.approvedDomains;
  const matches = buildCatalogReconciliationReport(master, { slugDomains: domains });
  const snapshot = JSON.parse(readFileSync("data/catalog/audit-2026-10-15/anonymous-publication-snapshot.json", "utf8")) as AnonymousCatalogSnapshot;
  // Existing six-standard identity review ledger: these are retained decisions,
  // not new approvals or newly inferred master/engine equivalences.
  const holds = { 235: "graphing-calculator", 251: "function-plotter-2d", 275: "volume-calculator", 276: "slope-calculator", 282: "standard-deviation-calculator", 283: "variance-calculator" };
  const reviewCsv = readFileSync("data/catalog/evidence/six-standard-identity-review-ledger-2026-10-12.csv", "utf8");
  for (const [id, slug] of Object.entries(holds)) expect(reviewCsv.split(/\r?\n/).some(line => line.startsWith(`"${id}",`) && line.includes(`"${slug}"`) && line.endsWith('"HOLD"'))).toBe(true);
  const report = buildMasterPublicationAudit(master, listCalculatorImplementationInventory(), matches.rows, snapshot, holds, reviewAudit.held);
  expect(report.rows).toHaveLength(540);
  expect(report.rows.map(row => row.masterId)).toEqual(master.map(row => row.masterId).sort((a, b) => a - b));
  expect(Object.values(report.summary.counts).reduce((a, b) => a + b, 0)).toBe(540);
  expect(report.summary.explicitHolds).toBe(6);
  expect(report.rows.every(row => !row.publicationAuthorized && !row.certificationAuthorized)).toBe(true);
  const payload = {
    registryBaseline: "1368fb96a665a3803a4fbe81ee8dac0c2f71a90e", snapshot,
    mappingAuthority: "PROVISIONAL: existing reviewed partial domain ledger and title candidates; no new identity approvals",
    classificationDefinitions: {
      verified: "Complete master identity and protected certification/approval evidence; unavailable in this anonymous audit, therefore zero",
      missing: "Missing reviewed/title-candidate linkage evidence; NOT a proven missing implementation",
      ambiguous: "Unresolved candidate/domain/shared-title identity or database key conflict",
      "version conflict": "Same candidate key/slug has a different public database version",
      "approval pending": "Existing identity HOLD or provisional match awaiting authoritative protected decisions",
    },
    ...report, sixHeldIdentities: report.rows.filter(row => row.holdBasis === "explicit-master-review"),
    prioritizedBlockers: [...report.rows].sort((a, b) => a.priority.localeCompare(b.priority) || a.masterId - b.masterId)
      .map(({ masterId, priority, classification, nextAction }) => ({ masterId, priority, classification, nextAction })),
  };
  const json = JSON.stringify(payload, null, 2) + "\n";
  const csv = exportMasterPublicationAuditCsv(report);
  const destination = process.env.CALCUMINT_MASTER_AUDIT_OUT;
  if (destination) {
    const directory = resolve(destination);
    mkdirSync(directory, { recursive: true });
    writeFileSync(resolve(directory, "master-publication-audit.json"), json);
    writeFileSync(resolve(directory, "master-publication-audit.csv"), csv);
    writeFileSync(resolve(directory, "summary.json"), JSON.stringify(report.summary, null, 2) + "\n");
  } else {
    expect(readFileSync("data/catalog/audit-2026-10-15/master-publication-audit.json", "utf8")).toBe(json);
    expect(readFileSync("data/catalog/audit-2026-10-15/master-publication-audit.csv", "utf8")).toBe(csv);
    expect(JSON.parse(readFileSync("data/catalog/audit-2026-10-15/summary.json", "utf8"))).toEqual(report.summary);
  }
  console.info("MASTER_AUDIT_COUNTS", JSON.stringify(report.summary));
});
