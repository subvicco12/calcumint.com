import {describe,expect,it} from "vitest";
import {auditLaunchCertificationDefinitions} from "../launch-certification";
import {calculatorRegistry} from "../registry";
import {getCertificationCandidateContent,getPublicCalculatorContent} from "../public-content";
import {technologyBatch1Definitions} from "../technology-computing/catalog-batch-1";
import {technologyBatch2Definitions} from "../technology-computing/catalog-batch-2";

describe("Technology reviewed certification readiness",()=>{
 const defs=[...technologyBatch1Definitions,...technologyBatch2Definitions];
 const slugs=new Set(defs.map(d=>d.slug));
 it("keeps all 20 candidates reviewed standard-risk and non-public",()=>{
  expect(defs).toHaveLength(20);
  for(const d of defs){
   expect(d.reviewStatus).toBe("reviewed");
   expect(d.riskClass).toBe("standard");
   expect(d.formulas?.length??0).toBeGreaterThan(0);
   expect(d.sources?.length??0).toBeGreaterThan(0);
   expect(d.goldenTests?.length??0).toBeGreaterThan(0);
   expect(getCertificationCandidateContent(d.slug)).toBeDefined();
   expect(getPublicCalculatorContent(d.slug)).toBeUndefined();
  }
 });
 it("passes repository certification artifacts under a hypothetical certified state without changing authority",()=>{
  const candidates=calculatorRegistry.list().filter(d=>slugs.has(d.slug)).map(d=>({...d,reviewStatus:"certified" as const}));
  expect(candidates).toHaveLength(20);
  expect(auditLaunchCertificationDefinitions(candidates,getCertificationCandidateContent,new Date("2100-01-01T00:00:00Z"))).toEqual([]);
 });
 it("keeps Technology editorial content free of Health/YMYL boilerplate",()=>{
  for(const d of defs){
   const content=getCertificationCandidateContent(d.slug);
   expect(content).toBeDefined();
   const serialized=JSON.stringify(content).toLowerCase();
   expect(serialized).not.toContain("health calculator");
   expect(serialized).not.toContain("individualized medical advice");
   expect(serialized).not.toContain("professional guidance for individual health decisions");
  }
 });
});
