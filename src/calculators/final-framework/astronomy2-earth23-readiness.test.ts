import {describe,expect,it} from "vitest";
import {getCertificationCandidateContent,getPublicCalculatorContent} from "../public-content";
import {astronomyBatch2Definitions} from "../astronomy/catalog-batch-2";
import {earthScienceBatch2Definitions} from "../earth-science/catalog-batch-2";
import {earthScienceBatch3Definitions} from "../earth-science/catalog-batch-3";

describe("Astronomy 2 and Earth Science 2/3 draft readiness",()=>{
 const astronomy=[...astronomyBatch2Definitions];
 const earth=[...earthScienceBatch2Definitions,...earthScienceBatch3Definitions];
 const defs=[...astronomy,...earth];
 it("locks deterministic evidence while lifecycle remains draft and non-public",()=>{
  expect(astronomy).toHaveLength(1);
  expect(earth).toHaveLength(10);
  expect(defs).toHaveLength(11);
  for(const d of defs){
   expect(d.riskClass).toBe("standard");
   expect(d.reviewStatus).toBe("draft");
   expect(d.formulas?.length??0).toBeGreaterThan(0);
   expect(d.sources?.length??0).toBeGreaterThan(0);
   expect(d.sources.every(s=>Boolean(s.url))).toBe(true);
   expect(d.goldenTests?.length??0).toBeGreaterThan(0);
   expect(getPublicCalculatorContent(d.slug)).toBeUndefined();
   expect(getCertificationCandidateContent(d.slug)).toBeUndefined();
  }
 });
 it("locks authoritative external source families for the next editorial lane",()=>{
  expect(astronomy[0].sources.some(s=>s.label.includes("IAU"))).toBe(true);
  expect(astronomy[0].sources.some(s=>s.label.includes("NIST"))).toBe(true);
  expect(earth.every(d=>d.sources.some(s=>s.label.includes("USGS")||s.label.includes("NOAA")||s.label.includes("NIST")))).toBe(true);
 });
});
