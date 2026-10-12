import {expect,it} from "vitest";
import {buildCatalogCertificationQueueReport} from "./catalog-certification-queue-report";

it("generates a complete fail-closed report without claiming certification or publication",()=>{
 const report=buildCatalogCertificationQueueReport('master_id,domain,title\n1,Math,Unmatched Example Calculator\n');
 expect(report.summary.totalMaster).toBe(1);
 expect(report.rows[0].status).toBe("implementation-missing");
 expect(report.summary.databaseCertificationVerified).toBe(0);
 expect(report.summary.publicationVerified).toBe(0);
 expect(report.csv).toContain('"database_certification_verified","publication_verified"');
 expect(report.csv).toContain('"false","false"');
 expect(Object.isFrozen(report.rows)).toBe(true);
});

it("escapes formula-like catalog titles in spreadsheet CSV without changing evidence",()=>{
 const report=buildCatalogCertificationQueueReport('master_id,domain,title\n1,Math,"=HYPERLINK(""evil"")"\n');
 expect(report.rows[0].title).toBe('=HYPERLINK("evil")');
 expect(report.csv).toContain('"\'=HYPERLINK(""evil"")"');
});

it("rejects malformed and duplicate canonical catalog identifiers",()=>{
 expect(()=>buildCatalogCertificationQueueReport("master_id,domain,title\n1,Math,One\n1,Math,Two\n")).toThrow();
});

it("runs against the complete canonical 540-entry catalog without inventing mapping approvals",async()=>{
 const {readFileSync}=await import("node:fs");
 const csv=readFileSync("data/catalog/master-catalog-2026.csv","utf8");
 const report=buildCatalogCertificationQueueReport(csv);
 expect(report.rows).toHaveLength(540);
 expect(report.summary.totalMaster).toBe(540);
 expect(Object.values(report.summary.counts).reduce((a,b)=>a+b,0)).toBe(540);
 expect(report.rows.every(row=>!row.databaseCertificationVerified&&!row.publicationVerified)).toBe(true);
});
