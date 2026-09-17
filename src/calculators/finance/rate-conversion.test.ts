import { describe,expect,it } from "vitest";
import { runCalculator } from "../engine";
import { convertAnnualRate,effectiveToNominalPercent,nominalToEffectivePercent,rateConversionCalculator } from "./rate-conversion";

describe("rate conversion",()=>{
  it("converts nominal monthly compounding to effective annual rate",()=>{expect(nominalToEffectivePercent(12,12)).toBeCloseTo(12.682503,5);});
  it("round trips nominal and effective rates",()=>{const effective=nominalToEffectivePercent(8.5,12);expect(effectiveToNominalPercent(effective,12)).toBeCloseTo(8.5,10);});
  it("keeps annual compounding unchanged",()=>{expect(convertAnnualRate({mode:"nominal-to-effective",annualNominalPercent:7,compoundsPerYear:1}).annualEffectivePercent).toBe(7);});
  it("supports valid negative rates",()=>{expect(nominalToEffectivePercent(-12,12)).toBeLessThan(0);});
  it("returns structured output through the engine",()=>{const result=runCalculator(rateConversionCalculator,{mode:"nominal-to-effective",annualNominalPercent:12,compoundsPerYear:12});expect(result.output.annualEffectivePercent).toBeCloseTo(12.682503,5);expect(result.calculatorId).toBe("finance.rate-conversion");});
});
