import { describe,expect,it } from "vitest";
import { buildPublicCalculatorSearchIndex,findPublicCalculatorCandidates } from "./search-index";
describe("public calculator search index",()=>{
 it("contains only certified public calculators",()=>{const index=buildPublicCalculatorSearchIndex();expect(index.length).toBeGreaterThan(0);for(const item of index)expect(item.href).toBe(`/calculators/${item.category}/${item.slug}`);expect(index.some(x=>x.slug==="loan-emi-calculator")).toBe(true)});
 it("ranks deterministic keyword candidates",()=>{const hits=findPublicCalculatorCandidates("convert miles kilometers");expect(hits[0]?.slug).toBe("unit-conversion-calculator")});
 it("handles empty queries and invalid limits safely",()=>{expect(findPublicCalculatorCandidates("")).toEqual([]);expect(findPublicCalculatorCandidates("percentage",0)).toEqual([])});
});
