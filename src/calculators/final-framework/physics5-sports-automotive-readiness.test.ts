import {describe,expect,it} from "vitest";
import {getCertificationCandidateContent,getPublicCalculatorContent} from "../public-content";
import {physicsMechanicsBatch5Definitions} from "../physics/catalog-batch-5";
import {sportsBatch1Definitions} from "../sports/catalog-batch-1";
import {automotiveTravelBatch1Definitions} from "../automotive/catalog-batch-1";

describe("Physics 5, Sports and Automotive draft readiness",()=>{
 const physics=[...physicsMechanicsBatch5Definitions],sports=[...sportsBatch1Definitions],automotive=[...automotiveTravelBatch1Definitions];
 const defs=[...physics,...sports,...automotive];
 it("locks deterministic evidence and non-public lifecycle",()=>{
  expect(defs).toHaveLength(14);
  for(const d of defs){
   expect(d.riskClass).toBe("standard");
   expect(d.reviewStatus).toBe("draft");
   expect(d.formulas?.length??0).toBeGreaterThan(0);
   expect(d.sources?.length??0).toBeGreaterThan(0);
   expect(d.goldenTests?.length??0).toBeGreaterThan(0);
   expect(getPublicCalculatorContent(d.slug)).toBeUndefined();
  }
 });
 it("records editorial and source-review blockers separately",()=>{
  expect([...physics,...automotive].filter(d=>!getCertificationCandidateContent(d.slug)).map(d=>d.slug)).toEqual([]);
  expect(sports.filter(d=>!getCertificationCandidateContent(d.slug)).map(d=>d.slug)).toEqual(sports.map(d=>d.slug));
  expect(sports.every(d=>d.sources.some(s=>!s.url))).toBe(true);
  expect(physics.every(d=>d.sources.every(s=>Boolean(s.url)))).toBe(true);
  expect(automotive.every(d=>d.sources.every(s=>Boolean(s.url)))).toBe(true);
 });
});
