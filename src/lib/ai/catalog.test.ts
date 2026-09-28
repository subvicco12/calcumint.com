import { describe,expect,it } from "vitest";
import { listPublicCalculators } from "../../calculators/public-content";
import { deterministicCalculatorSearch,publicCalculatorCatalog } from "./catalog";
const published=new Set(listPublicCalculators().map(x=>x.slug));
describe("AI catalog safety boundary",()=>{
 it("uses an explicit governed publication set",()=>{const catalog=publicCalculatorCatalog(published);expect(catalog.length).toBeGreaterThan(0);expect(publicCalculatorCatalog(new Set())).toEqual([])});
 it("routes deterministic finder queries without publication leakage",()=>{expect(deterministicCalculatorSearch("convert miles kilometers",published)[0]?.slug).toBe("unit-conversion-calculator");expect(deterministicCalculatorSearch("loan emi",new Set())).toEqual([])});
});
