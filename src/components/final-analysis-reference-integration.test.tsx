// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { PlanTier } from "@/calculators/final-framework/types";
import { requiredMonthlySip } from "@/calculators/finance/sip";
import { loanAnalysisCalculator } from "@/calculators/finance/loan-analysis";
import { runCalculator } from "@/calculators/engine";
import { displayFinalValue } from "@/calculators/final-framework/renderer-display";

const session = vi.hoisted(() => ({ plan: "free" as PlanTier }));
vi.mock("@/components/use-calculator-plan", () => ({ useCalculatorPlan: () => session.plan }));
vi.mock("@/components/calculator-account-actions", () => ({ CalculatorAccountActions: () => null }));
import { CalculatorInteractive } from "./calculator-interactive";

afterEach(cleanup);
const references = [
  { slug: "loan-emi-calculator", result: "Total interest" },
  { slug: "sip-calculator", result: "Future value" },
  { slug: "compound-interest-calculator", result: "Future value" },
  { slug: "mortgage-payment", result: "Monthly principal & interest" },
  { slug: "break-even-calculator", result: "Break-even units" },
  { slug: "bmi-calculator", result: null }
];

describe("Reference Six shared analysis integration", () => {
  it.each(references)("keeps $slug core and required trust equal across plans", ({ slug, result }) => {
    let authoritative: string | null = null;
    let trust: string[] | null = null;
    for (const plan of ["free", "pro", "business"] as const) {
      session.plan = plan;
      const { container, unmount } = render(<CalculatorInteractive slug={slug} />);
      const core = container.querySelector(".final-calculator-renderer .result-box, .final-result .result-hero")!.textContent;
      const methodology = Array.from(container.querySelectorAll(".final-calculator-renderer details, .final-result details"))
        .filter(item => /^(Methodology|Result methodology|Sources)$/.test(item.querySelector("summary")!.textContent!))
        .map(item => item.textContent!);
      const warnings = Array.from(container.querySelectorAll(".final-calculator-renderer .muted, .final-result .result-warning")).map(item => item.textContent!);
      if (authoritative === null) { authoritative = core; trust = [...methodology, ...warnings]; }
      expect(core).toBe(authoritative);
      expect([...methodology, ...warnings]).toEqual(trust);
      expect(methodology.join(" ")).toContain("Sources");
      expect(methodology.join(" ")).toMatch(/methodology/i);
      const advanced = screen.queryByRole("button", { name: "Advanced" });
      if (advanced) fireEvent.click(advanced);
      expect(container.querySelector(".final-calculator-renderer .result-box, .final-result .result-hero")!.textContent).toBe(authoritative);
      if (plan === "free" || result === null) {
        expect(screen.queryByRole("region", { name: "Scenario comparison" })).toBeNull();
        expect(screen.queryByRole("region", { name: "Sensitivity analysis" })).toBeNull();
      } else {
        const scenario = screen.getByRole("table", { name: `Scenario comparison: ${result}` });
        expect(within(scenario).getByText("Baseline")).toBeTruthy();
        expect(screen.getByRole("table", { name: `Sensitivity analysis: ${result}` })).toBeTruthy();
        if (slug !== "sip-calculator") expect(screen.getByRole("region", { name: "Goal Solver" })).toBeTruthy();
      }
      unmount();
    }
  });

  it.each(["pro", "business"] as const)("keeps real SIP reverse core and Goal Solver precise on %s", plan => {
    session.plan = plan;
    render(<CalculatorInteractive slug="sip-calculator" />);
    fireEvent.click(screen.getByRole("button", { name: "Solve monthly contribution" }));
    fireEvent.change(screen.getByLabelText("Target future value"), { target: { value: "1" } });
    fireEvent.change(screen.getByLabelText("Modeled annual return (%)"), { target: { value: "0" } });
    fireEvent.change(screen.getByLabelText("Term (months)"), { target: { value: "1000" } });
    fireEvent.click(screen.getByRole("button", { name: "Advanced" }));
    const expected = displayFinalValue(requiredMonthlySip(1, 0, 1000, "beginning"));
    const core = screen.getAllByRole("status").find(element => element.classList.contains("result-box"))!;
    expect(core.textContent).toContain(expected);
    expect(within(screen.getByRole("region", { name: "Goal Solver" })).getByRole("status").textContent).toContain(expected);
  });

  it.each(["pro", "business"] as const)("reconciles Loan analysis after an extra-payment edit on %s", plan => {
    session.plan = plan;
    render(<CalculatorInteractive slug="loan-emi-calculator" />);
    fireEvent.click(screen.getByRole("button", { name: "Advanced" }));
    fireEvent.change(screen.getByLabelText("Extra monthly payment"), { target: { value: "100" } });
    const expected = displayFinalValue(runCalculator(loanAnalysisCalculator, { principal: 100000, annualRatePercent: 6, termMonths: 360, extraMonthlyPayment: 100 }).output.totalInterest);
    const baseline = screen.getByRole("rowheader", { name: /Annual rate: 6 %.*Baseline/ }).closest("tr")!;
    expect(within(baseline).getAllByRole("cell")[0].textContent).toBe(expected);
    const sensitivity = screen.getByRole("table", { name: "Sensitivity analysis: Total interest" });
    const center = within(sensitivity).getAllByRole("row").find(row => within(row).queryByRole("cell", { name: "6 %" }))!;
    expect(within(center).getAllByRole("cell")[1].textContent).toBe(expected);
  });
});
