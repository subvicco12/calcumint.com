// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { FinalCalculatorRenderer } from "@/components/final-calculator-renderer";
import { referencePresentations } from "./reference-presentations";
import { createStructuredResult } from "./structured-result";
import { toRendererResult } from "./structured-result-interop";

afterEach(cleanup);
const metadata = {
  caption: "Amortization schedule",
  period: { key: "month", label: "Payment month", unit: "months" },
  columns: [{ key: "balance", label: "Remaining balance" }, { key: "payment", label: "Payment", unit: "USD" }],
  granularity: "complete" as const,
  terminal: [{ column: "balance", expected: 0, tolerance: 0.01 }]
};
const normalized = () => createStructuredResult({
  primaryResult: { key: "payment", label: "Monthly payment", value: 100 },
  schedule: {
    columns: ["payment", "month", "balance"],
    metadata,
    rows: [{ payment: 100, month: 1, balance: 900 }, { month: 2, balance: 0 }]
  }
});

describe("governed schedule metadata integration", () => {
  it("uses an explicit period key and preserves authoritative metadata and sparse values", () => {
    const source = normalized();
    const snapshot = structuredClone(source);
    const result = toRendererResult(source);
    expect(result.scheduleMetadata).toEqual(metadata);
    expect(result.schedule?.map(row => row.period)).toEqual([1, 2]);
    expect(result.schedule?.[0].values).toEqual({ payment: 100, balance: 900 });
    expect(result.schedule?.[1].values).toEqual({ balance: 0 });
    expect(source).toEqual(snapshot);
  });

  it("rejects mismatched normalized schemas and missing periods without silently dropping data", () => {
    const extra = normalized();
    extra.schedule = { ...extra.schedule!, columns: [...extra.schedule!.columns, "undeclared"] };
    expect(() => toRendererResult(extra)).toThrow(/every declared column/);
    const duplicate = normalized();
    duplicate.schedule = { ...duplicate.schedule!, columns: [...duplicate.schedule!.columns, "payment"] };
    expect(() => toRendererResult(duplicate)).toThrow(/every declared column/);
    const missing = normalized();
    missing.schedule = { ...missing.schedule!, rows: [{ payment: 100, balance: 900 }, ...missing.schedule!.rows.slice(1)] };
    expect(() => toRendererResult(missing)).toThrow(/period is missing/);
  });

  it.each(["pro", "business"] as const)("renders declared column order, units and sparse markers on %s", plan => {
    render(<FinalCalculatorRenderer result={toRendererResult(normalized())} plan={plan} presentation={referencePresentations.loanEmi} />);
    const table = screen.getByRole("table", { name: "Amortization schedule" });
    expect(within(table).getAllByRole("columnheader").map(cell => cell.textContent)).toEqual(["Payment month (months)", "Remaining balance", "Payment (USD)"]);
    expect(within(table).getAllByRole("rowheader").map(cell => cell.textContent)).toEqual(["1", "2"]);
    expect(within(table).getAllByRole("cell").map(cell => cell.textContent)).toEqual(["900", "100", "0", "—"]);
  });

  it("bounds initial large-result DOM and reveals every raw row on keyboard-operable demand", () => {
    const result = toRendererResult(normalized());
    result.schedule = Array.from({ length: 500 }, (_, i) => ({ id: String(i), period: i + 1, values: { payment: 0.000001, balance: i === 499 ? 0 : 500 - i } }));
    render(<FinalCalculatorRenderer result={result} plan="pro" presentation={referencePresentations.loanEmi} />);
    const table = screen.getByRole("table", { name: "Amortization schedule" });
    expect(within(table).getAllByRole("rowheader")).toHaveLength(25);
    expect(within(table).getAllByRole("rowheader").at(-1)?.textContent).toBe("500");
    expect(screen.getByRole("status").textContent).toContain("Monthly payment100");
    const expand = screen.getByRole("button", { name: "Show all 500 rows" });
    expect(expand.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(expand);
    expect(within(table).getAllByRole("rowheader")).toHaveLength(500);
    expect(screen.getByRole("button", { name: "Show schedule summary" }).getAttribute("aria-expanded")).toBe("true");
  });

  it("keeps invalid or contradictory metadata visible as feedback rather than dropping columns", () => {
    const result = toRendererResult(normalized());
    result.schedule = [{ id: "1", period: 1, values: { payment: 1, balance: 20, undeclared: 30 } }];
    render(<FinalCalculatorRenderer result={result} plan="pro" presentation={referencePresentations.loanEmi} />);
    expect(screen.getByRole("alert").textContent).toMatch(/undeclared|terminal/i);
    expect(screen.queryByRole("table")).toBeNull();
    expect(screen.getByRole("status").textContent).toContain("Monthly payment100");
  });

  it.each(["free", "pro", "business"] as const)("does not invent an unsupported BMI schedule on %s", plan => {
    render(<FinalCalculatorRenderer result={toRendererResult(normalized())} plan={plan} presentation={referencePresentations.bmi} />);
    expect(screen.queryByRole("table")).toBeNull();
    expect(screen.queryByText("Detailed schedule")).toBeNull();
  });
});
