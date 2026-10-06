import {describe,expect,it} from "vitest";
import {getCertificationCandidateContent,getPublicCalculatorContent} from "../public-content";
import {biologyBatch1Definitions} from "../biology/catalog-batch-1";
import {biologyBatch2Definitions} from "../biology/catalog-batch-2";
import {biologyBatch3Definitions} from "../biology/catalog-batch-3";
import {biologyBatch4Definitions} from "../biology/catalog-batch-4";
import {biologyBatch5Definitions} from "../biology/catalog-batch-5";
import {biologyBatch6Definitions} from "../biology/catalog-batch-6";
import {biologyBatch7Definitions} from "../biology/catalog-batch-7";
import {biologyBatch8Definitions} from "../biology/catalog-batch-8";
import {biologyBatch9Definitions} from "../biology/catalog-batch-9";
import {biologyBatch10Definitions} from "../biology/catalog-batch-10";

describe("Biology draft readiness",()=>{
 const defs=[...biologyBatch1Definitions,...biologyBatch2Definitions,...biologyBatch3Definitions,...biologyBatch4Definitions,...biologyBatch5Definitions,...biologyBatch6Definitions,...biologyBatch7Definitions,...biologyBatch8Definitions,...biologyBatch9Definitions,...biologyBatch10Definitions];
 it("locks deterministic evidence and non-public lifecycle",()=>{
  expect(defs).toHaveLength(15);
  for(const d of defs){
   expect(d.riskClass).toBe("standard");
   expect(d.reviewStatus).toBe("draft");
   expect(d.formulas?.length??0).toBeGreaterThan(0);
   expect(d.sources?.length??0).toBeGreaterThan(0);
   expect(d.sources.every(s=>"url" in s && Boolean(s.url))).toBe(true);
   expect(d.goldenTests?.length??0).toBeGreaterThan(0);
   expect(getPublicCalculatorContent(d.slug)).toBeUndefined();
   expect(getCertificationCandidateContent(d.slug)).toBeDefined();
  }
 });
});
