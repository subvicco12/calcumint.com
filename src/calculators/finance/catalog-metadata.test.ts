import { describe, expect, it } from "vitest";
import { loanRefinanceCalculator } from "./loan-refinance";
import { loanPrepaymentCalculator } from "./loan-prepayment";
import { loanComparisonCalculator } from "./loan-comparison";
import { loanAffordabilityCalculator } from "./loan-affordability";
import { debtPayoffCalculator } from "./debt-payoff";
import { creditCardPayoffCalculator } from "./credit-card-payoff";
import { rateConversionCalculator } from "./rate-conversion";
import { savingsGoalCalculator } from "./savings-goal";
import { roiCalculator } from "./roi";
import { netWorthCalculator } from "./net-worth";
import { inflationCalculator } from "./inflation";
import { emergencyFundCalculator } from "./emergency-fund";

const cases = [
  { definition: loanRefinanceCalculator, example: {"label": "Remove1% monthly interest:3.02 gross lesscost1 gives2.02;ceil1/1.51=1", "input": {"remainingBalance": 201, "currentAnnualRatePercent": 12, "currentRemainingMonths": 2, "newAnnualRatePercent": 0, "newTermMonths": 2, "refinanceCosts": 1}, "expected": {"currentMonthlyPayment": 102.01, "newMonthlyPayment": 100.5, "monthlyPaymentChange": -1.51, "currentRemainingInterest": 3.02, "newLoanInterest": 0, "refinanceCosts": 1, "grossInterestSavings": 3.02, "netLifetimeSavings": 2.02, "breakEvenMonths": 1}}, sourceAvailable: true },
  { definition: loanPrepaymentCalculator, example: {"label": "After one25 payment, prepay25 with fee2:75 to50, save one month", "input": {"principal": 100, "annualRatePercent": 0, "originalTermMonths": 4, "paymentsMade": 1, "lumpSumPrepayment": 25, "prepaymentFee": 2}, "expected": {"scheduledPayment": 25, "remainingBalanceBeforePrepayment": 75, "prepaymentApplied": 25, "remainingBalanceAfterPrepayment": 50, "remainingMonthsWithoutPrepayment": 3, "remainingMonthsAfterPrepayment": 2, "monthsSaved": 1, "remainingInterestWithoutPrepayment": 0, "remainingInterestAfterPrepayment": 0, "grossInterestSaved": 0, "prepaymentFee": 2, "netSavingsAfterFee": -2, "foreclosureAmount": 77}}, sourceAvailable: true },
  { definition: loanComparisonCalculator, example: {"label": "Equal zero-rate three-period loans retain unrounded total100", "input": {"loanA": {"principal": 100, "annualRatePercent": 0, "termMonths": 3, "upfrontCosts": 0}, "loanB": {"principal": 100, "annualRatePercent": 0, "termMonths": 3, "upfrontCosts": 0}}, "expected": {"loanA": {"monthlyPayment": 33.33, "totalInterest": 0, "upfrontCosts": 0, "totalCost": 100}, "loanB": {"monthlyPayment": 33.33, "totalInterest": 0, "upfrontCosts": 0, "totalCost": 100}, "monthlyPaymentDifference": 0, "totalCostDifference": 0, "lowerMonthlyPayment": "equal", "lowerTotalCost": "equal"}}, sourceAvailable: true },
  { definition: loanAffordabilityCalculator, example: {"label": "User target20% of1000 gives200 payment; zero-rate ten-month principal2000", "input": {"grossMonthlyIncome": 1000, "existingMonthlyDebt": 0, "targetDtiPercent": 20, "annualRatePercent": 0, "termMonths": 10, "downPayment": 0}, "expected": {"currentDtiPercent": 0, "maximumTotalMonthlyDebt": 200, "availableMonthlyLoanPayment": 200, "maximumLoanPrincipal": 2000, "maximumPurchasePrice": 2000, "modeledPaymentAtMaximumPrincipal": 200}}, sourceAvailable: true },
  { definition: debtPayoffCalculator, example: {"label": "Interest1 on A100; budget151 pays both debts in priority order avalanche", "input": {"debts": [{"name": "A", "balance": 100, "annualRatePercent": 12, "minimumPayment": 0}, {"name": "B", "balance": 50, "annualRatePercent": 0, "minimumPayment": 0}], "extraMonthlyPayment": 151, "strategy": "avalanche"}, "expected": {"strategy": "avalanche", "monthsToPayoff": 1, "totalInterest": 1, "totalPaid": 151, "startingBalance": 150, "payoffOrder": ["A", "B"]}}, sourceAvailable: false },
  { definition: creditCardPayoffCalculator, example: {"label": "Two1% periods on201 with102.01 payments:interest2.01+1.01=3.02", "input": {"balance": 201, "annualAprPercent": 12, "monthlyPayment": 102.01, "extraMonthlyPayment": 0}, "expected": {"payoffMonths": 2, "totalInterest": 3.02, "totalPaid": 204.02, "effectiveMonthlyPayment": 102.01, "firstMonthInterest": 2.01}}, sourceAvailable: false },
  { definition: rateConversionCalculator, example: {"label": "Nominal20% semiannual:1.1 squared minus1=21%", "input": {"mode": "nominal-to-effective", "compoundsPerYear": 2, "annualNominalPercent": 20}, "expected": {"annualNominalPercent": 20, "annualEffectivePercent": 21, "compoundsPerYear": 2}}, sourceAvailable: true },
  { definition: savingsGoalCalculator, example: {"label": "Zero return: target300 divided bythree deposits gives100", "input": {"currentSavings": 0, "targetAmount": 300, "annualReturnPercent": 0, "months": 3}, "expected": {"futureValue": 300, "gapToTarget": 0, "requiredMonthlyContribution": 100, "monthlyContributionUsed": 100, "targetReached": true}}, sourceAvailable: true },
  { definition: roiCalculator, example: {"label": "121/100 over two years: gain21, ROI21%, annual sqrt(1.21)-1=10%", "input": {"initialInvestment": 100, "finalValue": 121, "holdingMonths": 24, "additionalCosts": 0, "incomeReceived": 0}, "expected": {"netGain": 21, "totalInvested": 100, "roiPercent": 21, "annualizedReturnPercent": 10}}, sourceAvailable: false },
  { definition: netWorthCalculator, example: {"label": "Assets100 minus liabilities25 =75; ratio25%", "input": {"assets": [{"name": "asset0", "amount": 100}], "liabilities": [{"name": "debt0", "amount": 25}]}, "expected": {"totalAssets": 100, "totalLiabilities": 25, "netWorth": 75, "debtToAssetPercent": 25}}, sourceAvailable: false },
  { definition: inflationCalculator, example: {"label": "Factor1.25:100 costs125, purchasing power80, loss20%", "input": {"amount": 100, "annualInflationPercent": 25, "years": 1}, "expected": {"futureEquivalentCost": 125, "futurePurchasingPower": 80, "cumulativeInflationPercent": 25, "purchasingPowerLossPercent": 20}}, sourceAvailable: false },
  { definition: emergencyFundCalculator, example: {"label": "100 times3 target300 less50 savings: gap250, five deposits50", "input": {"monthlyEssentialExpenses": 100, "targetMonths": 3, "currentEmergencySavings": 50, "buildMonths": 5}, "expected": {"targetFund": 300, "currentSavings": 50, "fundingGap": 250, "coverageMonths": 0.5, "requiredMonthlySavings": 50, "targetReached": false}}, sourceAvailable: false },
] as const;

describe("worked examples from independent literal arithmetic, without financial approval", () => {
  for (const { definition, example, sourceAvailable } of cases) {
    it(`${definition.id}: publishes the independently worked example and preserves draft status`, () => {
      expect(definition.examples).toContainEqual(example);
      expect(definition.calculate(definition.inputSchema.parse(example.input) as never, {})).toEqual(example.expected);
      expect(definition.reviewStatus).toBe("draft");
      expect(definition.version).toBe(1);
      if (sourceAvailable) {
        expect(definition.sources.length).toBeGreaterThan(0);
        expect(definition.sources.every(source => source.url?.startsWith("https://") && source.note)).toBe(true);
      } else {
        expect(definition.sources.length).toBeGreaterThan(0);
        expect(definition.sources.every(source => !source.url && source.label.startsWith("Internal") && source.note?.includes("not external"))).toBe(true);
      }
    });
  }
});
