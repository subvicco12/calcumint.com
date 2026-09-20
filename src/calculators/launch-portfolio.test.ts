import { describe,expect,it } from "vitest";
import { launchDefinitions,launchSpecs } from "./launch-portfolio";
import { runCalculator } from "./engine";
import { listPublicCalculators } from "./public-content";
describe("B11 launch portfolio",()=>{
 it("ships at least 100 new certified calculators",()=>{expect(launchSpecs.length).toBeGreaterThanOrEqual(100);expect(launchDefinitions.every(x=>x.reviewStatus==="certified")).toBe(true);expect(new Set(launchSpecs.map(x=>x.slug)).size).toBe(launchSpecs.length)});
 it("keeps launch formulas in standard-risk categories",()=>{expect(launchDefinitions.every(x=>x.riskClass==="standard")).toBe(true)});
 it("executes every golden default vector deterministically",()=>{for(const definition of launchDefinitions){const example=definition.examples[0];const first=runCalculator(definition,example.input).output.result;const second=runCalculator(definition,example.input).output.result;expect(Number.isFinite(first),definition.slug).toBe(true);expect(first).toBe(second)}});
 it("uses complete inputs for formerly normalized calculators",()=>{
  const cases=[
   ["trapezoid-area-calculator",{a:8,b:12,height:5},50],
   ["rectangular-prism-volume-calculator",{length:8,width:5,height:3},120],
   ["z-score-calculator",{value:85,mean:75,sd:10},1],
   ["heat-energy-calculator",{mass:2,specificHeat:4186,deltaT:10},83720]
  ] as const;
  for(const [slug,input,expected] of cases){const definition=launchDefinitions.find(x=>x.slug===slug)!;expect(runCalculator(definition,input).output.result).toBeCloseTo(expected,10)}
 });
 it("publishes 100+ SEO-routable calculator pages",()=>{const pages=listPublicCalculators();expect(pages.length).toBeGreaterThanOrEqual(108);for(const page of pages){expect(page.intro.length).toBeGreaterThan(80);expect(page.faq.length).toBeGreaterThanOrEqual(2);expect(page.assumptions.length).toBeGreaterThanOrEqual(2);expect(page.keywords.length).toBeGreaterThanOrEqual(3)}});
});
