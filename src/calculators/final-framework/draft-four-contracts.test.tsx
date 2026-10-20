// @vitest-environment jsdom
import {describe,it,expect} from "vitest";
import {renderToStaticMarkup} from "react-dom/server";
import {FinalCalculatorRenderer} from "@/components/final-calculator-renderer";
import {calculatorRegistry} from "../registry";
import {serializeCalculationJson} from "@/lib/calculation-snapshot";
import {serializeCalculationCsv} from "@/lib/calculation-export";
import {GRAVITY_REFERENCE_VERSION} from "../astronomy/draft-master-531";
import {calculateDraftFour,draftFourPresentation} from "./draft-four-contracts";
const cases=[
 [206,{operation:"cos",x:"90",angleMode:"degrees"},"0"],
 [517,{assessments:[{score:80,weight:4},{score:90,weight:6}],mode:"weighted",missingPolicy:"reject",scale:{minScore:0,maxScore:100}},86],
 [518,{sleepStart:"2026-11-01T01:30-04:00",wakeEnd:"2026-11-01T01:30-05:00",awakeMinutes:15},45],
 [531,{bodyMass:70,massUnit:"kg",body:"standard-earth",referenceVersion:GRAVITY_REFERENCE_VERSION},70*9.80665]
]as const;
describe("four authorized DRAFT contracts",()=>{
 for(const[id,input,value]of cases)it(`${id} shared renderer, exports and plan parity`,()=>{
  const{snapshot,result}=calculateDraftFour(id,input);expect(result.primaryResult.value).toBe(value);
  expect(calculatorRegistry.getBySlug(snapshot.calculatorSlug)).toBeUndefined();
  expect(JSON.parse(serializeCalculationJson(snapshot)).output).toEqual(snapshot.output);
  expect(serializeCalculationCsv(snapshot.input,snapshot.output)).toContain('"output"');
  for(const plan of["free","pro","business"]as const){const html=renderToStaticMarkup(<FinalCalculatorRenderer result={result} plan={plan} presentation={draftFourPresentation}/>);expect(html).toContain('role="status"');expect(html).toContain("DRAFT");expect(html).toContain("Methodology");expect(html).toContain("Sources");}
 });
 it.each([206,517,518,531]as const)("rejects corrupt inputs before capture/export %s",id=>expect(()=>calculateDraftFour(id,{result:Infinity})).toThrow());
 it("preserves signed nonzero scientific values and inverse-angle units",()=>{
  const {result}=calculateDraftFour(206,{operation:"asin",x:"-0.5",angleMode:"degrees"});expect(result.primaryResult).toMatchObject({value:"-30",unit:"degrees"});
  const tiny=calculateDraftFour(206,{operation:"cos",x:"89.99999999999999999999999999999999",angleMode:"degrees"});expect(tiny.result.primaryResult.value).not.toBe("0");
 });
 it("captures original inputs immutably",()=>{const input={sleepStart:"2026-01-01T23:00Z",wakeEnd:"2026-01-02T07:00Z",awakeMinutes:30};const a=calculateDraftFour(518,input);input.awakeMinutes=0;expect(a.snapshot.input.awakeMinutes).toBe(30);expect(Object.isFrozen(a.snapshot.output)).toBe(true);});
 it("does not guess an unsupported identity",()=>expect(()=>calculateDraftFour(410 as never,{})).toThrow());
 it("discloses model and grading scope",()=>{
  const grade=calculateDraftFour(517,cases[1][1]).result;expect(grade.warnings?.join(" ")).toContain("institution");
  const planet=calculateDraftFour(531,cases[3][1]).result;expect(planet.warnings?.join(" ")).toContain("spherical");
 });
});
