import {describe,expect,it} from "vitest";
import {getCertificationCandidateContent,getPublicCalculatorContent} from "../public-content";
import {foodCookingBatch1Definitions} from "../food/catalog-batch-1";
import {astronomyBatch1Definitions} from "../astronomy/catalog-batch-1";
import {earthScienceBatch1Definitions} from "../earth-science/catalog-batch-1";

describe("Food, Astronomy and Earth Science draft readiness",()=>{
 const food=[...foodCookingBatch1Definitions],astronomy=[...astronomyBatch1Definitions],earth=[...earthScienceBatch1Definitions];
 const defs=[...food,...astronomy,...earth];
 it("locks deterministic evidence and non-public lifecycle",()=>{
  expect(defs).toHaveLength(16);
  for(const d of defs){
   expect(d.riskClass).toBe("standard");
   expect(d.reviewStatus).toBe("draft");
   expect(d.formulas?.length??0).toBeGreaterThan(0);
   expect(d.sources?.length??0).toBeGreaterThan(0);
   expect(d.sources.every(s=>Boolean(s.url))).toBe(true);
   expect(d.goldenTests?.length??0).toBeGreaterThan(0);
   expect(getPublicCalculatorContent(d.slug)).toBeUndefined();
  }
 });
 it("records candidate editorial work without changing authority",()=>{
  expect(defs.filter(d=>!getCertificationCandidateContent(d.slug)).map(d=>d.slug)).toEqual([]);\n  expect(getCertificationCandidateContent("brine-salt-calculator")?.assumptions.join(" ").toLowerCase()).toContain("does not determine food preservation or safety");
  expect(food.find(d=>d.slug==="brine-salt-calculator")?.sources[0]?.label).toContain("USDA");
  expect(astronomy.some(d=>d.sources.some(s=>s.label.includes("NIST")))).toBe(true);
  expect(earth.some(d=>d.sources.some(s=>s.label.includes("USGS")))).toBe(true);
 });
});
