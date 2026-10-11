// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { FinalCalculatorRenderer } from "@/components/final-calculator-renderer";
import { runCalculator } from "../engine";
import type { CalculatorDefinition } from "../types";
import { loanAnalysisCalculator } from "../finance/loan-analysis";
import { loanPaymentCalculator } from "../finance/loan-payment";
import { sipCalculator } from "../finance/sip";
import { compoundInterestCalculator } from "../finance/compound-interest";
import { bmiCalculator } from "../health/bmi";
import { breakEvenCalculator } from "../business/break-even";
import { loanResult, sipResult, compoundInterestResult } from "./adapters";
import { bmiResult, breakEvenResult, mortgageResult } from "./reference-adapters";
import { referencePresentations } from "./reference-presentations";
import { displayFinalValue } from "./renderer-display";
import type { StructuredCalculationResult } from "./types";

afterEach(cleanup);

function golden<Input, Output>(definition: CalculatorDefinition<Input, Output>, adapt: (input: Input, output: Output) => StructuredCalculationResult) {
  const example = definition.examples![0];
  const run = runCalculator(definition, example.input);
  expect(run.output).toMatchObject(example.expected!);
  return { run, result: adapt(run.input, run.output), definition };
}

const fixtures = {
  loanEmi: () => golden(loanAnalysisCalculator, loanResult),
  sip: () => golden(sipCalculator, sipResult),
  compoundInterest: () => golden(compoundInterestCalculator, compoundInterestResult),
  mortgage: () => golden(loanPaymentCalculator, mortgageResult),
  bmi: () => golden(bmiCalculator, (_input, output) => bmiResult(output)),
  breakEven: () => golden(breakEvenCalculator, (_input, output) => breakEvenResult(output))
};

describe("Reference Six golden result and trust parity", () => {
  it.each(Object.keys(fixtures) as (keyof typeof fixtures)[])("preserves %s golden engine values and trust for every plan", key => {
    const authoritative = fixtures[key]();
    const original = structuredClone(authoritative.result);
    expect(authoritative.result.sources).toEqual(authoritative.definition.sources);
    expect(authoritative.result.methodology!.trim()).not.toBe("");
    for (const plan of ["free", "pro", "business"] as const) {
      const repeated = fixtures[key]();
      expect(repeated.run).toEqual(authoritative.run);
      expect(repeated.result).toEqual(authoritative.result);
      const { unmount } = render(<FinalCalculatorRenderer result={repeated.result} plan={plan} presentation={referencePresentations[key]} />);
      expect(screen.getByRole("status").textContent).toContain(displayFinalValue(authoritative.result.primaryResult.value, authoritative.result.primaryResult.unit));
      expect(screen.getByText(authoritative.result.methodology!)).toBeTruthy();
      for (const source of authoritative.result.sources!) expect(screen.getByText(source.label)).toBeTruthy();
      for (const warning of authoritative.result.warnings ?? []) expect(screen.getByText(warning)).toBeTruthy();
      expect(authoritative.result).toEqual(original);
      unmount();
    }
  });
});
