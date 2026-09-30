import {describe,expect,it} from "vitest";
import {plantPopulationCalculator} from "./catalog-batch-4";
describe("Biology catalog batch 4",()=>{
 it("keeps Plant Population draft and standard-risk",()=>{expect(plantPopulationCalculator.reviewStatus).toBe("draft");expect(plantPopulationCalculator.riskClass).toBe("standard")});
 it("scales a one-thousandth-acre row sample",()=>{const r=plantPopulationCalculator.calculate({plantCount:30,sampleRowLengthFeet:17.424,rowSpacingInches:30},{});expect(r.plantsPerAcre).toBe(30000);expect(r.sampleAreaSquareFeet).toBe(43.56)});
 it("rejects zero sample length",()=>{expect(()=>plantPopulationCalculator.inputSchema.parse({plantCount:30,sampleRowLengthFeet:0,rowSpacingInches:30})).toThrow()});
});
