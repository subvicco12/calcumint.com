/** @vitest-environment jsdom */
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";

const fixture = vi.hoisted(() => ({ plan: "free", capture: null as null | { input: unknown; output: unknown } }));
vi.mock("@/components/use-calculator-plan", () => ({ useCalculatorPlan: () => fixture.plan }));
vi.mock("@/components/calculator-account-actions", () => ({
  CalculatorAccountActions: (props: { input: unknown; output: unknown }) => { fixture.capture = props; return null; },
}));
import { CalculatorInteractive } from "../../components/calculator-interactive";

afterEach(() => { cleanup(); fixture.capture = null; });
const change = (label: string, value: string) => fireEvent.change(screen.getByLabelText(label), { target: { value } });

describe("pending-specialist UI uses authoritative arithmetic without plan or mode forks", () => {
  for (const plan of ["free", "pro", "business"]) {
    it(`Mortgage ${plan}: exact rational vector survives Simple/Advanced, invalid input and recovery`, () => {
      fixture.plan = plan;
      render(<CalculatorInteractive slug="mortgage-payment" />);
      change("Property price", "210"); change("Down payment", "0");
      change("Annual mortgage rate (%)", "120"); change("Term (months)", "2");
      const expected = { monthlyPayment: 121, totalPayment: 242, totalInterest: 32 };
      expect(fixture.capture?.input).toEqual({ principal: 210, annualRatePercent: 120, termMonths: 2 });
      expect(fixture.capture?.output).toMatchObject(expected);
      const result = screen.getByRole("status");
      expect(within(result).getByText("Monthly principal & interest")).toBeTruthy();
      expect(within(result).getByText("121")).toBeTruthy();
      fireEvent.click(screen.getByRole("button", { name: "Advanced" }));
      expect(fixture.capture?.output).toMatchObject(expected);
      expect(screen.getByText(/period-by-period mortgage schedule is not available/)).toBeTruthy();
      expect(screen.getByText(/Property taxes, homeowners insurance/)).toBeTruthy();
      change("Property price", "");
      expect(screen.getByRole("alert").textContent).toContain("Enter valid values");
      expect(screen.queryByRole("status")).toBeNull();
      expect(fixture.capture?.output).toBeNull();
      expect((screen.getByLabelText("Term (months)") as HTMLInputElement).value).toBe("2");
      change("Property price", "210");
      expect(fixture.capture?.output).toMatchObject(expected);
      fireEvent.click(screen.getByRole("button", { name: "Simple" }));
      expect(fixture.capture?.output).toMatchObject(expected);
    });
    it(`BMI ${plan}: metric arithmetic and invalid-height recovery preserve the screening disclosure`, () => {
      fixture.plan = plan;
      render(<CalculatorInteractive slug="bmi-calculator" />);
      change("Weight (kg)", "73.8"); change("Height (cm)", "200");
      const result = screen.getByRole("region", { name: "Calculation result" });
      expect(within(result).getByText("Body mass index")).toBeTruthy();
      expect(within(screen.getByRole("status")).getByText("18.5")).toBeTruthy();
      expect(screen.getByText(/does not diagnose health or disease/)).toBeTruthy();
      // BMI has no Advanced mathematical model; do not manufacture one.
      expect(screen.queryByRole("button", { name: "Advanced" })).toBeNull();
      change("Height (cm)", "0");
      expect(screen.queryByRole("region", { name: "Calculation result" })).toBeNull();
      expect(screen.getByText("Enter valid inputs")).toBeTruthy();
      expect((screen.getByLabelText("Weight (kg)") as HTMLInputElement).value).toBe("73.8");
      change("Height (cm)", "200");
      expect(within(screen.getByRole("status")).getByText("18.5")).toBeTruthy();
    });
  }
});
