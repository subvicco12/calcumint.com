import { describe,expect,it } from "vitest";
import { emergencyFundCalculator } from "./finance/emergency-fund";
import { loanAnalysisCalculator } from "./finance/loan-analysis";
import { savingsGoalCalculator } from "./finance/savings-goal";
import { simpleInterestCalculator } from "./finance/simple-interest";
import { roiCalculator } from "./finance/roi";
import { inflationCalculator } from "./finance/inflation";
import { rateConversionCalculator } from "./finance/rate-conversion";
import { netWorthCalculator } from "./finance/net-worth";

describe("calculator Simple and Advanced metadata",()=>{
  it("keeps advanced fields separate from the default Simple experience",()=>{
    expect(loanAnalysisCalculator.ui?.simpleInputKeys).toEqual(["principal","annualRatePercent","termMonths"]);
    expect(loanAnalysisCalculator.ui?.advancedInputKeys).toEqual(["extraMonthlyPayment"]);
    expect(savingsGoalCalculator.ui?.advancedInputKeys).toEqual(["monthlyContribution"]);
    expect(emergencyFundCalculator.ui?.advancedInputKeys).toEqual(["buildMonths"]);
    expect(simpleInterestCalculator.ui?.simpleInputKeys).toEqual(["principal","annualRatePercent","years"]);
    expect(roiCalculator.ui?.advancedInputKeys).toEqual(["additionalCosts","incomeReceived"]);
    expect(inflationCalculator.ui?.advancedInputKeys).toBeUndefined();
    expect(rateConversionCalculator.ui?.simpleInputKeys).toContain("mode");
    expect(netWorthCalculator.ui?.simpleInputKeys).toEqual(["assets","liabilities"]);
  });
  it("does not duplicate a field between Simple and Advanced modes",()=>{
    for(const definition of [loanAnalysisCalculator,savingsGoalCalculator,emergencyFundCalculator,simpleInterestCalculator,roiCalculator,inflationCalculator,rateConversionCalculator,netWorthCalculator]){
      const simple=new Set(definition.ui?.simpleInputKeys??[]);
      for(const key of definition.ui?.advancedInputKeys??[])expect(simple.has(key),definition.slug).toBe(false);
    }
  });
});
