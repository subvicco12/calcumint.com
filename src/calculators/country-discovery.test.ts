import { describe,expect,it } from "vitest";
import { getCountryDiscoveryProfile,listCertifiedCountryPriorities } from "./country-discovery";
describe("country discovery",()=>{
 it("never exposes draft country priorities",()=>{expect(listCertifiedCountryPriorities("IN").some(x=>x.slug==="loan-emi-calculator")).toBe(true);expect(listCertifiedCountryPriorities("IN").some(x=>x.slug==="sip-calculator")).toBe(false)});
 it("returns only routable certified items",()=>{for(const country of ["IN","US","GB","CA","AU"] as const){for(const item of listCertifiedCountryPriorities(country))expect(item.href).toBe(`/calculators/${item.category}/${item.slug}`)}});
 it("exposes explicit regional defaults without draft leakage",()=>{const india=getCountryDiscoveryProfile("IN");expect(india).toMatchObject({country:"IN",currency:"INR",locale:"en-IN",unitSystem:"metric"});expect(india?.items.some(x=>x.slug==="loan-emi-calculator")).toBe(true)});
});
