import {describe,expect,it} from "vitest";
import {angleConverter,conversionBatch2Definitions,energyConverter,powerConverter,pressureConverter,timeConverter} from "./catalog-batch-2";
describe("conversion catalog batch 2",()=>{
 it("keeps all five catalog calculators standard and DRAFT",()=>{expect(conversionBatch2Definitions.map(x=>x.slug)).toEqual(["pressure-converter","energy-converter","power-converter","time-converter","angle-converter"]);for(const d of conversionBatch2Definitions){expect(d.reviewStatus).toBe("draft");expect(d.riskClass).toBe("standard");expect(d.sources.length).toBeGreaterThan(0);expect(d.examples.length).toBeGreaterThan(0);}});
 it("converts deterministic reference values",()=>{expect(pressureConverter.calculate({value:1,fromUnit:"atm",toUnit:"kpa"},{}).result).toBe(101.325);expect(energyConverter.calculate({value:1,fromUnit:"kwh",toUnit:"mj"},{}).result).toBe(3.6);expect(powerConverter.calculate({value:1,fromUnit:"kw",toUnit:"w"},{}).result).toBe(1000);expect(timeConverter.calculate({value:2,fromUnit:"h",toUnit:"min"},{}).result).toBe(120);expect(angleConverter.calculate({value:180,fromUnit:"deg",toUnit:"rad"},{}).result).toBeCloseTo(Math.PI,11);});
 it("rejects units from another conversion family",()=>expect(pressureConverter.inputSchema.safeParse({value:1,fromUnit:"kg",toUnit:"pa"}).success).toBe(false));
});
