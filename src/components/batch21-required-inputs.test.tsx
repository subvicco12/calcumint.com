/** @vitest-environment jsdom */
import React from "react";
import {cleanup,fireEvent,render,screen} from "@testing-library/react";
import {afterEach,describe,expect,it,vi} from "vitest";
import hosted from "../../docs/calculator-first/hosted-rows.json";
import {getLaunchSpec,launchDefinition} from "@/calculators/launch-portfolio";
const account=vi.hoisted(()=>({input:null as unknown,output:null as unknown,plan:"free"}));
vi.mock("@/components/use-calculator-plan",()=>({useCalculatorPlan:()=>account.plan}));
vi.mock("@/components/calculator-account-actions",()=>({CalculatorAccountActions:(props:{input:unknown;output:unknown})=>{account.input=props.input;account.output=props.output;return null;}}));
import {CalculatorInteractive} from "./calculator-interactive";
afterEach(()=>{cleanup();account.plan="free";account.input=null;account.output=null;});
const dedicated=[
 ["linear-equation-solver","Constant b"], ["rref-calculator","Row 1 · Col 1"],
 ["equation-solver","a"], ["derivative-calculator","x"],
 ["integral-calculator","Lower bound"], ["limit-calculator","Target x"],
 ["series-calculator","Start index"], ["polynomial-calculator","d"],
 ["root-finder-calculator","a (x³)"], ["matrix-calculator","A11"],
 ["function-plotter-3d","Minimum x"],
] as const;
const launch=hosted.rows.filter(row=>row.calculator_key.startsWith("launch-")).map(row=>row.slug);
const cohort=[...dedicated.map(([slug])=>slug),...launch];
const artifact=()=>structuredClone({input:account.input,output:account.output});
describe("Batch 21 published numeric input boundaries",()=>{
 it("pins its cohort to the read-only hosted publication snapshot",()=>{
  expect(launch).toHaveLength(118);
  expect(new Set(cohort).size).toBe(129);
  for(const slug of cohort)expect(hosted.rows.some(row=>row.slug===slug&&row.lifecycle==="published")).toBe(true);
 });
 it.each(cohort)("%s clears every required numeric field and restores account artifacts",slug=>{
  render(<CalculatorInteractive slug={slug}/>);
  expect(account.output).not.toBeNull();
  const baseline=artifact();
  for(const field of screen.getAllByRole("spinbutton") as HTMLInputElement[]){
   const original=field.value;
   fireEvent.change(field,{target:{value:""}});
   expect(account.output,field.outerHTML).toBeNull();
   expect(screen.getByText("Enter valid inputs")).toBeTruthy();
   expect(document.querySelector(".final-calculator-renderer")).toBeNull();
   fireEvent.change(field,{target:{value:original}});
   expect(artifact()).toEqual(baseline);
  }
 });
 it.each(cohort)("%s preserves default and valid-zero mathematical artifacts across plans",slug=>{
  const artifacts:unknown[]=[];
  for(const plan of ["free","pro","business"]){
   account.plan=plan;render(<CalculatorInteractive slug={slug}/>);
   expect(account.output).not.toBeNull();
   const baseline=artifact();
   let label:string|undefined=dedicated.find(([s])=>s===slug)?.[1];
   const spec=getLaunchSpec(slug);
   if(spec&&launch.includes(slug)){
    const defaults=Object.fromEntries(spec.fields.map(field=>[field.key,field.defaultValue]));
    label=spec.fields.find(field=>{try{const input={...defaults,[field.key]:0};launchDefinition(spec).inputSchema.parse(input);return Number.isFinite(spec.compute(input));}catch{return false;}})?.label;
   }
   let zero:unknown=null;
   if(label){fireEvent.change(screen.getByLabelText(label),{target:{value:"0"}});expect(account.output).not.toBeNull();zero=artifact();}
   artifacts.push({baseline,zero});cleanup();
  }
  expect(artifacts[1]).toEqual(artifacts[0]);expect(artifacts[2]).toEqual(artifacts[0]);
 });
});

// These published physics/statistics interfaces expose their real renderer directly.
// At baseline only permutation/combination mounted account actions; Batch21 workflow tests separately cover the new physics/statistics bindings.
const additional=[
 ["permutation-calculator","Selected objects (r)",true],
 ["combination-calculator","Selected objects (r)",true],
 ["percentile-calculator","Percentile (0–100)",false],
 ["coefficient-of-variation-calculator","Standard deviation",false],
 ["bayes-theorem-calculator","Prior P(H)",false],
 ["odds-calculator","Odds",false],
 ["speed-calculator","Distance",false], ["velocity-calculator","Displacement",false],
 ["acceleration-calculator","Initial velocity",false], ["distance-time-calculator","Speed",false],
 ["force-calculator","Mass",false], ["work-calculator","Force",false],
 ["power-calculator","Work",false], ["kinetic-energy-calculator","Mass",false],
 ["potential-energy-calculator","Mass",false],
] as const;
const renderedArtifact=()=>document.querySelector(".final-calculator-renderer")?.outerHTML??null;
describe("Batch 21 additional published unary-plus boundaries",()=>{
 it.each(additional)("%s rejects missing numeric input and restores its actual renderer",(slug,_zero,capturesAccount)=>{
  expect(hosted.rows.some(row=>row.slug===slug&&row.lifecycle==="published")).toBe(true);
  render(<CalculatorInteractive slug={slug}/>);
  const baseline=renderedArtifact(),baselineAccount=artifact();expect(baseline).not.toBeNull();
  const fields=screen.getAllByRole("spinbutton") as HTMLInputElement[];
  // Odds and probability are alternatives: clearing the active one leaves both missing.
  for(const field of fields.filter(field=>field.value!=="")){
   const original=field.value;fireEvent.change(field,{target:{value:""}});
   expect(renderedArtifact(),`${slug}: ${field.outerHTML}`).toBeNull();
   expect(screen.getByText("Enter valid inputs")).toBeTruthy();
   if(capturesAccount)expect(account.output).toBeNull();
   fireEvent.change(field,{target:{value:original}});
   expect(renderedArtifact()).toEqual(baseline);
   if(capturesAccount)expect(artifact()).toEqual(baselineAccount);
  }
 });
 it.each(additional)("%s preserves rendered defaults and explicit valid zero across plans",(slug,zeroLabel,capturesAccount)=>{
  const artifacts:unknown[]=[];
  for(const plan of ["free","pro","business"]){
   account.plan=plan;render(<CalculatorInteractive slug={slug}/>);
   const baseline=renderedArtifact();expect(baseline).not.toBeNull();
   fireEvent.change(screen.getByLabelText(zeroLabel),{target:{value:"0"}});
   const zero=renderedArtifact();expect(zero).not.toBeNull();
   artifacts.push({baseline,zero,...(capturesAccount?{account:artifact()}:{})});cleanup();
  }
  expect(artifacts[1]).toEqual(artifacts[0]);expect(artifacts[2]).toEqual(artifacts[0]);
 });
 it("odds accepts either explicit zero alternative and rejects both missing",()=>{
  render(<CalculatorInteractive slug="odds-calculator"/>);
  const odds=screen.getByLabelText("Odds") as HTMLInputElement;
  const probability=screen.getByLabelText("Probability (alternative input)") as HTMLInputElement;
  fireEvent.change(odds,{target:{value:"0"}});expect(renderedArtifact()).not.toBeNull();expect(probability.value).toBe("");
  fireEvent.change(probability,{target:{value:"0"}});expect(renderedArtifact()).not.toBeNull();expect(odds.value).toBe("");
  fireEvent.change(probability,{target:{value:""}});expect(renderedArtifact()).toBeNull();
  expect(screen.getByText("Enter valid inputs")).toBeTruthy();
 });
});
