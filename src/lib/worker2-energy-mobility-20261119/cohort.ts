import {simpleInterestCalculator} from '@/calculators/finance/simple-interest';
import {compoundInterestCalculator} from '@/calculators/finance/compound-interest';
import {roiCalculator} from '@/calculators/finance/roi';
import {netWorthCalculator} from '@/calculators/finance/net-worth';
import {emergencyFundCalculator} from '@/calculators/finance/emergency-fund';
import {breakEvenCalculator} from '@/calculators/business/break-even';
import {customerAcquisitionCostCalculator,conversionRateCalculator} from '@/calculators/business/catalog-batch-1';
import {netRevenueRetentionCalculator,roasCalculator} from '@/calculators/business/catalog-batch-2';
import {tireSizeCalculator} from '@/calculators/automotive/catalog-batch-3';
import {orbitalPeriodCalculator,escapeVelocityCalculator} from '@/calculators/astronomy/catalog-batch-1';
import {astronomicalDistanceConverter} from '@/calculators/astronomy/catalog-batch-2';
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
const additions: Readonly<Partial<Record<number,string>>>={
 474:'src/calculators/automotive/catalog-batch-3.ts',
 532:'src/calculators/astronomy/catalog-batch-1.ts',
 533:'src/calculators/astronomy/catalog-batch-1.ts',
 534:'src/calculators/astronomy/catalog-batch-2.ts',
};
const financeSources:Readonly<Partial<Record<number,string>>>={
 50:'finance/simple-interest',51:'finance/compound-interest',64:'finance/roi',99:'finance/net-worth',103:'finance/emergency-fund',
 138:'business/break-even',168:'business/catalog-batch-2',172:'business/catalog-batch-1',184:'business/catalog-batch-2',191:'business/catalog-batch-1',
};
function requirePositiveAstronomyResult(_input:object,output:{value:number}){
 if(output.value===0)throw Error('Estimate rounds to zero at v1 six-decimal precision');
}
const astronomyUnits=['km','au','ly','pc'] as const;
const currency='supplied currency';
const labels:Record<string,string>={
 distanceKm:'Distance',distanceMiles:'Distance',fuelUsedLiters:'Fuel used',fuelUsedUsGallons:'Fuel used',
 fuelConsumptionLitersPer100Km:'Average fuel consumption',batteryEnergyAddedKwh:'Battery energy added',
 electricityRatePerKwh:'Electricity rate',chargingEfficiencyPercent:'Charging efficiency',energyToAddKwh:'Energy to add',
 averageChargingPowerKw:'Average charging power',usableBatteryKwh:'Usable battery energy',
 consumptionKwhPer100Km:'Average energy consumption',powerWatts:'Appliance power',hoursUsed:'Hours used',
 litersPer100Km:'Average fuel consumption',pricePerLiter:'Fuel price',
 currentWidthMm:'Current tire width',currentAspectRatio:'Current aspect ratio',currentRimInches:'Current rim diameter',
 newWidthMm:'New tire width',newAspectRatio:'New aspect ratio',newRimInches:'New rim diameter',
 semiMajorAxisAu:'Orbital semi-major axis',centralMassSolar:'Central mass',massKg:'Body mass',radiusM:'Body radius',
 principal:'Starting principal',annualRatePercent:'Annual rate',years:'Elapsed years',compoundsPerYear:'Compounding periods per year',
 initialInvestment:'Initial investment',finalValue:'Ending value',additionalCosts:'Additional costs',incomeReceived:'Income received',holdingMonths:'Holding period',
 assets:'Assets (JSON list of name and amount)',liabilities:'Liabilities (JSON list of name and amount)',
 monthlyEssentialExpenses:'Monthly essential expenses',targetMonths:'Months of target coverage',currentEmergencySavings:'Current emergency savings',buildMonths:'Months to build fund',
 fixedCosts:'Fixed costs',pricePerUnit:'Price per unit',variableCostPerUnit:'Variable cost per unit',
 beginningRecurringRevenue:'Beginning recurring revenue',churnedRevenue:'Churned recurring revenue',contractionRevenue:'Contraction revenue',expansionRevenue:'Expansion revenue',
 salesAndMarketingCost:'Acquisition spending',newCustomers:'New customers',conversionValue:'Attributed conversion value',adSpend:'Advertising spend',conversions:'Conversions',totalVisitors:'Total visitors',
 value:'Distance',fromUnit:'From unit',toUnit:'To unit',
 ratePerKwh:'Electricity rate',averagePowerWatts:'Average power',hoursPerDay:'Hours used per day',days:'Period length',
};
function profile<I extends object,O extends object>(
 engine:CalculatorDefinition<I,O>, options:Omit<EngineeringOptions<I,O>,'sourceEvidence'>,
 primaryLabel:string, secondary:Readonly<Record<string,ScenarioFieldDisplay>>={},
){
 const finance=financeSources[options.catalogId];
 const path=finance?`src/calculators/${finance}.ts`:additions[options.catalogId];
 const contract=createEngineeringContract(engine,{...options,sourceEvidence:path?[path]:sourceEvidence});
 const outputUnit=options.catalogId===534?(input:Record<string,unknown>)=>String(input.toUnit):undefined;
 return Object.freeze({...contract,outputUnit,engine,primaryLabel,outputs:{[contract.primaryKey]:{label:primaryLabel,unit:contract.unit},...secondary},
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
 profile(tireSizeCalculator,{catalogId:474,primaryKey:'diameterDifferencePercent',unit:'%',scope:'Nominal diameter comparison from marked width, aspect ratio and rim diameter. Actual dimensions vary. No fitment, clearance, load, speed-rating or safety determination.',fieldUnits:{currentWidthMm:'mm',currentAspectRatio:'%',currentRimInches:'in',newWidthMm:'mm',newAspectRatio:'%',newRimInches:'in'}},'Diameter difference',{currentDiameterMm:{label:'Current nominal diameter',unit:'mm'},newDiameterMm:{label:'New nominal diameter',unit:'mm'}}),
 profile(orbitalPeriodCalculator,{catalogId:532,primaryKey:'value',unit:'yr',scope:'Ideal two-body period in years using AU and solar masses. Orbiting mass is negligible. This normalized approximation excludes perturbations and ephemeris prediction; v1 rounds to six decimal places.',fieldUnits:{semiMajorAxisAu:'AU',centralMassSolar:'solar masses'},validate:requirePositiveAstronomyResult},'Orbital period'),
 profile(escapeVelocityCalculator,{catalogId:533,primaryKey:'value',unit:'km/s',scope:'Newtonian surface escape speed from supplied mass and radius using G = 6.67430e-11 m³/(kg·s²). Assumes spherical symmetry, no rotation and no atmosphere. The scope excludes compact relativistic bodies; v1 rounds to six decimal places.',fieldUnits:{massKg:'kg',radiusM:'m'},validate:requirePositiveAstronomyResult},'Escape speed'),
 profile(astronomicalDistanceConverter,{catalogId:534,primaryKey:'result',unit:'selected target unit',scope:'Fixed distance conversion among kilometres, AU, Julian light-years and parsecs. The result uses the selected target unit. v1 uses binary64 factors; it does not report observational accuracy.',fieldOptions:{fromUnit:astronomyUnits,toUnit:astronomyUnits}},'Converted distance'),
 profile(simpleInterestCalculator,{catalogId:50,primaryKey:'totalAmount',unit:currency,scope:'One initial principal, nominal annual rate and supplied years. No reinvestment, interim flows, fees or taxes. v1 rounds currency results to two decimal places.',fieldUnits:{principal:currency,annualRatePercent:'%',years:'years'}},'Ending balance',{interest:{label:'Interest earned',unit:currency}}),
 profile(compoundInterestCalculator,{catalogId:51,primaryKey:'futureValue',unit:currency,scope:'One opening balance with nominal rate divided by periods per year and raised to periods times years. No later contributions, tax, fees or calendar day-count. v1 rounds currency results to two decimal places.',fieldUnits:{principal:currency,annualRatePercent:'%',years:'years',compoundsPerYear:'periods/year'}},'Future value',{totalInterest:{label:'Interest earned',unit:currency}}),
 profile(roiCalculator,{catalogId:64,primaryKey:'roiPercent',unit:'%',scope:'Entered ending value plus income versus initial investment and additional costs. Annualization uses the supplied holding months and aggregate value, without dated interim flows. No tax, currency conversion or investment advice.',fieldUnits:{initialInvestment:currency,finalValue:currency,additionalCosts:currency,incomeReceived:currency,holdingMonths:'months'}},'Return on investment',{netGain:{label:'Net gain',unit:currency},totalInvested:{label:'Total invested',unit:currency},annualizedReturnPercent:{label:'Annualized return',unit:'%'}}),
 profile(netWorthCalculator,{catalogId:99,primaryKey:'netWorth',unit:currency,scope:'Subtract entered liabilities from entered assets at one valuation date in one currency. For each list enter JSON items such as [{"name":"Cash","amount":100}], or [] for none. No appraisal, tax or FX. v1 rounds amounts to two decimal places.',itemLists:['assets','liabilities']},'Net worth',{totalAssets:{label:'Total assets',unit:currency},totalLiabilities:{label:'Total liabilities',unit:currency},debtToAssetPercent:{label:'Debt to assets',unit:'%'}}),
 profile(emergencyFundCalculator,{catalogId:103,primaryKey:'fundingGap',unit:currency,scope:'Use supplied essential expenses and target coverage. Monthly saving assumes equal deposits over the entered build period, without interest or inflation. The target is a user assumption.',fieldUnits:{monthlyEssentialExpenses:currency+'/month',targetMonths:'months',currentEmergencySavings:currency,buildMonths:'months'}},'Funding gap',{targetFund:{label:'Target fund',unit:currency},currentSavings:{label:'Current savings',unit:currency},coverageMonths:{label:'Current coverage',unit:'months'},requiredMonthlySavings:{label:'Monthly savings required',unit:currency+'/month'}}),
 profile(breakEvenCalculator,{catalogId:138,primaryKey:'breakEvenUnits',unit:'units',scope:'Fixed costs divided by positive contribution margin, with price and variable cost per unit constant in the same period. v1 reports a fractional threshold to two decimal places. For indivisible sales use the next whole unit when needed.',fieldUnits:{fixedCosts:currency,pricePerUnit:currency+'/unit',variableCostPerUnit:currency+'/unit'}},'Break-even units',{breakEvenRevenue:{label:'Break-even revenue',unit:currency},contributionMarginPerUnit:{label:'Contribution per unit',unit:currency+'/unit'},contributionMarginPercent:{label:'Contribution margin',unit:'%'}}),
 profile(netRevenueRetentionCalculator,{catalogId:168,primaryKey:'value',unit:'%',scope:'One existing-customer recurring revenue cohort and one period. Subtract churn and contraction and add expansion. Exclude new-customer revenue, and enter all amounts in one currency.',fieldUnits:{beginningRecurringRevenue:currency,churnedRevenue:currency,contractionRevenue:currency,expansionRevenue:currency}},'Net revenue retention'),
 profile(customerAcquisitionCostCalculator,{catalogId:172,primaryKey:'value',unit:currency+'/customer',scope:'Entered acquisition spending divided by new customers for the same period and attribution scope. No payback, blended cohort adjustment or future forecast.',fieldUnits:{salesAndMarketingCost:currency,newCustomers:'customers'}},'Customer acquisition cost'),
 profile(roasCalculator,{catalogId:184,primaryKey:'value',unit:'%',scope:'Entered conversion value divided by ad spend for the same attribution window and currency, expressed as a percentage. No incremental lift, margin or profit estimate.',fieldUnits:{conversionValue:currency,adSpend:currency}},'Return on ad spend'),
 profile(conversionRateCalculator,{catalogId:191,primaryKey:'value',unit:'%',scope:'Entered conversions divided by visitors in one measurement window, using a consistent conversion definition. No statistical inference or attribution model.',fieldUnits:{conversions:'count',totalVisitors:'count'}},'Conversion rate'),
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
 const capture=financeSources[id]?'private.worker2.finance-business.20261124.1':additions[id]?'private.worker2.astronomy-mobility.20261124.1':id===509?'private.worker2.fuel-trip.20261124.1':'private.worker2.energy-mobility.20261119.1';
 const identity={catalogId:id,engineId:contract.engineId,calculatorSlug:contract.slug,calculatorVersion:contract.version,
  sourceVersion:`${capture}/${contract.engineId}@${contract.version}`};
 return createFactoryWorkflows({identity,execute:contract.execute,scopedMetadata:{
  schemaVersion:1,identity,scope:contract.scope,primaryKey:contract.primaryKey,fields:contract.fields,
  outputs:contract.outputs,sourceEvidence:id===509?['src/calculators/travel/catalog-batch-2.ts']:contract.sourceEvidence,publisherSources:contract.engine.sources.flatMap(source=>source.url?[source.url]:[]),
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
 const raw=Object.fromEntries(Object.entries(snapshot.input).map(([key,value])=>[key,Array.isArray(value)?JSON.stringify(value):Object.is(value,-0)?'-0':String(value)]));
 try{return {...result,currentCaptureAvailable:sameRecordedJson(mobilityWorkflows(result.catalogId).execute(raw).snapshot,result.snapshot)};}
 catch{return {...result,currentCaptureAvailable:false};}
}
