// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
const state=vi.hoisted(()=>({plan:"pro",account:null as null|{output:Record<string,unknown>|null}}));
vi.mock("./use-calculator-plan",()=>({useCalculatorPlan:()=>state.plan}));
vi.mock("./calculator-account-actions",()=>({CalculatorAccountActions:(p:typeof state.account)=>{state.account=p;return null;}}));
import { CalculatorInteractive } from "./calculator-interactive";
afterEach(()=>{cleanup();state.account=null;});
describe("Reference Six required-input reconciliation",()=>{
 it.each(["free","pro","business"])("does not reinterpret blank required fields as authoritative zero on %s",plan=>{
  state.plan=plan;
  for(const [slug,label] of [["loan-emi-calculator","Annual rate (%)"],["sip-calculator","Modeled annual return (%)"],["compound-interest-calculator","Annual rate (%)"],["break-even-calculator","Fixed costs"]]){
   render(<CalculatorInteractive slug={slug}/>);fireEvent.change(screen.getByLabelText(label),{target:{value:""}});
   expect(document.querySelector(".final-calculator-renderer"),slug).toBeNull();
   expect(screen.getByRole("alert").textContent).toMatch(/valid|required/);
   if(slug!=="break-even-calculator")expect(state.account?.output).toBeNull();
   fireEvent.change(screen.getByLabelText(label),{target:{value:"0"}});
   expect(document.querySelector(".final-calculator-renderer"),slug).not.toBeNull();
   cleanup();
  }
 });
 it("rejects invalid canonical extra payments instead of falling back to a different Loan engine",()=>{
  state.plan="pro";render(<CalculatorInteractive slug="loan-emi-calculator"/>);fireEvent.click(screen.getByRole("button",{name:"Advanced"}));
  fireEvent.change(screen.getByLabelText("Extra monthly payment"),{target:{value:"-1"}});
  expect(document.querySelector(".final-calculator-renderer")).toBeNull();expect(state.account?.output).toBeNull();
  expect(screen.getByRole("alert")).toBeTruthy();
 });
 it("does not export a fabricated zero when the SIP reverse target is blank",()=>{
  render(<CalculatorInteractive slug="sip-calculator"/>);fireEvent.click(screen.getByRole("button",{name:"Solve monthly contribution"}));
  fireEvent.change(screen.getByLabelText("Target future value"),{target:{value:""}});
  expect(document.querySelector(".final-calculator-renderer")).toBeNull();expect(state.account?.output).toBeNull();
  expect(screen.getByRole("alert")).toBeTruthy();
 });
 it.each(["pro","business"])("invalid advanced targets never display a solved zero on %s and preserve valid core results",plan=>{
  state.plan=plan;
  for(const [slug,label] of [["loan-emi-calculator","Target monthly payment"],["compound-interest-calculator","Target future value"],["break-even-calculator","Target break-even units"]]){
   render(<CalculatorInteractive slug={slug}/>);fireEvent.click(screen.getByRole("button",{name:"Advanced"}));
   fireEvent.change(screen.getByLabelText(label),{target:{value:""}});
   expect(document.querySelector(".final-calculator-renderer")).not.toBeNull();
   const solver=screen.getByLabelText("Goal Solver");expect(solver.querySelector('[role="status"]')).toBeNull();expect(solver.querySelector('[role="alert"]')).not.toBeNull();
   fireEvent.change(screen.getByLabelText(label),{target:{value:"1000"}});expect(solver.querySelector('[role="status"]')).not.toBeNull();cleanup();
  }
 });
 it("preserves hidden invalid extra values without invalidating Simple mode or calculating Advanced mode",()=>{
  state.plan="pro";render(<CalculatorInteractive slug="loan-emi-calculator"/>);fireEvent.click(screen.getByRole("button",{name:"Advanced"}));
  fireEvent.change(screen.getByLabelText("Extra monthly payment"),{target:{value:""}});expect(state.account?.output).toBeNull();
  fireEvent.click(screen.getByRole("button",{name:"Simple"}));expect(state.account?.output).not.toBeNull();
  fireEvent.click(screen.getByRole("button",{name:"Advanced"}));expect(state.account?.output).toBeNull();
  fireEvent.change(screen.getByLabelText("Extra monthly payment"),{target:{value:"0"}});expect(state.account?.output).not.toBeNull();
 });
 it.each(["0","","-1","1.5","1201"])("SIP reverse mode rejects invalid terms %s without helper fallback zero",value=>{
  render(<CalculatorInteractive slug="sip-calculator"/>);fireEvent.click(screen.getByRole("button",{name:"Solve monthly contribution"}));
  fireEvent.change(screen.getByLabelText("Term (months)"),{target:{value}});
  expect(state.account?.output).toBeNull();expect(document.querySelector(".final-calculator-renderer")).toBeNull();expect(screen.getByRole("alert")).toBeTruthy();
 });

});
