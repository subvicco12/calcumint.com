// @vitest-environment jsdom
import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { FinalCalculatorRenderer } from "@/components/final-calculator-renderer";
import { referencePresentations } from "./reference-presentations";
import type { StructuredCalculationResult } from "./types";

afterEach(cleanup);

const result: StructuredCalculationResult = {
  primaryResult: { id: "payment", label: "Monthly payment", value: 125 },
  schedule: [
    { id: "1", period: 1, values: { principal: 100, interest: 25 } },
    { id: "2", period: 2, values: { interest: 20, principal: 105 } },
    { id: "3", period: 3, values: { principal: 0, balance: 0 } }
  ]
};

describe("Final schedule column reconciliation", () => {
  it.each(["pro", "business"] as const)("aligns reordered, sparse and extra fields on %s", plan => {
    const original = structuredClone(result);
    render(<FinalCalculatorRenderer result={result} plan={plan} presentation={referencePresentations.loanEmi} />);
    const rows = within(screen.getByRole("table", { name: "Detailed calculation schedule" })).getAllByRole("row");
    expect(within(rows[0]).getAllByRole("columnheader").map(cell => cell.textContent)).toEqual(["Period", "principal", "interest", "balance"]);
    expect(rows.slice(1).map(row => [within(row).getByRole("rowheader").textContent,...within(row).getAllByRole("cell").map(cell => cell.textContent)])).toEqual([
      ["1", "100", "25", "—"],
      ["2", "105", "20", "—"],
      ["3", "0", "—", "0"]
    ]);
    expect(result).toEqual(original);
  });

  it.each(["free", "pro", "business"] as const)("preserves the authoritative headline on %s", plan => {
    render(<FinalCalculatorRenderer result={result} plan={plan} presentation={referencePresentations.loanEmi} />);
    expect(screen.getByRole("status").textContent).toBe("Monthly payment125");
    if (plan === "free") {
      expect(screen.queryByRole("table")).toBeNull();
      expect(screen.getByText("Detailed schedule").closest(".locked-feature")).not.toBeNull();
    }
  });

  it.each([undefined, []])("does not invent a schedule for absent or empty rows", schedule => {
    render(<FinalCalculatorRenderer result={{ ...result, schedule }} plan="pro" presentation={referencePresentations.loanEmi} />);
    expect(screen.queryByRole("table")).toBeNull();
    expect(screen.queryByText("Detailed schedule")).toBeNull();
  });
});
