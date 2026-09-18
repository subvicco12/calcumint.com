import { describe,expect,it } from "vitest";
import { generateStaticParams } from "./page";
describe("calculator category static routes",()=>{it("generates only categories with certified public calculators",()=>{const categories=generateStaticParams().map(x=>x.category);expect(categories).toContain("math");expect(categories).not.toContain("finance-investment")})});
