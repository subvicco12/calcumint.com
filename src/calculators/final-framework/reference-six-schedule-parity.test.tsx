// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { FinalCalculatorRenderer } from "@/components/final-calculator-renderer";
import { runCalculator } from "../engine";
import { loanAnalysisCalculator } from "../finance/loan-analysis";
import { mortgageCalculator } from "../finance/mortgage";
import { sipCalculator } from "../finance/sip";
import { compoundInterestCalculator } from "../finance/compound-interest";
import { bmiCalculator } from "../health/bmi";
import { breakEvenCalculator } from "../business/break-even";
import { loanResult, sipResult, compoundInterestResult } from "./adapters";
import { bmiResult, breakEvenResult, mortgageResult } from "./reference-adapters";
import { referencePresentations } from "./reference-presentations";

afterEach(cleanup);
const loanInput = { principal: 1, annualRatePercent: 0, termMonths: 1, extraMonthlyPayment: 0 };
const loan = runCalculator(loanAnalysisCalculator, loanInput).output;
const mortgageInput = { principal: 1200, annualRatePercent: 0, termMonths: 12 };
const mortgage = runCalculator(mortgageCalculator, mortgageInput).output;
const sipInput = { monthlyContribution: 100, annualReturnPercent: 0, termMonths: 12, contributionTiming: "end" as const };
const sip = runCalculator(sipCalculator, sipInput).output;
const compoundInput = { principal: 100, annualRatePercent: 10, years: 1, compoundsPerYear: 1 };
const compound = runCalculator(compoundInterestCalculator, compoundInput).output;
const bmi = runCalculator(bmiCalculator, { weightKg: 70, heightCm: 175 }).output;
const breakEven = runCalculator(breakEvenCalculator, { fixedCosts: 10000, pricePerUnit: 50, variableCostPerUnit: 30 }).output;
const references = [
  { name: "Loan", result: loanResult(loanInput, loan), presentation: referencePresentations.loanEmi, expected: 1, sources: loanAnalysisCalculator.sources },
  { name: "Mortgage", result: mortgageResult(mortgageInput, mortgage), presentation: referencePresentations.mortgage, expected: 100, sources: mortgageCalculator.sources },
  { name: "SIP", result: sipResult(sipInput, sip), presentation: referencePresentations.sip, expected: 1200, sources: sipCalculator.sources },
  { name: "Compound", result: compoundInterestResult(compoundInput, compound), presentation: referencePresentations.compoundInterest, expected: 110, sources: compoundInterestCalculator.sources },
  { name: "BMI", result: bmiResult(bmi), presentation: referencePresentations.bmi, expected: bmi.bmi, sources: bmiCalculator.sources },
  { name: "Break-even", result: breakEvenResult(breakEven), presentation: referencePresentations.breakEven, expected: 500, sources: breakEvenCalculator.sources }
];
describe("Reference Six schedule applicability and core parity", () => {
  it.each(references)("preserves $name authoritative values, sources and schedule applicability across plans", reference => {
    const snapshot = structuredClone(reference.result);
    expect(Number(reference.result.primaryResult.value)).toBeCloseTo(reference.expected, 10);
    expect(reference.result.sources).toEqual(reference.sources);
    const outputs: string[] = [];
    for (const plan of ["free", "pro", "business"] as const) {
      render(<FinalCalculatorRenderer result={reference.result} plan={plan} presentation={reference.presentation} />);
      outputs.push(screen.getByRole("status").textContent!);
      expect(Boolean(screen.queryByRole("table"))).toBe(reference.name === "Loan" && plan !== "free");
      expect(screen.queryByRole("alert")).toBeNull();
      cleanup();
    }
    expect(new Set(outputs).size).toBe(1);
    expect(reference.result).toEqual(snapshot);
    if (reference.name !== "Loan") expect(reference.result.scheduleMetadata).toBeUndefined();
  });
});
