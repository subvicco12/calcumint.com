import {describe,expect,it} from 'vitest';
import {compilePrivateFinal,encodePrivateFinalInputs} from './adapter';
import {finalContracts,finalWorkflows,verifyFinalFactorySnapshot} from '@/lib/sole-final-factory-20261119/cohort';
import {energyContract,energyWorkflows} from '@/lib/sole-electrical-energy-20261119/cohort';
import {algebraContract,algebraWorkflows} from '@/lib/sole-bounded-algebra-20261119/cohort';
import {mathContract,mathWorkflows} from '@/lib/sole-mathematical-tools-20261119/cohort';
import {linearContract,linearWorkflows} from '@/lib/sole-linear-systems-20261119/cohort';
import {timeContract,timeWorkflows} from '@/lib/sole-civil-time-20261119/cohort';
import {earthContract,earthWorkflows} from '@/lib/sole-earth-astronomy-20261119/cohort';
import {calculatorRegistry} from '@/calculators/registry';
import type {CalculatorDefinition} from '@/calculators/types';

type Engine=CalculatorDefinition<Record<string,unknown>,Record<string,unknown>>;
const fixture=[
 [energyContract(362).engine,energyWorkflows(362),{voltageVolts:120,currentAmps:12.5},'value','VA'],
 [algebraContract(245).engine,algebraWorkflows(245),{ax:0,ay:0,az:0,bx:1,by:0,bz:0},'dot',''],
 [mathContract(240).engine,mathWorkflows(240),{a11:1,a12:2,a21:0,a22:1,b11:3,b12:0,b21:4,b22:2,operation:'multiply'},'determinant',''],
 [linearContract(244).engine,linearWorkflows(244),{a:2,b:4,c:1,d:1,operation:'divide'},'display',''],
 [timeContract(450).engine,timeWorkflows(450),{shifts:[{startTime:'22:30',endTime:'02:00',overnight:true,breakMinutes:30}]},'totalMinutes','min'],
 [earthContract(534).engine,earthWorkflows(534),{value:1,fromUnit:'au',toUnit:'km'},'result','km'],
 [linearContract(242).engine,linearWorkflows(242),{a:2,b:1,c:0,d:4},'m21',''],
 [linearContract(238).engine,linearWorkflows(238),{a:1,b:0,c:4},'root1Text',''],
] as const;

describe('exact private Final factory',()=>{
 it.each(fixture)('reproduces retained reference model %#',(engine,reference,input,key,unit)=>{
  const profile=compilePrivateFinal(engine as unknown as Engine,{catalogId:reference.identity.catalogId!,revision:'test-reference',
   unit,limitations:'Private reference comparison',fields:Object.entries(input).map(([key,value])=>({key,label:key,
    kind:typeof value==='number'?'number':'text',encoding:Array.isArray(value)?'json':undefined})),
   presentation:{id:'reference',domain:'math',family:'technical-engineering',level:'essential',supportedVisualizations:[]},
   project:output=>({primaryResult:{id:key,label:key,value:output[key] as string|number,unit}}),
  });
  const raw=encodePrivateFinalInputs(input),expected=reference.execute(raw).snapshot;
  const actual=profile.workflows.execute(raw);
  expect(actual.snapshot).toEqual(expected);
  expect(profile.verifyHistorical(expected).snapshot).toEqual(expected);
  expect(profile.workflows.replay(profile.workflows.exportPacket(actual,'json','pro'))).toEqual(actual);
  expect(profile.result(actual).primaryResult.value).toBe(expected.output[key]);
  expect(profile.workflows.exportPacket(actual,'csv','pro')).toContain(`"outputUnit","${unit}"`);
 });
 it.each([
  [326,{force:'12',leverArm:'2',angle:'90'},24],
  [330,{formula:'CO2'},44.009],
  [509,{distanceKm:'400',litersPer100Km:'7',pricePerLiter:'1.5'},42],
 ] as const)('invokes immutable registry v1 and rejects substitutions #%s',(id,raw,witness)=>{
  const profile=finalContracts.find(item=>item.catalogId===id)!;
  expect(calculatorRegistry.getById(profile.engineId)).toBe(profile.engine);
  const flow=finalWorkflows(id),packet=flow.execute(raw);
  expect(packet.snapshot.output.value).toBeCloseTo(witness,10);
  expect(verifyFinalFactorySnapshot(packet.snapshot).snapshot).toEqual(packet.snapshot);
  expect(()=>verifyFinalFactorySnapshot({...packet.snapshot,calculatorVersion:2})).toThrow();
  expect(()=>flow.verify({...packet,identity:{...packet.identity,sourceVersion:'forged'}})).toThrow();
  expect(()=>flow.exportPacket(packet,'csv','free')).toThrow();
 });
 it('refuses invalid domain values without changing engine rules',()=>{
  expect(()=>finalWorkflows(326).execute({force:'12',leverArm:'2',angle:'181'})).toThrow();
  expect(()=>finalWorkflows(330).execute({formula:'Xx2'})).toThrow();
  expect(()=>finalWorkflows(509).execute({distanceKm:'-1',litersPer100Km:'7',pricePerLiter:'1.5'})).toThrow();
 });
 it('retains rounded-zero v1 history independently of present capture policy',()=>{
  const prior=earthContract(532);
  const profile=compilePrivateFinal(prior.engine as unknown as Engine,{catalogId:532,revision:'test-historical',unit:'years',fields:prior.fields,
   limitations:prior.limitations,presentation:{id:'retained',domain:'physics',family:'technical-engineering',level:'essential',supportedVisualizations:[]},
   project:output=>({primaryResult:{id:'value',label:'Orbital period',value:output.value as number}})});
  const snapshot={calculatorSlug:prior.slug,calculatorVersion:1,input:{semiMajorAxisAu:1e-12,centralMassSolar:1},output:{value:0,steps:['Orbital Period = 0']}};
  expect(profile.verifyHistorical(snapshot).snapshot).toEqual(snapshot);
  expect(()=>earthWorkflows(532).execute(encodePrivateFinalInputs(snapshot.input))).toThrow();
 });
});
