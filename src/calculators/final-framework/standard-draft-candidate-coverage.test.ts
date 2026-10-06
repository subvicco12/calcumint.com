import {describe,expect,it} from "vitest";
import {getCertificationCandidateContent,getPublicCalculatorContent} from "../public-content";
import {conversionBatch1Definitions} from "../conversion/catalog-batch-1";
import {dateTimeBatch1Definitions} from "../date-time/catalog-batch-1";

describe("standard-risk draft certification-candidate coverage",()=>{
 const families=[
  ["Conversion Batch 1",conversionBatch1Definitions],
  ["Date/Time Batch 1",dateTimeBatch1Definitions],
 ] as const;
 it("keeps audited families draft and non-public with complete editorial candidates",()=>{
  const missing:string[]=[];
  for(const [,defs] of families)for(const d of defs){
   expect(d.riskClass).toBe("standard");
   expect(d.reviewStatus).toBe("draft");
   expect(d.formulas?.length??0).toBeGreaterThan(0);
   expect(d.sources?.length??0).toBeGreaterThan(0);
   expect(d.goldenTests?.length??0).toBeGreaterThan(0);
   expect(getPublicCalculatorContent(d.slug)).toBeUndefined();
   if(!getCertificationCandidateContent(d.slug))missing.push(d.slug);
  }
  expect(missing).toEqual([]);
 });
});
