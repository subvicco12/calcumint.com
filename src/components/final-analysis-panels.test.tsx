// @vitest-environment jsdom
import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { GoalSolverPanel, ScenarioComparisonPanel, SensitivityPanel } from "./final-analysis-panels";
import { referencePresentations } from "@/calculators/final-framework/reference-presentations";
import { requiredMonthlySip } from "@/calculators/finance/sip";
import { displayFinalValue } from "@/calculators/final-framework/renderer-display";

afterEach(cleanup);
const presentation = referencePresentations.sip;

describe("shared Final analysis presentation", () => {
  it.each(["pro", "business"] as const)("preserves the SIP sub-cent reverse result on %s", plan => {
    const solved = requiredMonthlySip(1, 0, 1000, "end");
    expect(solved).toBe(0.001);
    const { rerender } = render(<GoalSolverPanel plan={plan} presentation={presentation} target={1} solved={solved} targetLabel="Target future value" solvedLabel="Required monthly contribution" solvedUnit="USD" />);
    expect(screen.getByRole("status").textContent).toContain(displayFinalValue(solved, "USD"));
    expect(screen.getByRole("status")).toHaveProperty("textContent", "Target future value1Required monthly contribution0.001 USD");
    rerender(<GoalSolverPanel plan={plan} presentation={presentation} target={2} solved={0.002} />);
    expect(screen.getByRole("status").textContent).toContain("0.002");
  });

  it("keeps small signed scenario values and deltas under named columns", () => {
    render(<ScenarioComparisonPanel plan="pro" presentation={presentation} resultLabel="Future value" resultUnit="USD" scenarios={[
      { id: "base", label: "Normal inputs", value: 0.001, delta: 0, baseline: true },
      { id: "lower", label: "Lower return", value: -0.001, delta: -0.002 },
      { id: "higher", label: "Higher return", value: 0.002, delta: 0.001 }
    ]} />);
    const table = screen.getByRole("table", { name: "Scenario comparison: Future value" });
    expect(within(table).getAllByRole("columnheader").map(cell => cell.textContent)).toEqual(["Scenario", "Future value", "Change from baseline"]);
    expect(table.textContent).toContain("Normal inputsBaseline0.001 USD0 USD");
    expect(table.textContent).toContain("Lower return-0.001 USD-0.002 USD");
    expect(table.textContent).toContain("Higher return0.002 USD+0.001 USD");
  });

  it("labels scenarios by their actual small/clamped inputs instead of a rounded legacy label", () => {
    render(<ScenarioComparisonPanel plan="pro" presentation={presentation} resultLabel="Future value" scenarios={[
      { id: "0", label: "0.00% rate", value: 1, delta: 0, input: { label: "Annual rate", value: 0.001, unit: "%" }, baseline: true },
      { id: "1", label: "-1% return", value: 1, delta: 0, input: { label: "Annual rate", value: -99, unit: "%" } },
      { id: "2", label: "0% return", value: 1, delta: 0, input: { label: "Annual rate", value: -99, unit: "%" } }
    ]} />);
    expect(screen.getByRole("rowheader", { name: /Annual rate: 0.001 %.*Baseline/ })).toBeTruthy();
    expect(screen.getAllByRole("rowheader", { name: "Annual rate: -99 %" })).toHaveLength(2);
    expect(screen.queryByText("0.00% rate")).toBeNull();
  });

  it("preserves signed sensitivity inputs and outputs in a complete accessible data view", () => {
    render(<SensitivityPanel plan="business" presentation={presentation} inputLabel="Return" inputUnit="%" resultLabel="Future value" resultUnit="USD" points={[
      { input: -0.001, value: -0.001 }, { input: 0, value: -0 }, { input: 0.001, value: 0.001 }
    ]} />);
    const table = screen.getByRole("table", { name: "Sensitivity analysis: Future value" });
    expect(within(table).getAllByRole("row").slice(1).map(row => within(row).getAllByRole("cell").map(cell => cell.textContent))).toEqual([
      ["-0.001 %", "-0.001 USD"], ["0 %", "-0 USD"], ["0.001 %", "0.001 USD"]
    ]);
    expect(screen.getAllByRole("meter")[0].getAttribute("aria-valuetext")).toBe("-0.001 USD");
    expect(screen.getAllByRole("meter")[0].getAttribute("value")).toBe("-0.001");
    expect(screen.getByText("Sensitivity data").closest("details")?.open).toBe(true);
  });

  it.each(["free", "pro", "business"] as const)("respects entitlement and BMI applicability on %s", plan => {
    const { rerender } = render(<GoalSolverPanel plan={plan} presentation={presentation} target={1} solved={0.001} />);
    expect(screen.queryByRole("region", { name: "Goal Solver" }) !== null).toBe(plan !== "free");
    rerender(<GoalSolverPanel plan={plan} presentation={referencePresentations.bmi} target={1} solved={0.001} />);
    expect(screen.queryByRole("region", { name: "Goal Solver" })).toBeNull();
    rerender(<ScenarioComparisonPanel plan={plan} presentation={referencePresentations.bmi} resultLabel="BMI" scenarios={[{ id: "0", label: "Baseline", value: 22, delta: 0 }]} />);
    expect(screen.queryByRole("table")).toBeNull();
    rerender(<SensitivityPanel plan={plan} presentation={referencePresentations.bmi} resultLabel="BMI" points={[{ input: 1, value: 22 }]} />);
    expect(screen.queryByRole("table")).toBeNull();
  });

  it("does not fabricate analysis for empty or nonfinite results", () => {
    const { rerender } = render(<ScenarioComparisonPanel plan="pro" presentation={presentation} resultLabel="Future value" scenarios={[]} />);
    expect(screen.queryByRole("region")).toBeNull();
    rerender(<SensitivityPanel plan="pro" presentation={presentation} resultLabel="Future value" points={[]} />);
    expect(screen.queryByRole("region")).toBeNull();
    rerender(<GoalSolverPanel plan="pro" presentation={presentation} target={1} solved={Infinity} />);
    expect(screen.getByRole("alert").textContent).toBe("Analysis requires finite numeric results.");
    expect(screen.queryByRole("status")).toBeNull();
    rerender(<ScenarioComparisonPanel plan="pro" presentation={presentation} resultLabel="Future value" scenarios={[{ id: "invalid", label: "Invalid", value: NaN, delta: 0 }]} />);
    expect(screen.getByRole("alert").textContent).toBe("Analysis requires finite numeric results.");
    expect(screen.queryByRole("table")).toBeNull();
    rerender(<SensitivityPanel plan="pro" presentation={presentation} resultLabel="Future value" points={[{ input: Infinity, value: 1 }]} />);
    expect(screen.getByRole("alert").textContent).toBe("Analysis requires finite numeric results.");
    expect(screen.queryByRole("meter")).toBeNull();
  });

  it.each([1e-12, -1e-12, 0, -0, 1234.567])("uses the same authoritative display policy for %s", value => {
    render(<GoalSolverPanel plan="pro" presentation={presentation} target={value} solved={value} targetUnit="units" solvedUnit="units" />);
    const values = within(screen.getByRole("status")).getAllByText(displayFinalValue(value, "units"));
    expect(values).toHaveLength(2);
    if (value !== 0) expect(displayFinalValue(value)).not.toBe("0");
  });
});
