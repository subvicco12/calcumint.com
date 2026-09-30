import {describe,expect,it} from "vitest";
import {dilutionCalculator,hardyWeinbergCalculator} from "./catalog-batch-2";
describe("Biology catalog batch 2",()=>{
 it("keeps both calculators draft and standard-risk",()=>{for(const d of [hardyWeinbergCalculator,dilutionCalculator]){expect(d.reviewStatus).toBe("draft");expect(d.riskClass).toBe("standard")}});
 it("computes Hardy-Weinberg frequencies",()=>{const r=hardyWeinbergCalculator.calculate({allelePFrequency:.6},{});expect(r.p2).toBeCloseTo(.36,12);expect(r.twoPq).toBeCloseTo(.48,12);expect(r.q2).toBeCloseTo(.16,12);expect(r.p2+r.twoPq+r.q2).toBeCloseTo(1,12)});
 it("computes dilution final and diluent volumes",()=>{expect(dilutionCalculator.calculate({stockConcentration:100,stockVolume:10,targetConcentration:10},{})).toMatchObject({finalVolume:100,diluentVolume:90})});
 it("rejects concentrating through the dilution contract",()=>{expect(()=>dilutionCalculator.inputSchema.parse({stockConcentration:10,stockVolume:10,targetConcentration:20})).toThrow()});
});
