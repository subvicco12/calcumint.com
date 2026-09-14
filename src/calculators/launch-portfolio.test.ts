import { describe,expect,it } from "vitest";
import { launchDefinitions,launchSpecs } from "./launch-portfolio";
import { runCalculator } from "./engine";
import { listPublicCalculators } from "./public-content";
describe("B11 launch portfolio",()=>{
 it("ships at least 100 new certified calculators",()=>{expect(launchSpecs.length).toBeGreaterThanOrEqual(100);expect(launchDefinitions.every(x=>x.reviewStatus==="certified")).toBe(true);expect(new Set(launchSpecs.map(x=>x.slug)).size).toBe(launchSpecs.length)});
 it("keeps launch formulas in standard-risk categories",()=>{expect(launchDefinitions.every(x=>x.riskClass==="standard")).toBe(true)});
 it("executes every golden default vector deterministically",()=>{for(const definition of launchDefinitions){const example=definition.examples[0];const first=runCalculator(definition,example.input).output.result;const second=runCalculator(definition,example.input).output.result;expect(Number.isFinite(first),definition.slug).toBe(true);expect(first).toBe(second)}});
 it("publishes 100+ SEO-routable calculator pages",()=>{const pages=listPublicCalculators();expect(pages.length).toBeGreaterThanOrEqual(102);for(const page of pages){expect(page.intro.length).toBeGreaterThan(80);expect(page.faq.length).toBeGreaterThanOrEqual(2);expect(page.assumptions.length).toBeGreaterThanOrEqual(2);expect(page.keywords.length).toBeGreaterThanOrEqual(3)}});
});
