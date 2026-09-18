import { describe,expect,it } from "vitest";
import sitemap from "./sitemap";
describe("public sitemap",()=>{it("contains calculator pages and only category hubs with published calculators",()=>{const urls=sitemap().map(x=>x.url);expect(urls.some(x=>x.endsWith("/calculators/math"))).toBe(true);expect(urls.some(x=>x.endsWith("/calculators/finance-investment"))).toBe(false);expect(urls.some(x=>x.includes("loan-emi-calculator"))).toBe(false)})});
