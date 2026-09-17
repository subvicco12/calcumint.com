import { describe,expect,it } from "vitest";
import { emergencyFundCalculator } from "./finance/emergency-fund";
import { loanAnalysisCalculator } from "./finance/loan-analysis";
import { savingsGoalCalculator } from "./finance/savings-goal";
import { simpleInterestCalculator } from "./finance/simple-interest";
import { roiCalculator } from "./finance/roi";
import { inflationCalculator } from "./finance/inflation";
import { rateConversionCalculator } from "./finance/rate-conversion";
import { netWorthCalculator } from "./finance/net-worth";
import { termDepositCalculator } from "./finance/term-deposit";
import { recurringDepositCalculator } from "./finance/recurring-deposit";
import { sipCalculator } from "./finance/sip";
import { stepUpSipCalculator } from "./finance/step-up-sip";
import { swpCalculator } from "./finance/swp";
import { loanRefinanceCalculator } from "./finance/loan-refinance";
import { loanPrepaymentCalculator } from "./finance/loan-prepayment";
import { loanComparisonCalculator } from "./finance/loan-comparison";
import { loanAffordabilityCalculator } from "./finance/loan-affordability";
import { creditCardPayoffCalculator } from "./finance/credit-card-payoff";

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
    expect(termDepositCalculator.ui?.advancedInputKeys).toEqual(["compoundingPerYear"]);
    expect(recurringDepositCalculator.ui?.advancedInputKeys).toEqual(["depositTiming"]);
    expect(sipCalculator.ui?.advancedInputKeys).toEqual(["contributionTiming"]);
    expect(stepUpSipCalculator.ui?.advancedInputKeys).toEqual(["contributionTiming"]);
    expect(swpCalculator.ui?.advancedInputKeys).toEqual(["withdrawalTiming"]);
    expect(loanRefinanceCalculator.ui?.advancedInputKeys).toEqual(["refinanceCosts"]);
    expect(loanPrepaymentCalculator.ui?.advancedInputKeys).toEqual(["prepaymentFee"]);
    expect(loanComparisonCalculator.ui?.simpleInputKeys).toEqual(["loanA","loanB"]);
    expect(loanAffordabilityCalculator.ui?.advancedInputKeys).toEqual(["existingMonthlyDebt","downPayment"]);
    expect(creditCardPayoffCalculator.ui?.advancedInputKeys).toEqual(["extraMonthlyPayment"]);
  });
  it("does not duplicate a field between Simple and Advanced modes",()=>{
    for(const definition of [loanAnalysisCalculator,savingsGoalCalculator,emergencyFundCalculator,simpleInterestCalculator,roiCalculator,inflationCalculator,rateConversionCalculator,netWorthCalculator,termDepositCalculator,recurringDepositCalculator,sipCalculator,stepUpSipCalculator,swpCalculator,loanRefinanceCalculator,loanPrepaymentCalculator,loanComparisonCalculator,loanAffordabilityCalculator,creditCardPayoffCalculator]){
      const simple=new Set(definition.ui?.simpleInputKeys??[]);
      for(const key of definition.ui?.advancedInputKeys??[])expect(simple.has(key),definition.slug).toBe(false);
    }
  });
});
