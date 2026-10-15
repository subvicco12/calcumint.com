import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, it } from "vitest";
import { z } from "zod";
import { exportMasterPublicationAuditCsv, type buildMasterPublicationAudit } from "./master-publication-audit";
import { listCalculatorImplementationInventory } from "./implementation-inventory";
import { reconcileSanitizedDbEvidence, sanitizedDbEvidenceSchema } from "./sanitized-db-evidence";

const directory = "data/catalog/independent-db-evidence-2026-10-15";
it("reuses the prior 540-row audit without assigning aggregate QA/source facts to candidates", () => {
  const base = JSON.parse(readFileSync("data/catalog/audit-2026-10-15/master-publication-audit.json", "utf8")) as ReturnType<typeof buildMasterPublicationAudit>;
  const inputPath = process.env.CALCUMINT_SANITIZED_DB_EXPORT ?? `${directory}/supplied-aggregates.json`;
  const raw: unknown = JSON.parse(readFileSync(inputPath, "utf8"));
  const report = reconcileSanitizedDbEvidence(base, listCalculatorImplementationInventory(), raw);
  expect(report.rows).toHaveLength(540);
  expect(report.rows.map(entry => entry.masterId)).toEqual(base.rows.map(entry => entry.masterId));
  expect(report.rows.every(entry => !entry.publicationAuthorized && !entry.certificationAuthorized)).toBe(true);
  expect(report.rows.filter(entry => entry.holdBasis === "explicit-master-review")).toHaveLength(6);
  if (!process.env.CALCUMINT_SANITIZED_DB_EXPORT) {
    expect(report.importSummary.scope).toBe("aggregate-only");
    expect(report.importSummary.importedIdentities).toBe(0);
    expect(report.importSummary.registryIdentityMatches).toBe(0);
    expect(report.importSummary.masterRowsWithImportedIdentity).toBe(0);
    expect(report.importSummary.aggregateObservations).toEqual({ publishedIdentities: 209, riskClass: "standard", version: 1, qaIdentities: 209, qaChecks: 3135, qaPassed: 2299, qaWaived: 836, passedPerIdentity: 11, waivedPerIdentity: 4, sourceRecords: 210, sourceIdentities: 209 });
  }
  const facts = report.importSummary.aggregateObservations;
  const decisionLedger = {
    evidenceId: report.independentEvidence.provenance.evidenceId, grantsApprovals: false,
    aggregateFacts: report.importSummary.aggregateObservations,
    globalBlockers: [
      { priority: "P0", code: "ROW_EXPORT_REQUIRED", identities: facts.publishedIdentities, state: report.importSummary.populationIdentityCoverage === "COMPLETE_DECLARED" ? "REVIEW_REQUIRED" : "BLOCKED", nextAction: "Supply sanitized identity-keyed DB records, observation time and payload digest; aggregate totals cannot establish row joins" },
      { priority: "P0", code: "WAIVER_DECISIONS_REQUIRED", checks: facts.qaWaived, state: report.importSummary.missingRowExport ? "UNKNOWN" : "REVIEW_REQUIRED", nextAction: "Review actual check types, owner/admin authority-at-decision and hashed decision/rationale references; do not assume which four checks were waived" },
      { priority: "P0", code: "SOURCE_REVIEW_RECORDS_REQUIRED", records: facts.sourceRecords, identities: facts.sourceIdentities, state: report.importSummary.missingRowExport ? "UNKNOWN" : "REVIEW_REQUIRED", nextAction: "Supply per-identity structured source references and review evidence; cached counts or aggregate coverage do not identify records" },
      { priority: "P0", code: "CERTIFICATION_AND_SPECIALIST_EVIDENCE", state: "UNKNOWN", nextAction: "Separate published lifecycle, certification decisions, specialist scope, approved engine SHA/version and master mapping authority" },
      { priority: "P0", code: "SLOPE_AND_SIX_HOLDS", state: "HOLD", nextAction: "Retain six explicit and six candidate-linked HOLD rows; preserve historical Slope v1 and draft coordinate v2; published v1 aggregate cannot certify v2" },
    ],
    masterDecisions: report.rows.map(entry => ({ masterId: entry.masterId, classification: entry.classification, priority: entry.priority, hold: entry.hold, holdBasis: entry.holdBasis, nextAction: entry.nextAction, independentEvidence: entry.independentEvidence }))
      .sort((a, b) => a.priority.localeCompare(b.priority) || a.masterId - b.masterId),
  };
  const payload = { ...report, evidenceIntegrationBaseline: "ea2e70c975fe861c399dde10f636c361362a10fc", sixHeldIdentities: report.rows.filter(entry => entry.holdBasis === "explicit-master-review"), decisionLedger };
  const files = {
    "reconciled-master.json": JSON.stringify(payload, null, 2) + "\n",
    "reconciled-master.csv": exportMasterPublicationAuditCsv(report, {
      independentEvidenceId: report.rows.map(() => report.independentEvidence.provenance.evidenceId),
      independentRowEvidence: report.rows.map(entry => entry.independentEvidence),
    }),
    "summary.json": JSON.stringify({ baseline: report.summary, independent: report.importSummary }, null, 2) + "\n",
    "decision-ledger.json": JSON.stringify(decisionLedger, null, 2) + "\n",
    "sanitized-import.schema.json": JSON.stringify(z.toJSONSchema(sanitizedDbEvidenceSchema), null, 2) + "\n",
  };
  const destination = process.env.CALCUMINT_SANITIZED_EVIDENCE_OUT;
  if (destination) {
    mkdirSync(resolve(destination), { recursive: true });
    for (const [file, content] of Object.entries(files)) writeFileSync(resolve(destination, file), content);
  } else for (const [file, content] of Object.entries(files)) expect(readFileSync(`${directory}/${file}`, "utf8")).toBe(content);
  console.info("INDEPENDENT_EVIDENCE_COUNTS", JSON.stringify(report.importSummary));
});
