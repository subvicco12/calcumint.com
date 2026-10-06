import {describe,expect,it} from "vitest";
import fs from "node:fs";
import path from "node:path";
import {engineeringConstructionBatch2Definitions} from "../engineering-construction/catalog-batch-2";
import {engineeringConstructionBatch3Definitions} from "../engineering-construction/catalog-batch-3";
import {technologyBatch1Definitions} from "../technology-computing/catalog-batch-1";
import {technologyBatch2Definitions} from "../technology-computing/catalog-batch-2";
import {technologyBatch3Definitions} from "../technology-computing/catalog-batch-3";
import {bmiCalculator} from "../health/bmi";
import {healthBatch1Definitions} from "../health/catalog-batch-1";
import {healthBatch2Definitions} from "../health/catalog-batch-2";

describe("legacy Final presentation lifecycle boundary",()=>{
 const engineering=[...engineeringConstructionBatch2Definitions,...engineeringConstructionBatch3Definitions];
 const technology=[...technologyBatch1Definitions,...technologyBatch2Definitions,...technologyBatch3Definitions];
 const health=[bmiCalculator,...healthBatch1Definitions,...healthBatch2Definitions];
 it("permits legacy Engineering presentation only while every fallback definition remains non-certified",()=>{
  expect(engineering).toHaveLength(17);
  expect(engineering.every(d=>d.reviewStatus==="reviewed")).toBe(true);
 });
 it("permits legacy Technology presentation only while every definition remains non-certified",()=>{
  expect(technology).toHaveLength(26);
  expect(technology.slice(0,20).every(d=>d.reviewStatus==="reviewed")).toBe(true);
  expect(technology.slice(20).every(d=>d.reviewStatus==="draft")).toBe(true);
 });
 it("permits legacy Health presentation only while every Health definition remains draft",()=>{
  expect(health).toHaveLength(15);
  expect(health.every(d=>d.riskClass==="health"&&d.reviewStatus==="draft")).toBe(true);
 });
 it("keeps the four lifecycle-blocked callers in the explicit legacy inventory",()=>{
  const source=fs.readFileSync(path.join(process.cwd(),"src/calculators/final-framework/legacy-final-presentation-convergence-inventory.test.ts"),"utf8");
  for(const caller of ["BmiReferenceTool","TechnologyTool","HealthTool","EngineeringTool"])expect(source).toContain(`"${caller}"`);
 });
});
