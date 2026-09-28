import { describe,expect,it } from "vitest";
import { getCountryDiscoveryProfile,listCertifiedCountryPriorities } from "./country-discovery";
describe("country discovery",()=>{
 const indiaPublished=new Set(["loan-emi-calculator","sip-calculator"]);
 it("fails closed when governed publication excludes repository-certified priorities",()=>{expect(listCertifiedCountryPriorities("IN",new Set())).toEqual([]);expect(listCertifiedCountryPriorities("IN",indiaPublished).some(x=>x.slug==="loan-emi-calculator")).toBe(true);expect(listCertifiedCountryPriorities("IN",indiaPublished).some(x=>x.slug==="sip-calculator")).toBe(true)});
 it("returns only routable governed items",()=>{for(const country of ["IN","US","GB","CA","AU"] as const){for(const item of listCertifiedCountryPriorities(country,new Set(["loan-emi-calculator","mortgage-payment"])))expect(item.href).toBe(`/calculators/${item.category}/${item.slug}`)}});
 it("exposes explicit regional defaults without publication leakage",()=>{const india=getCountryDiscoveryProfile("IN",indiaPublished);expect(india).toMatchObject({country:"IN",currency:"INR",locale:"en-IN",unitSystem:"metric"});expect(india?.items.some(x=>x.slug==="loan-emi-calculator")).toBe(true);expect(getCountryDiscoveryProfile("IN",new Set())?.items).toEqual([])});
});
