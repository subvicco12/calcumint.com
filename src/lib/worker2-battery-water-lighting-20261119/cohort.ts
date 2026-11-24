import {batteryRuntimeCalculator} from '@/calculators/technology-computing/catalog-batch-2';
import {batteryStorageCalculator} from '@/calculators/engineering-construction/catalog-batch-3';
import {launchDefinitions} from '@/calculators/launch-portfolio';
import {lightingEnergyCalculator} from '@/calculators/energy/catalog-batch-3';
import {createEngineeringContract,type EngineeringOptions} from '@/lib/calculator-factory/completion/next-engineering-core';
import {createFactoryWorkflows,type FactoryExecutionPacket} from '@/lib/calculator-factory/workflows';
import {copyCalculationData,type CalculationSnapshot} from '@/lib/calculation-snapshot';
import {sameRecordedJson} from '@/lib/recorded-json-equality';
import type {CalculatorDefinition} from '@/calculators/types';
import type {ScenarioFieldDisplay} from '@/lib/scenario-display-metadata';

const sourceEvidence=['docs/worker2-battery-water-lighting-20261119/EVIDENCE.md'];
const labels:Record<string,string>={
 capacityWh:'Battery energy capacity',loadWatts:'Average load',efficiencyPercent:'Effective efficiency',
 dailyEnergyKwh:'Daily energy',backupDays:'Backup duration',depthOfDischargePercent:'Usable depth of discharge',
 systemEfficiencyPercent:'System efficiency',rate:'Constant flow rate',minutes:'Duration',
 quantity:'Number of lights',wattsPerLight:'Power per light',hoursUsed:'Hours used',
};
function profile<I extends object,O extends object>(
 engine:CalculatorDefinition<I,O>, options:Omit<EngineeringOptions<I,O>,'sourceEvidence'>,
 primaryLabel:string, secondary:Readonly<Record<string,ScenarioFieldDisplay>>={},
){
 const contract=createEngineeringContract(engine,{...options,sourceEvidence});
 return Object.freeze({...contract,engine,primaryLabel,outputs:{[contract.primaryKey]:{label:primaryLabel,unit:contract.unit},...secondary},
  fields:contract.fields.map(field=>({...field,label:labels[field.key]}))});
}
const waterUsageCalculator=launchDefinitions.find(row=>row.id==='launch-water-usage-calculator'&&row.version===1);
if(!waterUsageCalculator)throw Error('Exact water usage v1 engine unavailable');
export const resourceContracts=Object.freeze([
 profile(batteryRuntimeCalculator,{catalogId:482,primaryKey:'value',unit:'h',scope:'Idealized runtime from supplied Wh capacity, average W load and efficiency. No chemistry, temperature or discharge curve model.',fieldUnits:{capacityWh:'Wh',loadWatts:'W',efficiencyPercent:'%'}},'Estimated runtime'),
 profile(batteryStorageCalculator,{catalogId:483,primaryKey:'value',unit:'kWh',scope:'Nominal storage from daily energy, backup duration, usable depth of discharge and supplied system efficiency. No installation, equipment sizing or code decision.',fieldUnits:{dailyEnergyKwh:'kWh/day',backupDays:'days',depthOfDischargePercent:'%',systemEfficiencyPercent:'%'}},'Nominal storage'),
 profile(waterUsageCalculator,{catalogId:486,primaryKey:'result',unit:'supplied volume unit',scope:'Constant flow per minute multiplied by elapsed minutes. Supply one consistent volume unit; the engine does not convert between units.',fieldUnits:{rate:'supplied volume unit/min',minutes:'min'}},'Water volume'),
 profile(lightingEnergyCalculator,{catalogId:489,primaryKey:'energyKwh',unit:'kWh',scope:'Energy from identical lights operated for a common duration. No dimming, standby, cost or variable load calculation.',fieldUnits:{quantity:'whole lights',wattsPerLight:'W',hoursUsed:'h'}},'Lighting energy'),
]);
export function resourceContract(id:number){
 const contract=resourceContracts.find(row=>row.catalogId===id);
 if(!contract)throw Error('Exact battery, water and lighting contract unavailable');
 return contract;
}
export function resourceWorkflows(id:number){
 const contract=resourceContract(id);
 const identity={catalogId:id,engineId:contract.engineId,calculatorSlug:contract.slug,calculatorVersion:contract.version,
  sourceVersion:`private.worker2.battery-water-lighting.20261119.1/${contract.engineId}@${contract.version}`};
 return createFactoryWorkflows({identity,execute:contract.execute,scopedMetadata:{
  schemaVersion:1,identity,scope:contract.scope,primaryKey:contract.primaryKey,fields:contract.fields,
  outputs:contract.outputs,sourceEvidence,publisherSources:contract.engine.sources.flatMap(source=>source.url?[source.url]:[]),
  limitations:contract.limitations,authority:'Private bounded review. Source applicability and canonical approval remain pending.',
 }});
}
export function verifyResourcePacket(value:unknown){
 const packet=copyCalculationData({value},{}).input.value as FactoryExecutionPacket;
 if(typeof packet?.identity?.catalogId!=='number')throw Error('Exact battery, water and lighting packet required');
 return resourceWorkflows(packet.identity.catalogId).verify(packet);
}
export function verifyResourceSnapshot(snapshot:CalculationSnapshot){
 const contract=resourceContracts.find(row=>row.slug===snapshot.calculatorSlug&&row.version===snapshot.calculatorVersion);
 if(!contract)throw Error('Exact historical battery, water and lighting identity unavailable');
 return {...contract.verifyHistorical(snapshot),catalogId:contract.catalogId};
}
export function prepareResourceRecovery(snapshot:CalculationSnapshot){
 const result=verifyResourceSnapshot(snapshot);
 const raw=Object.fromEntries(Object.entries(snapshot.input).map(([key,value])=>[key,Object.is(value,-0)?'-0':String(value)]));
 try{return {...result,currentCaptureAvailable:sameRecordedJson(resourceWorkflows(result.catalogId).execute(raw).snapshot,result.snapshot)};}
 catch{return {...result,currentCaptureAvailable:false};}
}
