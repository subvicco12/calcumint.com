/** @vitest-environment jsdom */
import React from "react";
import {cleanup,fireEvent,render,screen} from "@testing-library/react";
import {afterEach,describe,expect,it,vi} from "vitest";

const account=vi.hoisted(()=>({input:null as unknown,output:null as unknown,plan:"free"}));
vi.mock("@/components/use-calculator-plan",()=>({useCalculatorPlan:()=>account.plan}));
vi.mock("@/components/calculator-account-actions",()=>({CalculatorAccountActions:(props:{input:unknown;output:unknown})=>{account.input=props.input;account.output=props.output;return null;}}));
import {CalculatorInteractive} from "./calculator-interactive";

afterEach(()=>{cleanup();account.plan="free";});
// All thirteen routes were present in the read-only hosted publication snapshot.
const cohort=[
 ["quadratic-formula-calculator","Constant c"],
 ["matrix-determinant-calculator","a (row 1, col 1)"],
 ["system-of-equations-solver","c"],
 ["matrix-inverse-calculator","b"],
 ["complex-number-calculator","First imaginary (b)"],
 ["vector-calculator","Aᵧ"],
 ["sequence-calculator","Common difference (d)"],
 ["z-score-calculator","Mean"],
 ["confidence-interval-calculator","Estimate"],
 ["sample-size-calculator","Expected proportion (0–1)"],
 ["probability-calculator","Probability of A (0–1)"],
 ["binomial-probability-calculator","Successes (k)"],
 ["normal-distribution-calculator","Mean (μ)"],
] as const;

describe("Published deterministic calculators preserve missing required input",()=>{
 it.each(cohort)("%s preserves input/output artifacts across Free, Pro, and Business",(slug,zeroLabel)=>{
  const artifacts:{baseline:{input:unknown;output:unknown};zero:{input:unknown;output:unknown}}[]=[];
  for(const plan of ["free","pro","business"]){
   account.plan=plan;
   render(<CalculatorInteractive slug={slug}/>);
   const baseline=structuredClone({input:account.input,output:account.output});
   expect(baseline.output).not.toBeNull();
   const field=screen.getByLabelText(zeroLabel) as HTMLInputElement,original=field.value;
   fireEvent.change(field,{target:{value:""}});
   expect(account.output).toBeNull();
   expect(document.querySelector(".final-calculator-renderer")).toBeNull();
   fireEvent.change(field,{target:{value:"0"}});
   const zero=structuredClone({input:account.input,output:account.output});
   expect(zero.output).not.toBeNull();
   fireEvent.change(field,{target:{value:original}});
   expect({input:account.input,output:account.output}).toEqual(baseline);
   artifacts.push({baseline,zero});
   cleanup();
  }
  expect(artifacts[1]).toEqual(artifacts[0]);
  expect(artifacts[2]).toEqual(artifacts[0]);
 });

 it.each(cohort)("%s suppresses calculation and account capture for every blank numeric input, then restores the same output",slug=>{
  const {container}=render(<CalculatorInteractive slug={slug}/>);
  const baseline=structuredClone(account.output);
  expect(baseline).not.toBeNull();
  for(const field of screen.getAllByRole("spinbutton") as HTMLInputElement[]){
   const original=field.value;
   fireEvent.change(field,{target:{value:""}});
   expect(container.querySelector(".final-calculator-renderer"),field.outerHTML).toBeNull();
   expect(screen.getByText("Enter valid inputs")).toBeTruthy();
   // The real account component disables saves/downloads when output is null.
   expect(account.output).toBeNull();
   fireEvent.change(field,{target:{value:original}});
   expect(container.querySelector(".final-calculator-renderer")).not.toBeNull();
   expect(account.output).toEqual(baseline);
  }
 });
 it.each(cohort)("%s accepts an explicitly entered zero where the engine domain allows it",(slug,zeroLabel)=>{
  const {container}=render(<CalculatorInteractive slug={slug}/>);
  fireEvent.change(screen.getByLabelText(zeroLabel),{target:{value:"0"}});
  expect(account.output).not.toBeNull();
  expect(container.querySelector(".final-calculator-renderer")).not.toBeNull();
 });
});
