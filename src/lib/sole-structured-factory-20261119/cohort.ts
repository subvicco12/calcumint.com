import {compilePrivateFinal,encodePrivateFinalInputs} from '../calculator-factory/private-final/adapter';
import {mathContract} from '../sole-mathematical-tools-20261119/cohort';
import {algebraContract} from '../sole-bounded-algebra-20261119/cohort';
import {linearContract} from '../sole-linear-systems-20261119/cohort';
import {timeContract} from '../sole-civil-time-20261119/cohort';
import {earthContract} from '../sole-earth-astronomy-20261119/cohort';
import {tireSizeCalculator} from '@/calculators/automotive/catalog-batch-3';
import type {CalculatorDefinition} from '@/calculators/types';
import type {FactoryWorkbenchField} from '@/components/sole-civil-time-20261119/workbench';
import type {FactoryExecutionPacket} from '../calculator-factory/workflows';
import {copyCalculationData} from '../calculation-snapshot';
import {equalCompletionJson} from '@/calculators/completion-contracts';

type Engine=CalculatorDefinition<Record<string,unknown>,Record<string,unknown>>;
type InputField=FactoryWorkbenchField & {encoding?:'json'|'boolean'};
const field=(key:string,label:string,unit:string):InputField=>({key,label,unit,kind:'number'});
const specs=[
 [474,tireSizeCalculator,'%','Diameter difference','diameterDifferencePercent','Nominal tire geometry using 25.4 mm per inch. Fit, load rating and vehicle approval require separate verification.',
  [field('currentWidthMm','Current width','mm'),field('currentAspectRatio','Current aspect ratio','%'),field('currentRimInches','Current rim diameter','in'),field('newWidthMm','New width','mm'),field('newAspectRatio','New aspect ratio','%'),field('newRimInches','New rim diameter','in')]],
 [240,mathContract(240).engine,'dimensionless','Result determinant','determinant','Retained 2 × 2 matrix reference.',mathContract(240).fields],
 [245,algebraContract(245).engine,'dimensionless','Dot product','dot','Retained vector reference. A zero vector has an undefined angle.',algebraContract(245).fields],
 [244,linearContract(244).engine,'dimensionless','Rectangular result','display','Retained complex reference; argument is in radians.',linearContract(244).fields],
 [450,timeContract(450).engine,'min','Net time','totalMinutes','Retained structured time-card reference. Whole minutes and explicit overnight flags.',[{key:'shifts',label:'Shifts as a JSON array',kind:'textarea',encoding:'json'}]],
 [534,earthContract(534).engine,'km','Converted distance','result','Retained distance reference. Output follows the selected target unit.',earthContract(534).fields],
] as const satisfies readonly (readonly [number,unknown,string,string,string,string,readonly InputField[]])[];

export const structuredContracts=Object.freeze(specs.map(([catalogId,definition,unit,label,key,limitations,fields])=>{
 const engine=definition as unknown as Engine;
 return compilePrivateFinal<Record<string,unknown>,Record<string,unknown>,InputField>(engine,{catalogId,revision:'sole-structured-factory-20261119.1',unit,fields,limitations,
  ...(catalogId===534?{outputUnit:(input:Record<string,unknown>)=>String(input.toUnit)}:{}),
  presentation:{id:`structured-${catalogId}`,domain:'engineering',family:'technical-engineering',level:'essential',supportedVisualizations:[]},
  project(output){
   const value=output[key];
   if(typeof value!=='string'&&typeof value!=='number')throw Error('Expected structured engine headline');
   return {primaryResult:{id:key,label,value,unit:catalogId===534?undefined:unit}};
  },
 });
}));
export function structuredContract(id:number){
 const row=structuredContracts.find(candidate=>candidate.catalogId===id);
 if(!row)throw Error('Private structured factory identity unavailable');
 return row;
}
export const structuredWorkflows=(id:number)=>structuredContract(id).workflows;
export function verifyStructuredFactoryPacket(packet:unknown){
 const clean=copyCalculationData({value:packet},{}).input.value as FactoryExecutionPacket;
 if(!clean||typeof clean.identity?.catalogId!=='number')throw Error('Expected private factory packet');
 return structuredWorkflows(clean.identity.catalogId).verify(clean);
}
export function verifyStructuredFactorySnapshot(value:unknown){
 const clean=copyCalculationData({value},{}).input.value;
 if(!clean||typeof clean!=='object'||Array.isArray(clean))throw Error('Expected private structured snapshot');
 const tuple=clean as {calculatorSlug?:unknown;calculatorVersion?:unknown};
 const profile=structuredContracts.find(row=>row.slug===tuple.calculatorSlug&&row.version===tuple.calculatorVersion);
 if(!profile)throw Error('Private factory version unavailable');
 return profile.verifyHistorical(clean);
}
export function prepareStructuredFactoryRecovery(value:unknown){
 const checked=verifyStructuredFactorySnapshot(value);
 let packet:FactoryExecutionPacket;
 try{packet=structuredWorkflows(checked.catalogId).execute(encodePrivateFinalInputs(checked.snapshot.input));}
 catch{return {...checked,currentCaptureAvailable:false as const};}
 if(!equalCompletionJson(checked.snapshot,packet.snapshot))throw Error('Historical replay mismatch');
 return {...checked,currentCaptureAvailable:true as const};
}
