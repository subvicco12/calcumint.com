// @vitest-environment jsdom
import { Blob as NodeBlob } from "node:buffer";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { loanAnalysisCalculator } from "@/calculators/finance/loan-analysis";
import { runCalculator } from "@/calculators/engine";

const session = vi.hoisted(() => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.invalid";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "synthetic-test-key";
  return { plan: "pro" };
});
vi.mock("@/components/use-calculator-plan", () => ({ useCalculatorPlan: () => session.plan }));
vi.mock("@/lib/supabase/browser", () => ({ createSupabaseBrowserClient: () => {
  const query = { select: () => query, eq: () => query, maybeSingle: async () => ({ data: null }), then: (resolve: (value: unknown) => unknown) => Promise.resolve({ data: null, count: 0 }).then(resolve) };
  return { auth: { getUser: async () => ({ data: { user: { id: "synthetic-user" } } }) }, from: () => query };
} }));
import { CalculatorAccountActions } from "./calculator-account-actions";

afterEach(() => { cleanup(); vi.unstubAllGlobals(); vi.restoreAllMocks(); });

function captureDownload() {
  let blob: NodeBlob | undefined;
  vi.stubGlobal("Blob", NodeBlob);
  vi.stubGlobal("URL", { createObjectURL: (value: NodeBlob) => { blob = value; return "blob:synthetic"; }, revokeObjectURL: () => {} });
  vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
  return () => blob;
}

function parseCsv(content: string) {
  return content.match(/"(?:[^"]|"")*"(?:,"(?:[^"]|"")*"){2}/g)!.map(row => row.match(/"(?:[^"]|"")*"/g)!.map(cell => cell.slice(1, -1).replaceAll('""', '"')));
}

describe("existing calculation export schedule reconciliation", () => {
  it.each(["pro", "business"])("exports complete certified Loan rows without object-string loss on %s", async plan => {
    session.plan = plan;
    const input = { principal: 100000, annualRatePercent: 6, termMonths: 360, extraMonthlyPayment: 100 };
    const output = runCalculator(loanAnalysisCalculator, input).output;
    const download = captureDownload();
    render(<CalculatorAccountActions calculatorSlug={loanAnalysisCalculator.slug} calculatorVersion={1} input={input} output={output} />);
    fireEvent.click(await screen.findByRole("button", { name: "Export CSV" }));
    const content = await download()!.text();
    expect(content).not.toContain("[object Object]");
    const csv = parseCsv(content);
    const rawSchedule = JSON.parse(csv.find(row => row[0] === "output" && row[1] === "amortization")![2]);
    expect(rawSchedule).toEqual(output.amortization);
    expect(rawSchedule.at(-1).balance).toBe(0);
    expect(Number(csv.find(row => row[0] === "output" && row[1] === "totalInterest")![2])).toBe(output.totalInterest);
    fireEvent.click(screen.getByRole("button", { name: "Export JSON" }));
    expect(JSON.parse(await download()!.text())).toEqual({ calculatorSlug: loanAnalysisCalculator.slug, calculatorVersion: 1, input, output });
  });

  it("preserves precision, negative zero and quoted/newline values while escaping formula text", async () => {
    session.plan = "pro";
    const download = captureDownload();
    render(<CalculatorAccountActions calculatorSlug="fixture" calculatorVersion={1} input={{ formula: "=1+1", quoted: 'line "one"\nline two' }} output={{ tiny: 1e-12, negative: -0, rows: [{ period: "2026-10-01", amount: -0.000001 }] }} />);
    fireEvent.click(await screen.findByRole("button", { name: "Export CSV" }));
    const csv = parseCsv(await download()!.text());
    expect(csv.find(row => row[1] === "formula")![2]).toBe("'=1+1");
    expect(csv.find(row => row[1] === "quoted")![2]).toBe('line "one"\nline two');
    expect(Number(csv.find(row => row[1] === "tiny")![2])).toBe(1e-12);
    expect(Object.is(Number(csv.find(row => row[1] === "negative")![2]), -0)).toBe(true);
    expect(JSON.parse(csv.find(row => row[1] === "rows")![2])).toEqual([{ period: "2026-10-01", amount: -0.000001 }]);
  });

  it("keeps the existing Free export entitlement boundary", async () => {
    session.plan = "free";
    render(<CalculatorAccountActions calculatorSlug="fixture" calculatorVersion={1} input={{}} output={{ value: 1 }} />);
    await screen.findByRole("button", { name: "Save calculation" });
    expect(screen.queryByRole("button", { name: "Export CSV" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Export JSON" })).toBeNull();
  });
});
