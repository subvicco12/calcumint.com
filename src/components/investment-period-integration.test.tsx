// @vitest-environment jsdom
import { Blob as NodeBlob } from "node:buffer";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
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
import { FinalCalculatorRenderer } from "./final-calculator-renderer";
import { investmentPeriodPresentations } from "@/calculators/final-framework/investment-period-presentations";
import { CalculatorInteractive } from "./calculator-interactive";
import { compoundInterestCalculator } from "@/calculators/finance/compound-interest";
import { sipCalculator } from "@/calculators/finance/sip";
import { compoundPeriodResult, sipPeriodResult, investmentPeriodExport } from "@/calculators/final-framework/investment-periods";

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

const cases = [
  { slug: "sip-calculator", caption: "SIP projected monthly snapshots", input: { monthlyContribution: 500, annualReturnPercent: 8, termMonths: 120, contributionTiming: "beginning" as const }, build: () => {
    const input = { monthlyContribution: 500, annualReturnPercent: 8, termMonths: 120, contributionTiming: "beginning" as const }; const output = runCalculator(sipCalculator, input).output; return investmentPeriodExport(output, sipPeriodResult(input, output));
  } },
  { slug: "compound-interest-calculator", caption: "Compound-interest projected snapshots", input: { principal: 10000, annualRatePercent: 5, years: 10, compoundsPerYear: 12 }, build: () => {
    const input = { principal: 10000, annualRatePercent: 5, years: 10, compoundsPerYear: 12 }; const output = runCalculator(compoundInterestCalculator, input).output; return investmentPeriodExport(output, compoundPeriodResult(input, output));
  } }
];
describe("actual investment route projection and download boundaries", () => {
  it.each(cases)("preserves $slug headline and projection/export policy on all plans", async reference => {
    const expected = reference.build(); const headlines: string[] = [];
    for (const plan of ["free", "pro", "business"]) {
      session.plan = plan; const download = captureDownload();
      render(<CalculatorInteractive slug={reference.slug} />);
      headlines.push(document.querySelector(".final-calculator-renderer .result-box")!.textContent!);
      expect(screen.queryByRole("alert")).toBeNull();
      if (plan === "free") {
        expect(screen.queryByRole("table", { name: reference.caption })).toBeNull();
        expect(screen.queryByRole("table", { name: /Trend data:/ }) !== null).toBe(reference.slug === "sip-calculator");
        expect(screen.getByText("Detailed schedule").closest(".locked-feature")).not.toBeNull();
        expect(screen.queryByRole("button", { name: "Export CSV" })).toBeNull();
      } else {
        const table = screen.getByRole("table", { name: reference.caption });
        expect(table.querySelectorAll("tbody tr")).toHaveLength(25);
        fireEvent.click(screen.getByRole("button", { name: /Show all/ }));
        expect(table.querySelectorAll("tbody tr")).toHaveLength(expected.periodProjection.rows!.length);
        fireEvent.click(await screen.findByRole("button", { name: "Export CSV" }));
        const csv = parseCsv(await download()!.text());
        expect(JSON.parse(csv.find(row => row[1] === "periodProjection")![2])).toEqual(expected.periodProjection);
        fireEvent.click(screen.getByRole("button", { name: "Export JSON" }));
        expect(JSON.parse(await download()!.text()).output).toEqual(expected);
      }
      cleanup(); vi.unstubAllGlobals(); vi.restoreAllMocks();
    }
    expect(new Set(headlines).size).toBe(1);
  });
  it("keeps daily Compound elapsed-time identities distinct even when numeric display rounds row headers", () => {
    const input = { principal: 100, annualRatePercent: 1, years: 0.025, compoundsPerYear: 365 };
    const output = runCalculator(compoundInterestCalculator, input).output;
    const result = compoundPeriodResult(input, output);
    render(<FinalCalculatorRenderer result={result} plan="pro" presentation={investmentPeriodPresentations.compoundInterest} />);
    const table = screen.getByRole("table", { name: "Compound-interest projected snapshots" });
    expect([...table.querySelectorAll("tbody tr")].map(row => row.querySelector("td")!.textContent)).toEqual(result.schedule!.map(row => String(row.period)));
  });
  it("updates SIP timing, term and rates without stale table or export rows, leaving reverse solve separate", async () => {
    session.plan = "pro"; const download = captureDownload(); render(<CalculatorInteractive slug="sip-calculator" />);
    fireEvent.click(screen.getByRole("button", { name: "Advanced" }));
    fireEvent.change(screen.getByLabelText("Contribution timing"), { target: { value: "end" } });
    fireEvent.change(screen.getByLabelText("Term (months)"), { target: { value: "1" } });
    fireEvent.change(screen.getByLabelText("Modeled annual return (%)"), { target: { value: "-20" } });
    expect(screen.getByRole("table", { name: "SIP projected monthly snapshots" }).querySelectorAll("tbody tr")).toHaveLength(1);
    fireEvent.click(await screen.findByRole("button", { name: "Export JSON" }));
    const exported = JSON.parse(await download()!.text());
    expect(exported.output.periodProjection.rows[0].values).toEqual(runCalculator(sipCalculator, exported.input).output);
    fireEvent.click(screen.getByRole("button", { name: "Solve monthly contribution" }));
    expect(screen.queryByRole("table", { name: "SIP projected monthly snapshots" })).toBeNull();
  });
  it("updates Compound frequency and fractional term, preserving exact terminal projection", async () => {
    session.plan = "business"; const download = captureDownload(); render(<CalculatorInteractive slug="compound-interest-calculator" />);
    fireEvent.click(screen.getByRole("button", { name: "Advanced" }));
    fireEvent.change(screen.getByLabelText("Compounds per year"), { target: { value: "4" } });
    fireEvent.change(screen.getByLabelText("Years"), { target: { value: "1.125" } });
    fireEvent.click(await screen.findByRole("button", { name: "Export JSON" }));
    const exported = JSON.parse(await download()!.text());
    expect(exported.output.periodProjection.rows.at(-1).period).toBe(1.125);
    expect(exported.output.periodProjection.rows.at(-1).values).toEqual({ elapsedYears: String(exported.input.years), ...runCalculator(compoundInterestCalculator, exported.input).output });
    expect(exported.output.periodProjection.rows).toHaveLength(6);
  });
});
