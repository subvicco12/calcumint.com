/** @vitest-environment jsdom */
import React from "react";
import {cleanup,fireEvent,render,screen} from "@testing-library/react";
import {afterEach,describe,expect,it,vi} from "vitest";
import hosted from "../../docs/calculator-first/hosted-rows.json";
import previous from "../../docs/full-product-batch21/validation.json";
import closed from "../../docs/calculator-first/engineering-closure.json";
const account=vi.hoisted(()=>({output:null as unknown,mounted:false,input:{} as Record<string,unknown>,slug:"",version:0,plan:"pro"}));
vi.mock("@/components/use-calculator-plan",()=>({useCalculatorPlan:()=>account.plan}));
vi.mock("@/components/calculator-account-actions",()=>({CalculatorAccountActions:(props:{output:unknown;input:Record<string,unknown>;calculatorSlug:string;calculatorVersion:number})=>{account.output=props.output;account.input=props.input;account.slug=props.calculatorSlug;account.version=props.calculatorVersion;account.mounted=true;return null;}}));
import {calculatorRegistry} from "@/calculators/registry";
import {runCalculator} from "@/calculators/engine";
import {verifyRegisteredSnapshot} from "@/lib/registered-snapshot-verification";
import {CalculatorInteractive} from "./calculator-interactive";
const prior=new Set([...previous.browser.journeys.map(row=>row.slug),...closed.affectedCalculators.map(row=>row.slug)]);
const cohort=hosted.rows.filter(row=>row.lifecycle==="published"&&!prior.has(row.slug)).map(row=>row.slug).sort();
afterEach(()=>{cleanup();account.output=null;account.mounted=false;});
const result=()=>document.querySelector(".final-calculator-renderer")?.outerHTML??null;
describe("Batch22 exact remaining public live interfaces",()=>{
 it("excludes every prior-wave journey and pins 43 public interfaces",()=>{expect(cohort).toHaveLength(43);expect(new Set(cohort).size).toBe(43);for(const slug of cohort)expect(prior.has(slug)).toBe(false);});
 it.each(cohort)("%s rejects blank required fields and recovers its real result",slug=>{
  render(<CalculatorInteractive slug={slug}/>);const baseline=result();expect(baseline).not.toBeNull();
  const fields=[...document.querySelectorAll<HTMLInputElement|HTMLTextAreaElement>(".calculator-ui input:not([type=checkbox]):not([type=radio]),.calculator-ui textarea")].filter(e=>!e.closest(".account-actions")&&e.value.trim()!=="");
  expect(fields.length).toBeGreaterThan(0);
  for(const field of fields){const original=field.value;fireEvent.change(field,{target:{value:""}});expect(result(),field.outerHTML).toBeNull();expect(screen.getByText(/Enter valid (inputs|values in all required fields and supported ranges\.)/)).toBeTruthy();if(account.mounted)expect(account.output).toBeNull();fireEvent.change(field,{target:{value:original}});expect(result()).toEqual(baseline);
   for(const invalid of ["not valid","Infinity","1e309"]){fireEvent.change(field,{target:{value:invalid}});expect(result(),`${slug}: ${invalid}`).toBeNull();if(account.mounted)expect(account.output).toBeNull();fireEvent.change(field,{target:{value:original}});expect(result()).toEqual(baseline);}}
 });
});

const physics11=["angular-velocity","capacitance","coulomb-force","current","electrical-power","free-fall","ohms-law","projectile-motion","resistance","torque","voltage"].map(name=>name+"-calculator");
it.each(physics11)("%s captures exact engine artifacts across plans and verifies exact replay",slug=>{
 const definition=calculatorRegistry.getBySlug(slug)!;const captures:unknown[]=[];
 for(const plan of ["free","pro","business"]){account.plan=plan;account.mounted=false;render(<CalculatorInteractive slug={slug}/>);expect(account.mounted).toBe(true);expect(account.slug).toBe(slug);expect(account.version).toBe(definition.version);expect(account.output).toEqual(runCalculator(definition,account.input).output);const snapshot={calculatorSlug:slug,calculatorVersion:account.version,input:account.input,output:account.output};expect(verifyRegisteredSnapshot(snapshot)).toMatchObject({engineId:definition.id,engineVersion:definition.version,snapshot});captures.push(structuredClone(snapshot));for(const field of screen.getAllByRole("spinbutton") as HTMLInputElement[]){const original=field.value;fireEvent.change(field,{target:{value:""}});expect(account.output).toBeNull();fireEvent.change(field,{target:{value:original}});expect(account.output).toEqual(snapshot.output);}cleanup();}expect(captures[1]).toEqual(captures[0]);expect(captures[2]).toEqual(captures[0]);account.plan="pro";
});
