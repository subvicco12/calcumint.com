import {fuelTripCostCalculator} from '@/calculators/travel/catalog-batch-2';
import {fuelEconomyCalculator,gasMileageCalculator,tripFuelCalculator} from '@/calculators/automotive/catalog-batch-2';
import {evChargingCostCalculator,evChargingTimeCalculator,evRangeCalculator} from '@/calculators/energy/catalog-batch-1';
import {applianceRunningCostCalculator,homeEnergyConsumptionCalculator} from '@/calculators/energy/catalog-batch-2';
import {createEngineeringContract,type EngineeringOptions} from '@/lib/calculator-factory/completion/next-engineering-core';
import {createFactoryWorkflows,type FactoryExecutionPacket} from '@/lib/calculator-factory/workflows';
import {copyCalculationData,type CalculationSnapshot} from '@/lib/calculation-snapshot';
import {sameRecordedJson} from '@/lib/recorded-json-equality';
import type {CalculatorDefinition} from '@/calculators/types';
import type {ScenarioFieldDisplay} from '@/lib/scenario-display-metadata';

const sourceEvidence=['docs/worker2-energy-mobility-20261119/EVIDENCE.md'];
const currency='supplied currency';
const labels:Record<string,string>={
 distanceKm:'Distance',distanceMiles:'Distance',fuelUsedLiters:'Fuel used',fuelUsedUsGallons:'Fuel used',
 fuelConsumptionLitersPer100Km:'Average fuel consumption',batteryEnergyAddedKwh:'Battery energy added',
 electricityRatePerKwh:'Electricity rate',chargingEfficiencyPercent:'Charging efficiency',energyToAddKwh:'Energy to add',
 averageChargingPowerKw:'Average charging power',usableBatteryKwh:'Usable battery energy',
 consumptionKwhPer100Km:'Average energy consumption',powerWatts:'Appliance power',hoursUsed:'Hours used',
 litersPer100Km:'Average fuel consumption',pricePerLiter:'Fuel price',
 ratePerKwh:'Electricity rate',averagePowerWatts:'Average power',hoursPerDay:'Hours used per day',days:'Period length',
};
function profile<I extends object,O extends object>(
 engine:CalculatorDefinition<I,O>, options:Omit<EngineeringOptions<I,O>,'sourceEvidence'>,
 primaryLabel:string, secondary:Readonly<Record<string,ScenarioFieldDisplay>>={},
){
 const contract=createEngineeringContract(engine,{...options,sourceEvidence});
 return Object.freeze({...contract,engine,primaryLabel,outputs:{[contract.primaryKey]:{label:primaryLabel,unit:contract.unit},...secondary},
  fields:contract.fields.map(field=>({...field,label:labels[field.key]}))});
}
export const mobilityContracts=Object.freeze([
 profile(fuelEconomyCalculator,{catalogId:459,primaryKey:'value',unit:'km/L',scope:'Supplied kilometres divided by litres consumed; no reciprocal consumption conversion.',fieldUnits:{distanceKm:'km',fuelUsedLiters:'L'}},'Fuel economy'),
 profile(gasMileageCalculator,{catalogId:460,primaryKey:'value',unit:'mi/US gal',scope:'Supplied miles divided by US gallons consumed; no imperial gallon conversion.',fieldUnits:{distanceMiles:'mi',fuelUsedUsGallons:'US gal'}},'Gas mileage'),
 profile(tripFuelCalculator,{catalogId:461,primaryKey:'value',unit:'L',scope:'Trip distance and supplied average consumption only; no route or driving model.',fieldUnits:{distanceKm:'km',fuelConsumptionLitersPer100Km:'L/100 km'}},'Trip fuel'),
 profile(evChargingCostCalculator,{catalogId:462,primaryKey:'value',unit:currency,scope:'Battery energy divided by supplied charging efficiency, multiplied by a flat entered rate. No taxes, fixed fees or time-varying tariff.',fieldUnits:{batteryEnergyAddedKwh:'kWh',electricityRatePerKwh:currency+'/kWh',chargingEfficiencyPercent:'%'}},'Charging cost'),
 profile(evChargingTimeCalculator,{catalogId:463,primaryKey:'value',unit:'h',scope:'Energy divided by supplied average charging power. No charging curve or vehicle-specific prediction.',fieldUnits:{energyToAddKwh:'kWh',averageChargingPowerKw:'kW'}},'Charging time'),
 profile(evRangeCalculator,{catalogId:464,primaryKey:'value',unit:'km',scope:'Usable battery energy and a supplied average consumption rate. No route, temperature or reserve model.',fieldUnits:{usableBatteryKwh:'kWh',consumptionKwhPer100Km:'kWh/100 km'}},'Estimated range'),
 profile(applianceRunningCostCalculator,{catalogId:478,primaryKey:'cost',unit:currency,scope:'Supplied appliance power and total runtime with a flat entered rate. No standby profile or demand charges.',fieldUnits:{powerWatts:'W',hoursUsed:'h',ratePerKwh:currency+'/kWh'}},'Running cost',{energyKwh:{label:'Energy used',unit:'kWh'}}),
 profile(homeEnergyConsumptionCalculator,{catalogId:479,primaryKey:'periodEnergyKwh',unit:'kWh',scope:'Supplied average power, daily operating time and custom period. Cost uses an entered flat rate.',fieldUnits:{averagePowerWatts:'W',hoursPerDay:'h/day',days:'days',ratePerKwh:currency+'/kWh'}},'Period energy',{dailyEnergyKwh:{label:'Daily energy',unit:'kWh'},periodCost:{label:'Period cost',unit:currency}}),
 profile(fuelTripCostCalculator,{catalogId:509,primaryKey:'value',unit:currency,scope:'Fuel-only cost from supplied trip distance, average fuel consumption and a single entered price. Tolls, other expenses and currency conversion are excluded.',fieldUnits:{distanceKm:'km',litersPer100Km:'L/100 km',pricePerLiter:currency+'/L'}},'Fuel trip cost'),
]);
export function mobilityContract(id:number){
 const contract=mobilityContracts.find(row=>row.catalogId===id);
 if(!contract)throw Error('Exact energy and mobility contract unavailable');
 return contract;
}
export function chargingRoundedToZero(id:number,snapshot:CalculationSnapshot):boolean{
 if(snapshot.calculatorVersion!==1||snapshot.output.value!==0)return false;
 const {input}=snapshot;
 if(id===462&&snapshot.calculatorSlug===evChargingCostCalculator.slug){
  return Number(input.batteryEnergyAddedKwh)>0&&Number(input.electricityRatePerKwh)>0;
 }
 return id===463&&snapshot.calculatorSlug===evChargingTimeCalculator.slug&&Number(input.energyToAddKwh)>0;
}
export function mobilityWorkflows(id:number){
 const contract=mobilityContract(id);
 const identity={catalogId:id,engineId:contract.engineId,calculatorSlug:contract.slug,calculatorVersion:contract.version,
  sourceVersion:`${id===509?'private.worker2.fuel-trip.20261124.1':'private.worker2.energy-mobility.20261119.1'}/${contract.engineId}@${contract.version}`};
 return createFactoryWorkflows({identity,execute:contract.execute,scopedMetadata:{
  schemaVersion:1,identity,scope:contract.scope,primaryKey:contract.primaryKey,fields:contract.fields,
  outputs:contract.outputs,sourceEvidence:id===509?['src/calculators/travel/catalog-batch-2.ts']:sourceEvidence,publisherSources:contract.engine.sources.flatMap(source=>source.url?[source.url]:[]),
  limitations:contract.limitations,authority:'Private bounded review. Source applicability and canonical approval remain pending.',
 }});
}
export function verifyMobilityPacket(value:unknown){
 const packet=copyCalculationData({value},{}).input.value as FactoryExecutionPacket;
 if(typeof packet?.identity?.catalogId!=='number')throw Error('Exact energy and mobility packet required');
 return mobilityWorkflows(packet.identity.catalogId).verify(packet);
}
export function verifyMobilitySnapshot(snapshot:CalculationSnapshot){
 const contract=mobilityContracts.find(row=>row.slug===snapshot.calculatorSlug&&row.version===snapshot.calculatorVersion);
 if(!contract)throw Error('Exact historical energy and mobility identity unavailable');
 return {...contract.verifyHistorical(snapshot),catalogId:contract.catalogId};
}
export function prepareMobilityRecovery(snapshot:CalculationSnapshot){
 const result=verifyMobilitySnapshot(snapshot);
 const raw=Object.fromEntries(Object.entries(snapshot.input).map(([key,value])=>[key,Object.is(value,-0)?'-0':String(value)]));
 try{return {...result,currentCaptureAvailable:sameRecordedJson(mobilityWorkflows(result.catalogId).execute(raw).snapshot,result.snapshot)};}
 catch{return {...result,currentCaptureAvailable:false};}
}
