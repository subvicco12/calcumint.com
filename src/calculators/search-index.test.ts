import { describe,expect,it } from "vitest";
import { listPublicCalculators } from "./public-content";
import { buildPublicCalculatorSearchIndex,findPublicCalculatorCandidates } from "./search-index";
const published=new Set(listPublicCalculators().map(x=>x.slug));
describe("public calculator search index",()=>{
 it("contains only explicitly published calculators",()=>{const index=buildPublicCalculatorSearchIndex(published);expect(index.length).toBeGreaterThan(0);for(const item of index)expect(item.href).toBe(`/calculators/${item.category}/${item.slug}`);});
 it("ranks deterministic keyword candidates",()=>{const hits=findPublicCalculatorCandidates("convert miles kilometers",published);expect(hits[0]?.slug).toBe("unit-conversion-calculator")});
 it("fails closed for an empty publication set",()=>{expect(buildPublicCalculatorSearchIndex(new Set())).toEqual([]);expect(findPublicCalculatorCandidates("loan",new Set())).toEqual([])});
 it("handles invalid limits safely",()=>{expect(findPublicCalculatorCandidates("percentage",published,0)).toEqual([]);expect(findPublicCalculatorCandidates("percentage",published,11)).toEqual([])});
});
