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

import { mortgageCalculator } from "@/calculators/finance/mortgage";
import { loanAnalysisCalculator } from "@/calculators/finance/loan-analysis";
const references = [
  { slug: "loan-emi-calculator", schedule: "Loan amortization checkpoints", export: "loan", analysis: "Total interest" },
  { slug: "sip-calculator", schedule: "SIP projected monthly snapshots", export: "sip", analysis: "Future value" },
  { slug: "compound-interest-calculator", schedule: "Compound-interest projected snapshots", export: "compound", analysis: "Future value" },
  { slug: "mortgage-payment", schedule: null, export: "mortgage", analysis: "Monthly principal & interest" },
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
        const expected = reference.export === "loan" ? runCalculator(loanAnalysisCalculator, exported.input).output : reference.export === "sip" ? runCalculator(sipCalculator, exported.input).output : reference.export === "mortgage" ? runCalculator(mortgageCalculator, exported.input).output : runCalculator(compoundInterestCalculator, exported.input).output;
        for (const [key, value] of Object.entries(expected)) expect(exported.output[key]).toEqual(value);
        if (reference.export !== "loan" && reference.export !== "mortgage") {
          const rows = exported.output.periodProjection.rows;
          const { elapsedYears: _elapsed, ...terminal } = rows.at(-1).values;
          void _elapsed;
          expect(terminal).toEqual(expected);
        }
        fireEvent.click(screen.getByRole("button", { name: "Export CSV" }));
        const csv = parseCsv(await download()!.text());
        if(reference.export === "mortgage"){for(const [field,value] of Object.entries(expected))expect(Number(csv.find(row=>row[0] === "output" && row[1] === field)![2])).toBe(value);}else{const field = reference.export === "loan" ? "amortization" : "periodProjection";
        expect(JSON.parse(csv.find(row => row[1] === field)![2])).toEqual(exported.output[field]);}
      } else expect(screen.queryByRole("button", { name: "Export JSON" })).toBeNull();
      cleanup(); vi.unstubAllGlobals(); vi.restoreAllMocks();
    }
  });
});

describe("release integration invalid-output boundaries", () => {
  it.each(["pro", "business"])("disables actual saves/exports and removes derived Loan data when canonical extra payment is invalid on %s", async plan => {
    session.plan = plan;
    render(<CalculatorInteractive slug="loan-emi-calculator"/>);
    const save = await screen.findByRole("button", { name: "Save calculation" });
    fireEvent.click(screen.getByRole("button", { name: "Advanced" }));
    for (const value of ["-1", ""]) {
      fireEvent.change(screen.getByLabelText("Extra monthly payment"), { target: { value } });
      expect(document.querySelector(".final-calculator-renderer")).toBeNull();
      expect(screen.queryByLabelText("Scenario comparison")).toBeNull();
      expect(screen.queryByLabelText("Sensitivity analysis")).toBeNull();
      expect(document.querySelector("table")).toBeNull();
      expect((save as HTMLButtonElement).disabled).toBe(true);
      const capture = captureDownload();
      for (const name of ["Export CSV", "Export JSON"]) {
        const button = screen.getByRole("button", { name });
        expect((button as HTMLButtonElement).disabled).toBe(true);
        fireEvent.click(button);
      }
      expect(capture()).toBeUndefined();
    }
    fireEvent.change(screen.getByLabelText("Extra monthly payment"), { target: { value: "0" } });
    expect((save as HTMLButtonElement).disabled).toBe(false);
    expect((screen.getByRole("button", { name: "Export CSV" }) as HTMLButtonElement).disabled).toBe(false);
  });
  it.each(["pro", "business"])("disables SIP reverse saves/exports when a target is missing and recovers on %s", async plan => {
    session.plan = plan;
    render(<CalculatorInteractive slug="sip-calculator"/>);
    const save = await screen.findByRole("button", { name: "Save calculation" });
    fireEvent.click(screen.getByRole("button", { name: "Solve monthly contribution" }));
    fireEvent.change(screen.getByLabelText("Target future value"), { target: { value: "" } });
    expect((save as HTMLButtonElement).disabled).toBe(true);
    for (const name of ["Export CSV", "Export JSON"]) expect((screen.getByRole("button", { name }) as HTMLButtonElement).disabled).toBe(true);
    expect(screen.getByRole("alert")).toBeTruthy();
    fireEvent.change(screen.getByLabelText("Target future value"), { target: { value: "100000" } });
    expect((save as HTMLButtonElement).disabled).toBe(false);
    expect((screen.getByRole("button", { name: "Export JSON" }) as HTMLButtonElement).disabled).toBe(false);
  });
});
describe('Mortgage aggregate export reconciliation',()=>{
 it.each(['pro','business'])('disables actual account actions for invalid Mortgage inputs on %s',async plan=>{
  session.plan=plan;const download=captureDownload();render(<CalculatorInteractive slug='mortgage-payment'/>);
  const save=await screen.findByRole('button',{name:'Save calculation'});
  for(const [label,value] of [['Down payment',''],['Down payment','400001'],['Annual mortgage rate (%)',''],['Term (months)','1201']]){
   const field=screen.getByLabelText(label),original=(field as HTMLInputElement).value;fireEvent.change(field,{target:{value}});
   for(const button of [save,screen.getByRole('button',{name:'Export JSON'}),screen.getByRole('button',{name:'Export CSV'})]){expect((button as HTMLButtonElement).disabled).toBe(true);fireEvent.click(button);}
   expect(download()).toBeUndefined();expect(screen.getByRole('alert')).toBeTruthy();
   fireEvent.change(field,{target:{value:original}});expect((save as HTMLButtonElement).disabled).toBe(false);
  }
 });
});
describe('Mortgage advanced analytical exports',()=>{
 it.each(['pro','business'])('exports exact available/unavailable comparison evidence and entered context on %s',async plan=>{
  session.plan=plan;const download=captureDownload();render(<CalculatorInteractive slug='mortgage-payment'/>);
  fireEvent.change(screen.getByLabelText('Annual mortgage rate (%)'),{target:{value:'1000'}});fireEvent.click(screen.getByRole('button',{name:'Advanced'}));
  fireEvent.click(screen.getByText('Rate comparison totals'));
  const table=screen.getByRole('table',{name:'Mortgage aggregate rate comparison totals'});expect(table.textContent).toContain('Unavailable');
  fireEvent.click(await screen.findByRole('button',{name:'Export JSON'}));const exported=JSON.parse(await download()!.text());
  expect(exported.output.mortgageContext).toEqual({version:1,propertyPrice:400000,downPayment:80000,scope:'principal-and-interest-only'});
  expect(exported.output.rateAnalysis.kind).toBe('aggregate-rate-comparison');
  for(const point of [...exported.output.rateAnalysis.scenarios,...exported.output.rateAnalysis.sensitivity]){
   if(point.state==='available')expect(point.output).toEqual(runCalculator(mortgageCalculator,point.input).output);
   else expect(point.reason).toBe('outside-supported-inputs');
  }
  for(const point of exported.output.rateAnalysis.sensitivity.filter((p:{state:string})=>p.state==='available'))expect(screen.getAllByRole('meter').some(m=>Number(m.getAttribute('value'))===point.output.monthlyPayment)).toBe(true);
  fireEvent.click(screen.getByRole('button',{name:'Export CSV'}));const csv=parseCsv(await download()!.text());
  for(const field of ['mortgageContext','rateAnalysis'])expect(JSON.parse(csv.find(row=>row[1]===field)![2])).toEqual(exported.output[field]);
 });
});
