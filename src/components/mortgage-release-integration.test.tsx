// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { runCalculator } from "@/calculators/engine";
import { mortgageCalculator } from "@/calculators/finance/mortgage";
const state=vi.hoisted(()=>({plan:"pro",account:null as null|{calculatorSlug:string;calculatorVersion:number;input:Record<string,unknown>;output:Record<string,unknown>|null}}));
vi.mock("./use-calculator-plan",()=>({useCalculatorPlan:()=>state.plan}));
vi.mock("./calculator-account-actions",()=>({CalculatorAccountActions:(props:typeof state.account)=>{state.account=props;return null;}}));
import { CalculatorInteractive } from "./calculator-interactive";
afterEach(()=>{cleanup();state.account=null;});
it.each(["free","pro","business"])("binds Mortgage v1 aggregate outputs and guarded account data on %s",plan=>{
 state.plan=plan;render(<CalculatorInteractive slug={mortgageCalculator.slug}/>);
 expect(state.account?.calculatorSlug).toBe(mortgageCalculator.slug);expect(state.account?.calculatorVersion).toBe(1);
 expect(state.account?.output).toEqual({...runCalculator(mortgageCalculator,state.account!.input).output,mortgageContext:{version:1,propertyPrice:Number((screen.getByLabelText('Property price') as HTMLInputElement).value),downPayment:Number((screen.getByLabelText('Down payment') as HTMLInputElement).value),scope:'principal-and-interest-only'}});
 expect(document.querySelector('.governed-schedule')).toBeNull();
 expect(screen.getByText(/mortgage insurance/i)).toBeTruthy();
 for(const label of ["Property price","Down payment","Annual mortgage rate (%)","Term (months)"]){
  const field=screen.getByLabelText(label);const original=(field as HTMLInputElement).value;
  fireEvent.change(field,{target:{value:""}});expect(state.account?.output).toBeNull();expect(screen.getByRole('alert')).toBeTruthy();expect(document.querySelector('.final-calculator-renderer')).toBeNull();
  fireEvent.change(field,{target:{value:original}});expect(state.account?.output).not.toBeNull();
 }
 fireEvent.change(screen.getByLabelText('Annual mortgage rate (%)'),{target:{value:'0'}});fireEvent.change(screen.getByLabelText('Down payment'),{target:{value:'0'}});
 expect(state.account?.output).toEqual({...runCalculator(mortgageCalculator,state.account!.input).output,mortgageContext:{version:1,propertyPrice:Number((screen.getByLabelText('Property price') as HTMLInputElement).value),downPayment:Number((screen.getByLabelText('Down payment') as HTMLInputElement).value),scope:'principal-and-interest-only'}});
});
it.each(['-1','400000','400001'])('rejects invalid derived principal for down payment %s without clamping',value=>{
 render(<CalculatorInteractive slug={mortgageCalculator.slug}/>);fireEvent.click(screen.getByRole('button',{name:'Advanced'}));
 fireEvent.change(screen.getByLabelText('Down payment'),{target:{value}});
 expect(state.account?.output).toBeNull();expect(screen.getByRole('alert')).toBeTruthy();expect(screen.queryByRole('region',{name:'Goal Solver'})).toBeNull();expect(screen.queryByRole('table')).toBeNull();
});
it('reports an invalid reverse target without clearing the valid core result',()=>{
 state.plan='pro';render(<CalculatorInteractive slug={mortgageCalculator.slug}/>);fireEvent.click(screen.getByRole('button',{name:'Advanced'}));
 fireEvent.change(screen.getByLabelText('Target monthly principal & interest'),{target:{value:''}});
 expect(screen.getByLabelText('Goal Solver').querySelector('[role="alert"]')).toBeTruthy();expect(state.account?.output).not.toBeNull();
});
it('fails closed for finite extreme inputs rejected by the engine',()=>{
 render(<CalculatorInteractive slug={mortgageCalculator.slug}/>);
 fireEvent.change(screen.getByLabelText('Property price'),{target:{value:'1e308'}});
 fireEvent.change(screen.getByLabelText('Annual mortgage rate (%)'),{target:{value:'1000'}});
 expect(state.account?.output).toBeNull();expect(screen.getByRole('alert')).toBeTruthy();
});
it('does not offer exports when a schema-valid tiny rate makes the engine reject nonfinite aggregates',()=>{
 render(<CalculatorInteractive slug={mortgageCalculator.slug}/>);
 fireEvent.change(screen.getByLabelText('Annual mortgage rate (%)'),{target:{value:'1e-300'}});
 expect(state.account?.output).toBeNull();expect(screen.getByRole('alert')).toBeTruthy();expect(document.querySelector('.final-calculator-renderer')).toBeNull();
});
it.each(['0','1000'])('retains valid rate comparison data at boundary %s with explicit unavailable inputs',rate=>{
 state.plan='pro';render(<CalculatorInteractive slug={mortgageCalculator.slug}/>);
 fireEvent.change(screen.getByLabelText('Annual mortgage rate (%)'),{target:{value:rate}});fireEvent.click(screen.getByRole('button',{name:'Advanced'}));
 expect(screen.getByRole('table',{name:'Scenario comparison: Monthly principal & interest'})).toBeTruthy();
 expect(screen.getByRole('table',{name:'Sensitivity analysis: Monthly principal & interest'})).toBeTruthy();
 expect(screen.getByText(/outside the supported engine inputs/)).toBeTruthy();
 expect(state.account?.output?.mortgageContext).toEqual({version:1,propertyPrice:400000,downPayment:80000,scope:'principal-and-interest-only'});
 expect(state.account?.output?.rateAnalysis).toBeTruthy();
});
it('keeps identical raw analytical sidecars across plans while gating paid surfaces and clearing stale analysis',()=>{
 let snapshot:unknown=null;
 for(const plan of ['free','pro','business']){
  state.plan=plan;render(<CalculatorInteractive slug={mortgageCalculator.slug}/>);fireEvent.click(screen.getByRole('button',{name:'Advanced'}));
  snapshot??=state.account?.output;expect(state.account?.output).toEqual(snapshot);
  expect(Boolean(screen.queryByRole('region',{name:'Mortgage aggregate comparison totals'}))).toBe(plan!=='free');
  fireEvent.change(screen.getByLabelText('Down payment'),{target:{value:''}});expect(state.account?.output).toBeNull();
  fireEvent.change(screen.getByLabelText('Down payment'),{target:{value:'80000'}});expect(state.account?.output).toEqual(snapshot);
  fireEvent.click(screen.getByRole('button',{name:'Simple'}));expect(state.account?.output?.rateAnalysis).toBeUndefined();cleanup();
 }
});
it('identifies unavailable sensitivity rates accessibly without substituting or hiding them',()=>{
 state.plan='pro';render(<CalculatorInteractive slug={mortgageCalculator.slug}/>);fireEvent.change(screen.getByLabelText('Annual mortgage rate (%)'),{target:{value:'1000'}});fireEvent.click(screen.getByRole('button',{name:'Advanced'}));
 const rates=screen.getByRole('list',{name:'Unavailable Mortgage annual rates'});expect(rates.textContent).toMatch(/1,001\s*%/);expect(rates.textContent).toMatch(/1,002\s*%/);expect(rates.textContent).toContain('Outside supported engine inputs');
});
it.each(['0','-1'])('rejects nonpositive reverse target %s rather than presenting solved zero',value=>{
 state.plan='pro';render(<CalculatorInteractive slug={mortgageCalculator.slug}/>);fireEvent.click(screen.getByRole('button',{name:'Advanced'}));fireEvent.change(screen.getByLabelText('Target monthly principal & interest'),{target:{value}});
 expect(screen.getByLabelText('Goal Solver').querySelector('[role="alert"]')).toBeTruthy();expect(state.account?.output).not.toBeNull();
});
