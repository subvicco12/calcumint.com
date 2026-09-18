import {describe,expect,it} from "vitest";import {getPlanEntitlements,normalizePlan} from "./entitlements";
describe("plan entitlements",()=>{
 it("fails closed to Free for unknown plan values",()=>{expect(normalizePlan("enterprise")).toBe("free");expect(getPlanEntitlements(undefined).ads).toBe(true)});
 it("makes Pro personal intelligence ad-free without Business infrastructure",()=>{const e=getPlanEntitlements("pro");expect(e.ads).toBe(false);expect(e.projects).toBe(true);expect(e.scenarios).toBe(true);expect(e.exports).toBe(true);expect(e.businessStudio).toBe(false);expect(e.api).toBe(false)});
 it("keeps Business a strict capability superset of Pro",()=>{const p=getPlanEntitlements("pro"),b=getPlanEntitlements("business");for(const key of ["projects","scenarios","exports","aiExplanations"] as const)expect(b[key]).toBe(p[key]);expect(b.businessStudio).toBe(true);expect(b.api).toBe(true)});
 it("locks Free save limits",()=>{const e=getPlanEntitlements("free");expect(e.historyLimit).toBe(20);expect(e.favoritesLimit).toBe(10)});
});
