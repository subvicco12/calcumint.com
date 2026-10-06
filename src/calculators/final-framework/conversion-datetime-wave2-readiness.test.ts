import {describe,expect,it} from "vitest";
import {getCertificationCandidateContent,getPublicCalculatorContent} from "../public-content";
import {conversionBatch2Definitions} from "../conversion/catalog-batch-2";
import {conversionBatch3Definitions} from "../conversion/catalog-batch-3";
import {conversionBatch4Definitions} from "../conversion/catalog-batch-4";
import {dateTimeBatch2Definitions} from "../date-time/catalog-batch-2";
import {dateTimeBatch4Definitions} from "../date-time/catalog-batch-4";

describe("Conversion and Date/Time wave 2 draft readiness",()=>{
 const defs=[...conversionBatch2Definitions,...conversionBatch3Definitions,...conversionBatch4Definitions,...dateTimeBatch2Definitions,...dateTimeBatch4Definitions];
 it("locks deterministic evidence and non-public lifecycle",()=>{
  expect(defs).toHaveLength(18);
  for(const d of defs){
   expect(d.riskClass).toBe("standard");
   expect(d.reviewStatus).toBe("draft");
   expect(d.formulas?.length??0).toBeGreaterThan(0);
   expect(d.sources?.length??0).toBeGreaterThan(0);
   expect(d.goldenTests?.length??0).toBeGreaterThan(0);
   expect(getPublicCalculatorContent(d.slug)).toBeUndefined();
  }
 });
 it("requires complete candidate editorial content",()=>{
  const missing=defs.filter(d=>!getCertificationCandidateContent(d.slug)).map(d=>d.slug);
  expect(missing).toEqual([]);
 });
});
