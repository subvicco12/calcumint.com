import {describe,expect,it} from "vitest";
import {punnettSquareCalculator} from "./catalog-batch-3";

describe("Biology catalog batch 3",()=>{
 it("keeps Punnett Square draft and standard-risk",()=>{expect(punnettSquareCalculator.reviewStatus).toBe("draft");expect(punnettSquareCalculator.riskClass).toBe("standard")});
 it("computes Aa x Aa genotype probabilities",()=>{const r=punnettSquareCalculator.calculate({parent1:"Aa",parent2:"Aa"},{});expect(r.offspring).toEqual(["AA","Aa","Aa","aa"]);expect(r.genotypeProbabilities).toEqual({AA:.25,Aa:.5,aa:.25})});
 it("rejects mixed-gene notation",()=>{expect(()=>punnettSquareCalculator.inputSchema.parse({parent1:"Aa",parent2:"Bb"})).toThrow()});
});
