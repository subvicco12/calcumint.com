import { describe,expect,it } from "vitest";
import { deterministicCalculatorSearch,publicCalculatorCatalog } from "./catalog";
describe("AI catalog safety boundary",()=>{
 it("uses the same certified-only catalog as public discovery",()=>{const catalog=publicCalculatorCatalog();expect(catalog.length).toBeGreaterThan(0);expect(catalog.some(x=>x.slug==="loan-emi-calculator")).toBe(false)});
 it("routes deterministic finder queries without draft leakage",()=>{expect(deterministicCalculatorSearch("convert miles kilometers")[0]?.slug).toBe("unit-conversion-calculator");expect(deterministicCalculatorSearch("loan emi").some(x=>x.slug==="loan-emi-calculator")).toBe(false)});
});
