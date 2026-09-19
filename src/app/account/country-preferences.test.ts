import { describe,expect,it } from "vitest";
import { getCountryProfile } from "@/calculators/country-intelligence";
describe("account country preference mapping",()=>{it("provides deterministic Wave 1 regional defaults",()=>{expect(getCountryProfile("IN")).toMatchObject({locale:"en-IN",currency:"INR",unitSystem:"metric"});expect(getCountryProfile("US")).toMatchObject({locale:"en-US",currency:"USD",unitSystem:"us"});expect(getCountryProfile("GB")).toMatchObject({locale:"en-GB",currency:"GBP"})})});
