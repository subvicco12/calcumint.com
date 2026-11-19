import {torqueCalculator} from '@/calculators/physics/catalog-batch-3';
import {molecularWeightCalculator} from '@/calculators/chemistry/molecular-weight';
import {fuelTripCostCalculator} from '@/calculators/travel/catalog-batch-2';
import {compilePrivateFinal,encodePrivateFinalInputs} from '../calculator-factory/private-final/adapter';
import {copyCalculationData} from '../calculation-snapshot';
import {equalCompletionJson} from '@/calculators/completion-contracts';
import type {FactoryExecutionPacket} from '../calculator-factory/workflows';
import type {FactoryWorkbenchField} from '@/components/calculator-factory-workbench';
import type {CalculatorDomain} from '@/calculators/final-framework/types';

const field=(key:string,label:string,unit:string):FactoryWorkbenchField=>({key,label,unit,kind:'number'});
const scalar=(catalogId:number,domain:CalculatorDomain,label:string,unit:string,limitations:string,fields:readonly FactoryWorkbenchField[])=>({
 catalogId,revision:'sole-final-factory-20261119.1',unit,limitations,fields,
 presentation:{id:`private-final-${catalogId}`,domain,family:'technical-engineering' as const,level:'essential' as const,
   supportedVisualizations:[]},
 project(output:Record<string,unknown>){
  if(typeof output.value!=='number')throw Error('Expected numeric registered output');
  return {primaryResult:{id:'value',label,value:output.value,unit}};
 },
});
export const finalContracts=Object.freeze([
 compilePrivateFinal(torqueCalculator,scalar(326,'physics','Torque magnitude','N·m','Uses force, lever arm and the included angle. The registered trigonometric approximation is retained.',[
  field('force','Force','N'),field('leverArm','Lever arm','m'),field('angle','Included angle','°')])),
 compilePrivateFinal(molecularWeightCalculator,scalar(330,'chemistry','Molar mass','g/mol','Uses the retained atomic-weight table and grouped formula grammar. Isotope-specific and hydrate notation are outside this model.',[
  {key:'formula',label:'Chemical formula',kind:'text'}])),
 compilePrivateFinal(fuelTripCostCalculator,scalar(509,'travel','Fuel trip cost','currency units','Supply one currency consistently. Uses fixed fuel consumption and price without currency conversion or travel forecasts.',[
  field('distanceKm','Distance','km'),field('litersPer100Km','Fuel consumption','L/100 km'),field('pricePerLiter','Fuel price','currency units/L')])),
]);
if(new Set(finalContracts.map(row=>row.catalogId)).size!==finalContracts.length)throw Error('Duplicate private factory identity');
export function finalContract(id:number){
 const row=finalContracts.find(candidate=>candidate.catalogId===id);
 if(!row)throw Error('Private factory identity unavailable');
 return row;
}
export const finalWorkflows=(id:number)=>finalContract(id).workflows;
export function verifyFinalFactoryPacket(packet:unknown){
 const clean=copyCalculationData({value:packet},{}).input.value as FactoryExecutionPacket;
 if(!clean||typeof clean.identity?.catalogId!=='number')throw Error('Expected private factory packet');
 return finalWorkflows(clean.identity.catalogId).verify(clean);
}
export function verifyFinalFactorySnapshot(value:unknown){
 const clean=copyCalculationData({value},{}).input.value;
 if(!clean||typeof clean!=='object'||Array.isArray(clean))throw Error('Expected private factory snapshot');
 const tuple=clean as {calculatorSlug?:unknown;calculatorVersion?:unknown};
 const profile=finalContracts.find(row=>row.slug===tuple.calculatorSlug&&row.version===tuple.calculatorVersion);
 if(!profile)throw Error('Private factory version unavailable');
 return profile.verifyHistorical(clean);
}
export function prepareFinalFactoryRecovery(value:unknown){
 const checked=verifyFinalFactorySnapshot(value);
 let packet:FactoryExecutionPacket;
 try{packet=finalWorkflows(checked.catalogId).execute(encodePrivateFinalInputs(checked.snapshot.input));}
 catch{return {...checked,currentCaptureAvailable:false as const};}
 if(!equalCompletionJson(checked.snapshot,packet.snapshot))throw Error('Historical replay mismatch');
 return {...checked,currentCaptureAvailable:true as const};
}
