import {describe,it,expect} from 'vitest';
import {calculatorRegistry} from '@/calculators/registry';
import {runCalculator} from '@/calculators/engine';
import {createCalculationSnapshot,serializeCalculationJson} from './calculation-snapshot';
import {captureScenario} from './scenario-set';
import {serializeScenarioReportJson} from './scenario-report';
import {recoverScenarioSetJson} from './scenario-set-recovery';
import {verifyRegisteredSnapshot} from './registered-snapshot-verification';
import {batch21ReplayBindings} from './batch21-snapshot-replay';

const cases=[
 {slug:'graphing-calculator',input:{expression:'x^2',minX:-5,maxX:5},other:{expression:'x',minX:-5,maxX:5}},
 {slug:'function-plotter-2d',input:{expression:'x^2',minX:-5,maxX:5},other:{expression:'x',minX:-5,maxX:5}},
 {slug:'volume-calculator',input:{length:2,width:3,height:4},other:{length:3,width:3,height:4}},
 {slug:'slope-calculator',input:{x1:0,y1:0,x2:2,y2:4},other:{x1:0,y1:0,x2:2,y2:6}},
 {slug:'standard-deviation-calculator',input:{values:[1,2,3],kind:'population'},other:{values:[1,2,3],kind:'sample'}},
 {slug:'variance-calculator',input:{values:[1,2,3],kind:'population'},other:{values:[1,2,3],kind:'sample'}},
];
function snapshot(slug:string,input:Record<string,unknown>){const d=calculatorRegistry.getBySlug(slug)!;return createCalculationSnapshot({calculatorSlug:slug,calculatorVersion:d.version,input,output:runCalculator(d,input).output as Record<string,unknown>});}
describe('six exact forward-engine snapshot bindings',()=>{
 it('allowlists only six exact current versions',()=>{expect(batch21ReplayBindings).toHaveLength(6);expect(batch21ReplayBindings.find(x=>x.slug==='slope-calculator')?.version).toBe(2);});
 it.each(cases)('verifies serialized history and two-scenario report for $slug without changing bytes',({slug,input,other})=>{
  const a=snapshot(slug,input),b=snapshot(slug,other),bytes=serializeCalculationJson(a);
  const verified=verifyRegisteredSnapshot(JSON.parse(bytes));expect(verified.snapshot).toEqual(a);expect(serializeCalculationJson(a)).toBe(bytes);
  let rows=captureScenario([],'A',a,'baseline');rows=captureScenario(rows,'B',b,'alternative');
  const report=serializeScenarioReportJson(rows),restored=recoverScenarioSetJson(report,a);
  expect(restored.map(x=>x.snapshot)).toEqual([a,b]);expect(serializeScenarioReportJson(restored)).toBe(report);
  // The verifier/report accept no plan argument: the identical recorded artifact is used for every plan.
  for(const plan of ['free','pro','premium']){expect(plan).toBeTruthy();expect(verifyRegisteredSnapshot(JSON.parse(bytes)).snapshot).toEqual(a);}
  const fake=()=>JSON.parse(bytes);
  for(const mutate of [(x:ReturnType<typeof fake>)=>{x.calculatorVersion=99;},(x:ReturnType<typeof fake>)=>{x.input={...x.input,unexpected:1};},(x:ReturnType<typeof fake>)=>{x.output={...x.output,unexpected:1};},(x:ReturnType<typeof fake>)=>{x.output.steps=['tampered'];},(x:ReturnType<typeof fake>)=>{x.certified=true;},(x:ReturnType<typeof fake>)=>{x.input=other;},(x:ReturnType<typeof fake>)=>{x.calculatorSlug='unknown';}]){const x=fake();mutate(x);expect(()=>verifyRegisteredSnapshot(x)).toThrow();}
  const tamperedReport=JSON.parse(report);tamperedReport.scenarios[1].output.steps=['tampered'];
  expect(()=>recoverScenarioSetJson(JSON.stringify(tamperedReport),a)).toThrow();
  expect(serializeCalculationJson(a)).toBe(bytes);
 });
 it('rejects slope v1 instead of upgrading its saved contract',()=>{const x=snapshot('slope-calculator',{x1:0,y1:0,x2:2,y2:4});expect(()=>verifyRegisteredSnapshot({...x,calculatorVersion:1})).toThrow();});
});
