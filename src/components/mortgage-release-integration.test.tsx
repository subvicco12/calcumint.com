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
 expect(state.account?.output).toEqual(runCalculator(mortgageCalculator,state.account!.input).output);
 expect(document.querySelector('.governed-schedule')).toBeNull();
 expect(screen.getByText(/mortgage insurance/i)).toBeTruthy();
 for(const label of ["Property price","Down payment","Annual mortgage rate (%)","Term (months)"]){
  const field=screen.getByLabelText(label);const original=(field as HTMLInputElement).value;
  fireEvent.change(field,{target:{value:""}});expect(state.account?.output).toBeNull();expect(screen.getByRole('alert')).toBeTruthy();expect(document.querySelector('.final-calculator-renderer')).toBeNull();
  fireEvent.change(field,{target:{value:original}});expect(state.account?.output).not.toBeNull();
 }
 fireEvent.change(screen.getByLabelText('Annual mortgage rate (%)'),{target:{value:'0'}});fireEvent.change(screen.getByLabelText('Down payment'),{target:{value:'0'}});
 expect(state.account?.output).toEqual(runCalculator(mortgageCalculator,state.account!.input).output);
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
