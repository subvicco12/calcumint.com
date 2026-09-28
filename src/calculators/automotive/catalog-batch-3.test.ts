import { describe,expect,it } from "vitest";
import { automotiveEngineeringBatch2Definitions,engineHorsepowerCalculator,horsepowerCalculator,tireSizeCalculator } from "./catalog-batch-3";

describe("automotive engineering catalog batch 2",()=>{
 it("registers canonical IDs 474-476 as standard DRAFT",()=>{expect(automotiveEngineeringBatch2Definitions.map(d=>d.slug)).toEqual(["tire-size-calculator","horsepower-calculator","engine-horsepower-calculator"]);for(const d of automotiveEngineeringBatch2Definitions){expect(d.riskClass).toBe("standard");expect(d.reviewStatus).toBe("draft");expect(d.sources.length).toBeGreaterThan(0)}});
 it("calculates nominal tire diameter comparison",()=>{const r=tireSizeCalculator.calculate({currentWidthMm:225,currentAspectRatio:45,currentRimInches:17,newWidthMm:245,newAspectRatio:40,newRimInches:18},{});expect(r.currentDiameterMm).toBeCloseTo(634.3,10);expect(r.newDiameterMm).toBeCloseTo(653.2,10);expect(r.diameterDifferencePercent).toBeCloseTo(2.9796626202,10)});
 it("converts kW to mechanical horsepower",()=>{expect(horsepowerCalculator.calculate({kilowatts:100},{}).horsepower).toBeCloseTo(134.1022038490,10)});
 it("calculates engine horsepower from torque and rpm",()=>{expect(engineHorsepowerCalculator.calculate({torqueLbFt:400,rpm:5252},{}).horsepower).toBe(400)});
 it("rejects invalid physical inputs",()=>{expect(tireSizeCalculator.inputSchema.safeParse({currentWidthMm:225,currentAspectRatio:0,currentRimInches:17,newWidthMm:245,newAspectRatio:40,newRimInches:18}).success).toBe(false);expect(engineHorsepowerCalculator.inputSchema.safeParse({torqueLbFt:400,rpm:0}).success).toBe(false)});
});
