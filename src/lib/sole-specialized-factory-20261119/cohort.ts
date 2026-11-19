import {compilePrivateFinal,encodePrivateFinalInputs} from '../calculator-factory/private-final/adapter';
import {launchDefinitions} from '@/calculators/launch-portfolio';
import {functionPlotter3dCalculator} from '@/calculators/advanced-math/catalog-final';
import type {CalculatorDefinition} from '@/calculators/types';
import type {FactoryWorkbenchField} from '@/components/sole-civil-time-20261119/workbench';
import type {FactoryExecutionPacket} from '../calculator-factory/workflows';
import {copyCalculationData} from '../calculation-snapshot';
import {equalCompletionJson} from '@/calculators/completion-contracts';

type Engine=CalculatorDefinition<Record<string,unknown>,Record<string,unknown>>;
type InputField=FactoryWorkbenchField & {encoding?:'json'|'boolean'};
const field=(key:string,label:string,unit:string):InputField=>({key,label,unit,kind:'number'});
const fuel=launchDefinitions.find(definition=>definition.id==='launch-fuel-cost-calculator'&&definition.slug==='fuel-cost-calculator'&&definition.version===1);
if(!fuel)throw Error('Exact registered Fuel Cost v1 missing');
const specs=[
 [458,fuel,'currency units','Fuel cost','result','Enter fuel quantity and the price per matching volume unit. No distance, fuel economy or currency conversion is inferred.',
  [field('fuel','Fuel quantity','chosen volume unit'),field('price','Price per fuel unit','currency units per volume unit')]],
 [252,functionPlotter3dCalculator,'dimensionless','Maximum sampled value','maximum','Evaluates the original bounded expression grammar on the v1 grid. The preview shows samples; it makes no continuity or global-extremum claim.',
  [{key:'expression',label:'Surface expression in x and y',kind:'text'},field('minX','Minimum x',''),field('maxX','Maximum x',''),field('minY','Minimum y',''),field('maxY','Maximum y','')]],
] as const satisfies readonly (readonly [number,unknown,string,string,string,string,readonly InputField[]])[];
export const specializedContracts=Object.freeze(specs.map(([catalogId,definition,unit,label,key,limitations,fields])=>{
 const engine=definition as unknown as Engine;
 return compilePrivateFinal<Record<string,unknown>,Record<string,unknown>,InputField>(engine,{catalogId,revision:'sole-specialized-factory-20261119.1',unit,fields,limitations,

  presentation:{id:`structured-${catalogId}`,domain:catalogId===252?'advanced-math-graphing':'travel',family:'technical-engineering',level:'essential',supportedVisualizations:[]},
  project(output){
   const value=output[key];
   if(typeof value!=='string'&&typeof value!=='number')throw Error('Expected structured engine headline');
   return {primaryResult:{id:key,label,value,unit}};
  },
 });
}));
export function specializedContract(id:number){
 const row=specializedContracts.find(candidate=>candidate.catalogId===id);
 if(!row)throw Error('Private specialized factory identity unavailable');
 return row;
}
export const specializedWorkflows=(id:number)=>specializedContract(id).workflows;
export function verifySpecializedFactoryPacket(packet:unknown){
 const clean=copyCalculationData({value:packet},{}).input.value as FactoryExecutionPacket;
 if(!clean||typeof clean.identity?.catalogId!=='number')throw Error('Expected private factory packet');
 return specializedWorkflows(clean.identity.catalogId).verify(clean);
}
export function verifySpecializedFactorySnapshot(value:unknown){
 const clean=copyCalculationData({value},{}).input.value;
 if(!clean||typeof clean!=='object'||Array.isArray(clean))throw Error('Expected private specialized snapshot');
 const tuple=clean as {calculatorSlug?:unknown;calculatorVersion?:unknown};
 const profile=specializedContracts.find(row=>row.slug===tuple.calculatorSlug&&row.version===tuple.calculatorVersion);
 if(!profile)throw Error('Private factory version unavailable');
 return profile.verifyHistorical(clean);
}
export function prepareSpecializedFactoryRecovery(value:unknown){
 const checked=verifySpecializedFactorySnapshot(value);
 let packet:FactoryExecutionPacket;
 try{packet=specializedWorkflows(checked.catalogId).execute(encodePrivateFinalInputs(checked.snapshot.input));}
 catch{return {...checked,currentCaptureAvailable:false as const};}
 if(!equalCompletionJson(checked.snapshot,packet.snapshot))throw Error('Historical replay mismatch');
 return {...checked,currentCaptureAvailable:true as const};
}
