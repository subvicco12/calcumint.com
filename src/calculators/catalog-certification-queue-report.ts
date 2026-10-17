import { parseMasterCatalogCsv } from "./catalog-csv-ingestion";
import { buildCatalogReconciliationReport } from "./catalog-reconciliation-report";
import { buildCatalogCertificationQueue } from "./catalog-certification-queue";
import { listCalculatorImplementationInventory } from "./implementation-inventory";

/** Offline planning report only. Neither a registry flag nor a catalog match grants certification or publication. */
export function buildCatalogCertificationQueueReport(
  masterCsv: string,
  options: Parameters<typeof buildCatalogReconciliationReport>[1] = {},
) {
  const master = parseMasterCatalogCsv(masterCsv);
  const inventory = listCalculatorImplementationInventory();
  const matches = buildCatalogReconciliationReport(master, options);
  const rows = buildCatalogCertificationQueue(matches.rows, inventory);
  const counts = {
    "registry-certified-unverified": 0,
    "registry-reviewed": 0,
    "registry-draft": 0,
    "identity-hold": 0,
    "implementation-missing": 0,
  };
  for (const row of rows) counts[row.status]++;
  const csvCell = (value: string | number | boolean | null) => {
    const text = value === null ? "" : String(value);
    // Protect spreadsheet consumers from formula-like master catalog titles.
    const safe = /^[=+@\-\t\r]/.test(text) ? "'" + text : text;
    return '"' + safe.replace(/"/g, '""') + '"';
  };
  const lines = [
    ["master_id","domain","title","queue_status","registry_slug","risk_class","registry_review_status","database_certification_verified","publication_verified"],
    ...rows.map(row=>[
      row.masterId,row.domain,row.title,row.status,row.registrySlug,row.riskClass,row.registryReviewStatus,
      row.databaseCertificationVerified,row.publicationVerified,
    ]),
  ];
  return Object.freeze({
    summary: Object.freeze({totalMaster: rows.length,totalRegistered: inventory.length,counts: Object.freeze(counts),databaseCertificationVerified:0,publicationVerified:0}),
    csv: lines.map(line=>line.map(csvCell).join(",")).join("\r\n")+"\r\n",
    rows,
  });
}
