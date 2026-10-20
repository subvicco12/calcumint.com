// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { CalculatorSearch } from "./calculator-search";

afterEach(cleanup);
const items = Array.from({ length: 14 }, (_, i) => ({ title: `Loan ${i}`, href: `/calculators/finance/loan-${i}`, description: "Payment", keywords: ["loan"] }));
describe("calculator discovery search accessibility", () => {
  it("binds each label, status and results to its own search instance", () => {
    render(<><CalculatorSearch items={items} /><CalculatorSearch items={items} /></>);
    const inputs = screen.getAllByRole("searchbox", { name: "Search calculators" });
    expect(new Set(inputs.map(input => input.id)).size).toBe(2);
    for (const input of inputs) {
      expect(document.getElementById(input.getAttribute("aria-describedby")!)?.getAttribute("role")).toBe("status");
      expect(document.getElementById(input.getAttribute("aria-controls")!)).toBeTruthy();
    }
  });
  it("announces truncation while retaining ranked keyboard-accessible links", () => {
    render(<CalculatorSearch items={items} />);
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "loan" } });
    expect(screen.getByRole("status").textContent).toBe("Showing 12 of 14 matching calculators. Refine your search to find more.");
    const results = screen.getByRole("list", { name: "Calculator search results" });
    expect(within(results).getAllByRole("listitem")).toHaveLength(12);
    expect(within(results).getAllByRole("link")[0].getAttribute("href")).toBe(items[0].href);
  });
  it("clears with Escape without moving keyboard focus and can recover", () => {
    render(<CalculatorSearch items={items} />);
    const input = screen.getByRole("searchbox") as HTMLInputElement;
    input.focus();
    fireEvent.change(input, { target: { value: "loan" } });
    fireEvent.keyDown(input, { key: "Escape" });
    expect(input.value).toBe("");
    expect(document.activeElement).toBe(input);
    expect(screen.getByRole("status").textContent).toBe("");
    expect(screen.queryByRole("list")).toBeNull();
    fireEvent.change(input, { target: { value: "loan" } });
    expect(screen.getByRole("list")).toBeTruthy();
  });
  it("initializes URL searches and resets edited text on client navigation", () => {
    const data = [...items, { title: "BMI", href: "/calculators/health/bmi", description: "Index", keywords: ["bmi"] }];
    const view = render(<CalculatorSearch items={data} initialQuery="loan" />);
    const input = screen.getByRole("searchbox") as HTMLInputElement;
    expect(input.value).toBe("loan");
    expect(screen.getAllByRole("link")).toHaveLength(12);
    fireEvent.change(input, { target: { value: "unknown" } });
    view.rerender(<CalculatorSearch items={data} initialQuery="bmi" />);
    expect(input.value).toBe("bmi");
    expect(screen.getAllByRole("link")).toHaveLength(1);
    expect(screen.getByRole("link").getAttribute("href")).toBe("/calculators/health/bmi");
    view.rerender(<CalculatorSearch items={data} initialQuery="" />);
    expect(input.value).toBe("");
    expect(screen.queryByRole("list")).toBeNull();
  });
  it("removes withdrawn items and announces zero matches without stale links", () => {
    const view = render(<CalculatorSearch items={[items[0]]} />);
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "loan" } });
    expect(screen.getByRole("status").textContent).toBe("1 matching calculator.");
    view.rerender(<CalculatorSearch items={[]} />);
    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.getByRole("status").textContent).toBe("No calculators match that search.");
    view.rerender(<CalculatorSearch items={[items[0]]} />);
    expect(screen.getByRole("link").getAttribute("href")).toBe(items[0].href);
  });
});
