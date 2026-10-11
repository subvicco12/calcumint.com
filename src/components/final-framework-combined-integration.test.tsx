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
import { CalculatorInteractive } from "./calculator-interactive";
import { compoundInterestCalculator } from "@/calculators/finance/compound-interest";
import { sipCalculator } from "@/calculators/finance/sip";

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

import { loanAnalysisCalculator } from "@/calculators/finance/loan-analysis";
const references = [
  { slug: "loan-emi-calculator", schedule: "Loan amortization checkpoints", export: "loan", analysis: "Total interest" },
  { slug: "sip-calculator", schedule: "SIP projected monthly snapshots", export: "sip", analysis: "Future value" },
  { slug: "compound-interest-calculator", schedule: "Compound-interest projected snapshots", export: "compound", analysis: "Future value" },
  { slug: "mortgage-payment", schedule: null, export: null, analysis: "Monthly principal & interest" },
  { slug: "bmi-calculator", schedule: null, export: null, analysis: null },
  { slug: "break-even-calculator", schedule: null, export: null, analysis: "Break-even units" }
];
describe("combined Reference Six route workflow boundaries", () => {
  it.each(references)("reconciles $slug core, analysis, applicable schedules and actual downloads across plans", async reference => {
    let core: string | null = null;
    for (const plan of ["free", "pro", "business"]) {
      session.plan = plan; const download = captureDownload();
      const { container } = render(<CalculatorInteractive slug={reference.slug} />);
      const headline = () => container.querySelector(".final-calculator-renderer .result-box, .final-result .result-hero")!.textContent;
      core ??= headline(); expect(headline()).toBe(core);
      const advanced = screen.queryByRole("button", { name: "Advanced" }); if (advanced) fireEvent.click(advanced);
      expect(headline()).toBe(core);
      expect(screen.queryByRole("alert")).toBeNull();
      const paid = plan !== "free";
      if (reference.analysis && paid) {
        expect(screen.getByRole("table", { name: `Scenario comparison: ${reference.analysis}` })).toBeTruthy();
        expect(screen.getByRole("table", { name: `Sensitivity analysis: ${reference.analysis}` })).toBeTruthy();
      } else expect(screen.queryByRole("region", { name: "Scenario comparison" })).toBeNull();
      if (reference.schedule && paid) expect(screen.getByRole("table", { name: reference.schedule })).toBeTruthy();
      else expect(container.querySelector(".governed-schedule")).toBeNull();
      if (reference.export && paid) {
        fireEvent.click(await screen.findByRole("button", { name: "Export JSON" }));
        const exported = JSON.parse(await download()!.text());
        const expected = reference.export === "loan" ? runCalculator(loanAnalysisCalculator, exported.input).output : reference.export === "sip" ? runCalculator(sipCalculator, exported.input).output : runCalculator(compoundInterestCalculator, exported.input).output;
        for (const [key, value] of Object.entries(expected)) expect(exported.output[key]).toEqual(value);
        if (reference.export !== "loan") {
          const rows = exported.output.periodProjection.rows;
          const { elapsedYears: _elapsed, ...terminal } = rows.at(-1).values;
          void _elapsed;
          expect(terminal).toEqual(expected);
        }
        fireEvent.click(screen.getByRole("button", { name: "Export CSV" }));
        const csv = parseCsv(await download()!.text());
        const field = reference.export === "loan" ? "amortization" : "periodProjection";
        expect(JSON.parse(csv.find(row => row[1] === field)![2])).toEqual(exported.output[field]);
      } else expect(screen.queryByRole("button", { name: "Export JSON" })).toBeNull();
      cleanup(); vi.unstubAllGlobals(); vi.restoreAllMocks();
    }
  });
});
