import {horsepowerCalculator,engineHorsepowerCalculator} from '@/calculators/automotive/catalog-batch-3';
import {createEngineeringContract} from '@/lib/calculator-factory/completion/next-engineering-core';
import {createFactoryWorkflows,type FactoryExecutionPacket} from '@/lib/calculator-factory/workflows';
import {copyCalculationData,type CalculationSnapshot} from '@/lib/calculation-snapshot';
import {sameRecordedJson} from '@/lib/recorded-json-equality';

const sourceEvidence=['docs/worker2-automotive-power-20261118/EVIDENCE.md'];
const unit='mechanical hp';
export const powerContracts=Object.freeze([
 createEngineeringContract(horsepowerCalculator,{catalogId:475,primaryKey:'horsepower',unit,
  scope:'Convert supplied kW to mechanical horsepower using the retained divisor 745.6999 W/hp.',
  sourceEvidence,fieldUnits:{kilowatts:'kW'}}),
 createEngineeringContract(engineHorsepowerCalculator,{catalogId:476,primaryKey:'horsepower',unit,
  scope:'Calculate power from supplied torque in lb·ft and speed in rpm using the retained approximate divisor 5252.',
  sourceEvidence,fieldUnits:{torqueLbFt:'lb·ft',rpm:'rpm'}}),
]);
const labels:Record<string,string>={kilowatts:'Power',torqueLbFt:'Torque',rpm:'Engine speed'};
export function powerContract(id:number){
 const contract=powerContracts.find(row=>row.catalogId===id);
 if(!contract)throw Error('Exact automotive power contract unavailable');
 const engine=id===475?horsepowerCalculator:engineHorsepowerCalculator;
 return {...contract,engine,fields:contract.fields.map(field=>({...field,label:labels[field.key]}))};
}
export function powerWorkflows(id:number){
 const contract=powerContract(id);
 const identity={catalogId:id,engineId:contract.engineId,calculatorSlug:contract.slug,calculatorVersion:contract.version,
  sourceVersion:`private.worker2.automotive-power.20261118.1/${contract.engineId}@${contract.version}`};
 return createFactoryWorkflows({identity,execute:contract.execute,scopedMetadata:{
  schemaVersion:1,identity,scope:contract.scope,primaryKey:contract.primaryKey,fields:contract.fields,
  outputs:{horsepower:{label:'Mechanical horsepower',unit}},
  sourceEvidence,publisherSources:contract.engine.sources.map(source=>source.url!),
  limitations:contract.limitations,authority:'Private bounded review. Source applicability and canonical approval remain pending.',
 }});
}
export function verifyPowerPacket(value:unknown){
 const packet=copyCalculationData({value},{}).input.value as FactoryExecutionPacket;
 if(typeof packet?.identity?.catalogId!=='number')throw Error('Exact power packet required');
 return powerWorkflows(packet.identity.catalogId).verify(packet);
}
export function verifyPowerSnapshot(snapshot:CalculationSnapshot){
 const contract=powerContracts.find(row=>row.slug===snapshot.calculatorSlug&&row.version===snapshot.calculatorVersion);
 if(!contract)throw Error('Exact historical automotive power identity unavailable');
 return {...contract.verifyHistorical(snapshot),catalogId:contract.catalogId};
}
export function preparePowerRecovery(snapshot:CalculationSnapshot){
 const result=verifyPowerSnapshot(snapshot);
 const raw=Object.fromEntries(Object.entries(snapshot.input).map(([key,value])=>[key,Object.is(value,-0)?'-0':String(value)]));
 try{return {...result,currentCaptureAvailable:sameRecordedJson(powerWorkflows(result.catalogId).execute(raw).snapshot,result.snapshot)};}
 catch{return {...result,currentCaptureAvailable:false};}
}
