import { describe, expect, it } from "vitest";
import { parseMasterCatalogCsv } from "./catalog-csv-ingestion";
import { buildCatalogReconciliationReport } from "./catalog-reconciliation-report";

describe("master catalog CSV ingestion", () => {
  it("accepts the canonical header and correctly parses quoted commas, escaped quotes, BOM and CRLF", () => {
    const rows = parseMasterCatalogCsv('\uFEFFmaster_id,domain,title\r\n1,"Math, Advanced","Rate ""Plus"" Calculator"\r\n2,Conversion,Length Converter\r\n');
    expect(rows).toEqual([
      { masterId: 1, domain: "Math, Advanced", title: 'Rate "Plus" Calculator' },
      { masterId: 2, domain: "Conversion", title: "Length Converter" },
    ]);
    const report = buildCatalogReconciliationReport(rows);
    expect(report.totalMaster).toBe(2);
    expect(report.exact + report.alias + report.ambiguous + report.unmatched).toBe(2);
  });

  it("rejects malformed quoting, extra columns, empty titles, duplicate IDs and invalid IDs", () => {
    const prefix = "master_id,domain,title\n";
    for (const input of [
      '1,Math,"unterminated',
      "1,Math,One,Extra",
      "1,Math,",
      "0,Math,Zero",
      "1,Math,One\n1,Math,Two",
      '1,Math,"Closed"bad',
    ]) expect(() => parseMasterCatalogCsv(prefix + input)).toThrow();
  });

  it("does not interpret catalog data as publication authorization", () => {
    const rows = parseMasterCatalogCsv("master_id,domain,title\n1,Health & Fitness,BMI Calculator\n");
    expect(rows[0]).not.toHaveProperty("published");
    expect(rows[0]).not.toHaveProperty("reviewStatus");
  });
});
