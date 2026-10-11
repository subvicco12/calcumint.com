// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
const state=vi.hoisted(()=>({plan:"free", account:null as null|{input:Record<string,unknown>;output:Record<string,unknown>|null;calculatorSlug:string;calculatorVersion:number}}));
vi.mock("./use-calculator-plan",()=>({useCalculatorPlan:()=>state.plan}));
vi.mock("./calculator-account-actions",()=>({CalculatorAccountActions:(props:typeof state.account)=>{state.account=props;return null;}}));
vi.mock("./ai-result-explanation",()=>({AiResultExplanation:()=>null}));
import { calculatorRegistry } from "@/calculators/registry";
import { displayFinalValue } from "@/calculators/final-framework/renderer-display";
import { financeReadinessResult } from "@/calculators/final-framework/finance-readiness-result";
import { runCalculator } from "@/calculators/engine";
import { CalculatorInteractive } from "./calculator-interactive";
const cases=[
 ["fixed-term-deposit-calculator","Annual rate (%)"],
 ["recurring-deposit-calculator","Annual interest (%)"],
 ["step-up-sip-calculator","Modeled annual return (%)"],
 ["swp-calculator","Modeled annual return (%)"],
 ["investment-growth-calculator","Annual modeled return (%)"],
 ["simple-interest-calculator","Annual rate (%)"]
] as const;
afterEach(()=>{cleanup();state.account=null;});
function account(){if(!state.account)throw new Error("Missing account boundary");return state.account;}
describe("unpublished finance readiness",()=>{
 it.each(cases)("%s renders registered trust and invalidates cleared rates without fabricating zero",(slug,label)=>{
  render(<CalculatorInteractive slug={slug}/>);
  expect(screen.getByText("Methodology")).toBeTruthy();
  expect(screen.getByText("Sources")).toBeTruthy();
  expect(state.account?.output).not.toBeNull();
  fireEvent.change(screen.getByLabelText(label),{target:{value:""}});
  expect(screen.getByRole("alert").textContent).toMatch(/valid|required/);
  expect(state.account?.output).toBeNull();
  expect(screen.queryByText("Methodology")).toBeNull();
  fireEvent.change(screen.getByLabelText(label),{target:{value:"0"}});
  expect(state.account?.output).not.toBeNull();
  expect(screen.queryByRole("alert")).toBeNull();
 });


 it.each(["free","pro","business"])("renders the six certified golden inputs and every exact display metric on %s",plan=>{
  state.plan=plan;
  const labels:Record<string,Record<string,string>>={
   "fixed-term-deposit-calculator":{principal:"Principal",annualRatePercent:"Annual rate (%)",termMonths:"Term (months)",compoundingPerYear:"Compounding"},
   "recurring-deposit-calculator":{monthlyDeposit:"Monthly deposit",annualInterestPercent:"Annual interest (%)",termMonths:"Term (months)",depositTiming:"Deposit timing"},
   "step-up-sip-calculator":{initialMonthlyContribution:"Initial monthly contribution",annualStepUpPercent:"Annual step-up (%)",annualReturnPercent:"Modeled annual return (%)",termMonths:"Term (months)",contributionTiming:"Contribution timing"},
   "swp-calculator":{initialCorpus:"Initial corpus",monthlyWithdrawal:"Monthly withdrawal",annualReturnPercent:"Modeled annual return (%)",termMonths:"Term (months)",withdrawalTiming:"Withdrawal timing"},
   "investment-growth-calculator":{presentValue:"Present value",annualReturnPercent:"Annual modeled return (%)",years:"Years",inflationPercent:"Annual inflation (%)"},
   "simple-interest-calculator":{principal:"Principal",annualRatePercent:"Annual rate (%)",years:"Time (years)"}
  };
  for(const [slug] of cases){
   const definition=calculatorRegistry.getBySlug(slug)!;
   for(const example of definition.examples){
    render(<CalculatorInteractive slug={slug}/>);
    const advanced=screen.queryByRole("button",{name:"Advanced"});if(advanced)fireEvent.click(advanced);
    for(const [key,value] of Object.entries(example.input as Record<string,unknown>))fireEvent.change(screen.getByLabelText(labels[slug][key]),{target:{value:String(value)}});
    expect(account().output).toEqual(example.expected);
    const result=financeReadinessResult(definition,example.expected as Record<string,unknown>);
    expect(document.querySelector(".result-box strong")!.textContent).toBe(displayFinalValue(result.primaryResult.value,result.primaryResult.unit));
    for(const metric of result.metrics!){const term=screen.getByText(metric.label,{selector:"dt"});expect(term.nextElementSibling!.textContent).toBe(displayFinalValue(metric.value,metric.unit));}
    cleanup();
   }
  }
 });
 it.each(["free","pro","business"])("binds all16 excluded candidate interfaces to registered engine/version on %s",plan=>{
  state.plan=plan;
  for(const slug of ["compound-interest-calculator","loan-payment-calculator","loan-emi-calculator","fixed-term-deposit-calculator","recurring-deposit-calculator","sip-calculator","step-up-sip-calculator","investment-growth-calculator","swp-calculator","simple-interest-calculator","slope-calculator","graphing-calculator","function-plotter-2d","volume-calculator","standard-deviation-calculator","variance-calculator"]){
   state.account=null;
   render(<CalculatorInteractive slug={slug}/>);
   const definition=calculatorRegistry.getBySlug(slug)!;
   expect(state.account,slug).not.toBeNull();
   expect(account().calculatorSlug).toBe(definition.slug);
   expect(account().calculatorVersion).toBe(definition.version);
   const expected=runCalculator(definition,account().input).output;
   expect(account().output,slug).toMatchObject(expected as Record<string,unknown>);
   expect(screen.queryByText(/does not yet have a public interface/)).toBeNull();
   cleanup();
  }
 });
 it("preserves timing/frequency/inflation advanced inputs and restores the certified simple defaults",()=>{
  for(const [slug,label,changed,key,defaultValue] of [
   ["fixed-term-deposit-calculator","Compounding","12","compoundingPerYear",4],
   ["recurring-deposit-calculator","Deposit timing","end","depositTiming","beginning"],
   ["step-up-sip-calculator","Contribution timing","end","contributionTiming","beginning"],
   ["swp-calculator","Withdrawal timing","beginning","withdrawalTiming","end"],
   ["investment-growth-calculator","Annual inflation (%)","7","inflationPercent",0]
  ] as const){
   render(<CalculatorInteractive slug={slug}/>);
   fireEvent.click(screen.getByRole("button",{name:"Advanced"}));
   fireEvent.change(screen.getByLabelText(label),{target:{value:changed}});
   const def=calculatorRegistry.getBySlug(slug)!;
   expect(account().output).toEqual(runCalculator(def,account().input).output);
   expect(account().input[key]).toBe(typeof defaultValue==="number"?Number(changed):changed);
   fireEvent.click(screen.getByRole("button",{name:"Simple"}));
   expect(account().input[key]).toBe(defaultValue);
   expect(account().output).toEqual(runCalculator(def,account().input).output);
   fireEvent.click(screen.getByRole("button",{name:"Advanced"}));
   expect(account().input[key]).toBe(typeof defaultValue==="number"?Number(changed):changed);
   cleanup();
  }
 });

});
