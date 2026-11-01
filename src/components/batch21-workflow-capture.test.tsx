/** @vitest-environment jsdom */
import React from "react";
import {cleanup,fireEvent,render,screen} from "@testing-library/react";
import {afterEach,describe,expect,it,vi} from "vitest";
import {physicsBatch1Definitions} from "@/calculators/physics/catalog-batch-1";
import {statisticsBatch4Definitions} from "@/calculators/statistics/catalog-batch-4";
import {runCalculator} from "@/calculators/engine";
import type {CalculatorDefinition} from "@/calculators/types";
const account=vi.hoisted(()=>({props:null as null|{calculatorSlug:string;calculatorVersion:number;input:unknown;output:unknown;scenarioDisplayMetadata?:unknown},plan:"free"}));
vi.mock("@/components/use-calculator-plan",()=>({useCalculatorPlan:()=>account.plan}));
vi.mock("@/components/calculator-account-actions",()=>({CalculatorAccountActions:(props:NonNullable<typeof account.props>)=>{account.props=props;return null;}}));
import {CalculatorInteractive} from "./calculator-interactive";
afterEach(()=>{cleanup();account.props=null;account.plan="free";});
const physicsInputs=[
 {distance:10,time:2},{displacement:10,time:2},{initialVelocity:10,finalVelocity:2,time:4},
 {speed:10,time:2},{mass:10,acceleration:2},{force:10,distance:2,angleDegrees:0},
 {work:10,time:2},{mass:10,velocity:2},{mass:2,gravity:9.81,height:5},
];
const statisticsInputs=[
 {xValues:[1,2,3,4],yValues:[2,4,6,8]}, {values:[1,2,3,4],weights:[2,4,6,8]},
 {values:[1,2,3,4],percentile:75},{values:[1,2,3,4],quartileNumber:1},
 {values:[1,2,3,4]},{mean:10,standardDeviation:2},
 {outcomes:[0,10],probabilities:[0.25,0.75]},
 {prior:0.2,likelihood:0.8,evidenceGivenNot:0.1},{odds:3},
];
const cohort=[...physicsBatch1Definitions.map((definition,index)=>({definition,input:physicsInputs[index]})),...statisticsBatch4Definitions.map((definition,index)=>({definition,input:statisticsInputs[index]}))];
function assertCapture(definition:typeof cohort[number]["definition"],input:unknown){
 expect(account.props).not.toBeNull();
 expect(account.props!.calculatorSlug).toBe(definition.slug);
 expect(account.props!.calculatorVersion).toBe(definition.version);
 expect(account.props!.input).toEqual(input);
 const output=runCalculator(definition as CalculatorDefinition<unknown,unknown>,input).output;
 expect(account.props!.output).toEqual(output);
 if(account.props!.scenarioDisplayMetadata!==undefined){
  expect(account.props!.scenarioDisplayMetadata).toMatchObject({calculatorSlug:definition.slug,calculatorVersion:definition.version});
 }
}
describe("Batch 21 existing account workflow bindings for eighteen published tools",()=>{
 it.each(cohort)("$definition.slug binds exact native engine artifacts across plans",({definition,input})=>{
  const artifacts:unknown[]=[];
  for(const plan of ["free","pro","business"]){
   account.plan=plan;account.props=null;render(<CalculatorInteractive slug={definition.slug}/>);
   assertCapture(definition,input);
   artifacts.push(structuredClone(account.props));cleanup();
  }
  expect(artifacts[1]).toEqual(artifacts[0]);expect(artifacts[2]).toEqual(artifacts[0]);
 });
 it.each(cohort)("$definition.slug suppresses invalid account output and restores native artifacts",({definition,input})=>{
  render(<CalculatorInteractive slug={definition.slug}/>);assertCapture(definition,input);
  const baseline=structuredClone(account.props);
  // Every displayed list and active numeric field is required; odds/probability are alternatives.
  const fields=(screen.queryAllByRole("spinbutton",{hidden:true}) as HTMLInputElement[]).filter(field=>field.value!=="");
  for(const field of fields){
   const original=field.value;fireEvent.change(field,{target:{value:""}});
   expect(account.props!.output).toBeNull();expect(document.querySelector(".final-calculator-renderer")).toBeNull();
   fireEvent.change(field,{target:{value:original}});expect(account.props).toEqual(baseline);
  }
  for(const field of screen.queryAllByRole("textbox") as HTMLInputElement[]){
   const original=field.value;fireEvent.change(field,{target:{value:"1,,2"}});
   expect(account.props!.output).toBeNull();expect(document.querySelector(".final-calculator-renderer")).toBeNull();
   fireEvent.change(field,{target:{value:original}});expect(account.props).toEqual(baseline);
  }
 });
});
