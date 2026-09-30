import {describe,expect,it} from "vitest";
import {microbiologyDilutionCalculator} from "./catalog-batch-6";
describe("Biology catalog batch 6",()=>{
 it("keeps Microbiology Dilution draft and standard-risk",()=>{expect(microbiologyDilutionCalculator.reviewStatus).toBe("draft");expect(microbiologyDilutionCalculator.riskClass).toBe("standard")});
 it("reconstructs original CFU per mL",()=>{expect(microbiologyDilutionCalculator.calculate({colonyCount:50,dilution:0.0001,platedVolumeMl:0.1},{}).cfuPerMl).toBe(5000000)});
 it("rejects dilution above one",()=>{expect(()=>microbiologyDilutionCalculator.inputSchema.parse({colonyCount:50,dilution:10,platedVolumeMl:0.1})).toThrow()});
});
