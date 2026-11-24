import {componentContracts,componentExamples} from '@/calculators/component-contracts';
import {remainingContracts,remainingExamples} from '@/calculators/remaining-contracts';
import {businessContracts,businessExamples} from '@/calculators/business-contracts';
import {punnettSquareCalculator} from '@/calculators/biology/catalog-batch-3';
import {hardyWeinbergCalculator} from '@/calculators/biology/catalog-batch-2';
import {proteinIntakeCalculator,carbohydrateIntakeCalculator,fatIntakeCalculator,caloriesBurnedCalculator} from '@/calculators/health/catalog-batch-2';
import {loanPaymentCalculator} from '@/calculators/finance/loan-payment';
import {creditCardPayoffCalculator} from '@/calculators/finance/credit-card-payoff';
import {mortgageCalculator} from '@/calculators/finance/mortgage';
import {stepUpSipCalculator} from '@/calculators/finance/step-up-sip';
import {recurringDepositCalculator} from '@/calculators/finance/recurring-deposit';
import {doublingTimeCalculator,populationGrowthCalculator} from '@/calculators/biology/catalog-batch-1';
import {slopeCalculator,volumeCalculator} from '@/calculators/geometry/catalog-completion';
import {standardDeviationCalculator,varianceCalculator} from '@/calculators/statistics/catalog-batch-1';
import {graphingCalculator,functionPlotter2dCalculator} from '@/calculators/advanced-math/catalog-batch-10';
import {bmiCalculator} from '@/calculators/health/bmi';
import {bmrCalculator,tdeeCalculator,leanBodyMassCalculator,bodySurfaceAreaCalculator,calorieCalculator,bodyFatCalculator,idealWeightCalculator,healthyWeightCalculator} from '@/calculators/health/catalog-batch-1';
import {plantPopulationCalculator} from '@/calculators/biology/catalog-batch-4';
import {agriculturalYieldCalculator} from '@/calculators/biology/catalog-batch-5';
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
const borrowerIds=[3,4,5,6,7,8,11,12,13,14,15,16,17] as const;
const batch35FinanceIds=[25,37,45,47,68,71,72,73,75,76,77,83,93,100,106,107,108,465,466,473] as const;
const batch35Ids=new Set<number>([...borrowerIds,...batch35FinanceIds]);
const supplementalBusinessIds=[142,143,165,166,167,169,171,178,182,186,187,190,192,193,196] as const;
const supplementalFinanceIds=[57,58,59,60,61,62,69,78,114,115,66,111,63,67] as const;
const supplementalSources:Readonly<Partial<Record<number,string>>>=Object.fromEntries([
 ...borrowerIds.map(id=>[id,'component-contracts']),
 ...batch35FinanceIds.map(id=>[id,'remaining-contracts']),
 ...supplementalBusinessIds.map(id=>[id,'business-contracts']),
 ...supplementalFinanceIds.map(id=>[id,'remaining-contracts']),
]);
function labelForField(key:string){
 return labels[key]??key.replace(/([a-z])([A-Z])/g,'$1 $2').replace(/^./,ch=>ch.toUpperCase()).replace(/Mrr/g,'MRR');
}
const marginSources:Readonly<Partial<Record<number,string>>>={
 139:'business-contracts',140:'business-contracts',
};
const batch20Sources:Readonly<Partial<Record<number,string>>>={
 391:'health/catalog-batch-1',392:'health/catalog-batch-1',393:'health/catalog-batch-1',394:'health/catalog-batch-1',
 398:'health/catalog-batch-2',399:'health/catalog-batch-2',400:'health/catalog-batch-2',401:'health/catalog-batch-2',
 411:'biology/catalog-batch-1',417:'biology/catalog-batch-2',418:'biology/catalog-batch-3',
};
const nextSources:Readonly<Partial<Record<number,string>>>={
 275:'geometry/catalog-completion',412:'biology/catalog-batch-1',
};
const familySources:Readonly<Partial<Record<number,string>>>={
 1:'finance/loan-payment',18:'finance/credit-card-payoff',26:'finance/mortgage',53:'finance/step-up-sip',56:'finance/recurring-deposit',
 235:'advanced-math/catalog-batch-10',251:'advanced-math/catalog-batch-10',276:'geometry/catalog-completion',
 282:'statistics/catalog-batch-1',283:'statistics/catalog-batch-1',388:'health/bmi',389:'health/catalog-batch-1',
 390:'health/catalog-batch-1',395:'health/catalog-batch-1',396:'health/catalog-batch-1',
};
const agricultureSources:Readonly<Partial<Record<number,string>>>={
 421:'src/calculators/biology/catalog-batch-5.ts',422:'src/calculators/biology/catalog-batch-4.ts',
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
 termMonths:'Term',balance:'Opening balance',annualAprPercent:'Annual APR',monthlyPayment:'Monthly payment',extraMonthlyPayment:'Extra monthly payment',
 initialMonthlyContribution:'Initial monthly contribution',annualStepUpPercent:'Annual contribution increase',annualReturnPercent:'Assumed annual return',contributionTiming:'Contribution timing',
 monthlyDeposit:'Monthly deposit',annualInterestPercent:'Nominal annual interest rate',depositTiming:'Deposit timing',
 length:'Prism length',width:'Prism width',height:'Prism height',growthConstant:'Continuous growth constant',
 revenue:'Supplied revenue',directCosts:'Supplied direct costs',netIncome:'Supplied net income',
 currency:'Currency',period:'Measurement period',measurementBasis:'Measurement basis',scope:'Private scope',
 tdeeKcal:'Supplied daily expenditure',dailyAdjustmentKcal:'Supplied daily adjustment',bmi:'Supplied BMI',targetBmi:'Selected reference BMI',
 dailyCalories:'Supplied daily energy',met:'Supplied activity MET',minutes:'Activity duration',
 parent1:'First parent genotype',parent2:'Second parent genotype',
 initialPopulation:'Initial model population',time:'Elapsed time',allelePFrequency:'Allele p frequency',
 x1:'First x-coordinate',y1:'First y-coordinate',x2:'Second x-coordinate',y2:'Second y-coordinate',values:'Observations (JSON list of numbers)',kind:'Denominator convention',
 expression:'Function of x',minX:'Minimum x',maxX:'Maximum x',weightKg:'Weight',heightCm:'Height',sex:'Equation reference group',ageYears:'Age',
 bmrKcal:'Supplied resting energy',activityMultiplier:'Supplied activity multiplier',
 earsPerAcre:'Ears per acre',kernelRowsPerEar:'Average kernel rows per ear',kernelsPerRow:'Average kernels per row',kernelsPerBushel:'Assumed kernels per bushel',
 plantCount:'Plants counted',sampleRowLengthFeet:'Sample row length',rowSpacingInches:'Row spacing',
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
 const finance=financeSources[options.catalogId]??familySources[options.catalogId]??nextSources[options.catalogId]??batch20Sources[options.catalogId]??marginSources[options.catalogId]??supplementalSources[options.catalogId];
 const path=finance?`src/calculators/${finance}.ts`:additions[options.catalogId]??agricultureSources[options.catalogId];
 const contract=createEngineeringContract(engine,{...options,sourceEvidence:path?[path]:sourceEvidence});
 const outputUnit=options.catalogId===534?(input:Record<string,unknown>)=>String(input.toUnit):undefined;
 return Object.freeze({...contract,outputUnit,engine,primaryLabel,outputs:{[contract.primaryKey]:{label:primaryLabel,unit:contract.unit},...secondary},
  fields:contract.fields.map(field=>({...field,label:labelForField(field.key)}))});
}
const timing=['beginning','end'] as const;
const groups=['male','female'] as const;
const currencyMetric=(label:string)=>({label,unit:currency});
const loanMetrics={totalPayment:currencyMetric('Total payments'),totalInterest:currencyMetric('Total interest')};
const loanFields={principal:currency,annualRatePercent:'% per year',termMonths:'months'};
const plotScope='Samples up to 81 finite points on an evenly spaced x-grid using the restricted expression grammar. Displayed extrema are sampled values. Undefined samples are omitted; no continuity or root guarantee.';
const dispersionScope='Uses the supplied list in one common unit. Population divides by n; sample divides by n − 1 and requires at least two observations. No missing-data imputation. Variance uses squared input units.';
const dispersionFields={fieldOptions:{kind:['population','sample']},numberLists:['values']} as const;
const observationCount={label:'Observation count',unit:'observations'};
const adultEstimate='Educational estimate for the adult methodology scope. No individual diagnosis, treatment, dose or nutrition prescription. Population and clinical applicability require competent review.';
function suppliedMargin(id:139|140, scope:string){
 const engine=businessContracts.find(definition=>definition.id===`private.business.${id}`);
 if(!engine)throw Error('Exact supplied-margin definition unavailable');
 const example=engine.inputSchema.parse(businessExamples[id]) as Record<string,unknown>;
 const definition={...engine,examples:[{label:'Retained supplied basis',input:example,expected:engine.calculate(example,{})}]} as CalculatorDefinition<Record<string,unknown>,Record<string,unknown>>;
 return profile(definition,{catalogId:id,primaryKey:'value',unit:'%',scope,registered:false,
  textFields:['currency','period','measurementBasis'],fieldOptions:{scope:['supplied-business-no-policy']},
  fieldUnits:{revenue:currency,directCosts:currency,netIncome:currency}},'Margin');
}
function suppliedProfile(id:number, family:'business'|'remaining'|'component'){
 const engines=family==='business'?businessContracts:family==='component'?componentContracts:remainingContracts;
 const samples=family==='business'?businessExamples:family==='component'?componentExamples:remainingExamples;
 const engine=engines.find(definition=>definition.id===`private.${family}.${id}`);
 if(!engine)throw Error('Exact supplied-input definition unavailable');
 const example=engine.inputSchema.parse(samples[id]) as Record<string,unknown>;
 const expected=engine.calculate(example,{});
 const definition={...engine,examples:[{label:'Retained supplied basis',input:example,expected}]} as CalculatorDefinition<Record<string,unknown>,Record<string,unknown>>;
 const scope=engine.formulas[0].description+(id===3?' This capture displays the original scheduled amortization with zero extra payment.':id===5?' This capture evaluates a positive extra payment and shows interest saved against the original schedule.':'');
 const fieldOptions=Object.fromEntries(Object.entries(example)
  .filter(([key,value])=>typeof value==='string'&&(key==='scope'||key==='timing'||key==='monthRule'||key==='contributionTiming'||key==='ownershipBasis'||(id===178&&key==='period')))
  .map(([key,value])=>[key,key==='monthRule'?['clamp-original-day','end-of-month']:key==='contributionTiming'?['beginning','end']:[String(value)]]));
 const structuredFields=Object.keys(example).filter(key=>typeof example[key]==='boolean'||Array.isArray(example[key]));
 const textFields=Object.keys(example).filter(key=>typeof example[key]==='string'&&!Object.hasOwn(fieldOptions,key));
 const unit=id===5?'supplied currency':String(expected.unit);
 const primaryKey=id===5?'interestSavedVsScheduled':'value';
 const scalarCompanions=Object.entries(expected)
  .filter(([key,value])=>key!==primaryKey&&key!=='value'&&typeof value==='number')
  .map(([key])=>[key,{label:labelForField(key)}] as const);
 return profile(definition,{catalogId:id,primaryKey,unit,scope,registered:false,nullablePrimary:true,fieldOptions,
  textFields,structuredFields,validate:input=>{
   if(id===3&&input.extraMonthlyPayment!==0)throw Error('Use the Extra Payment profile to compare positive extra payments');
   if(id===5&&Number(input.extraMonthlyPayment)<=0)throw Error('Enter a positive extra monthly payment');
  }},id===5?'Estimated interest saved':'Supplied-input result',Object.fromEntries(scalarCompanions));
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
 profile(agriculturalYieldCalculator,{catalogId:421,primaryKey:'bushelsPerAcre',unit:'bu/acre',scope:'Corn yield-component estimate from supplied ears, average rows and kernels, and assumed kernels per bushel. Kernel size and weight vary. v1 rounds the estimate to two decimal places.',fieldUnits:{earsPerAcre:'ears/acre',kernelRowsPerEar:'rows/ear',kernelsPerRow:'kernels/row',kernelsPerBushel:'kernels/bu'},validate:(_,result)=>{if(result.bushelsPerAcre===0)throw Error('Yield estimate rounds to zero at v1 precision');}},'Estimated corn yield',{kernelsPerAcre:{label:'Estimated kernels',unit:'kernels/acre'}}),
 profile(plantPopulationCalculator,{catalogId:422,primaryKey:'plantsPerAcre',unit:'plants/acre',scope:'Scales one fixed-width row sample using its length and row spacing. The estimate assumes representative sampling and 43,560 square feet per acre. v1 rounds population to two decimals and area to six.',fieldUnits:{plantCount:'plants',sampleRowLengthFeet:'ft',rowSpacingInches:'in'},validate:(_,result)=>{if(result.sampleAreaSquareFeet===0||result.plantsPerAcre===0)throw Error('Sample area or population rounds to zero at v1 precision');}},'Estimated plant population',{sampleAreaSquareFeet:{label:'Sample area',unit:'ft²'}}),
 profile(loanPaymentCalculator,{catalogId:1,primaryKey:'monthlyPayment',unit:currency+'/month',scope:'Fixed-rate monthly amortization with the first payment one month after origination. The nominal rate is divided by 12. v1 totals use the rounded monthly payment. Excludes fees and actual lender schedules.',fieldUnits:loanFields},'Principal and interest payment',loanMetrics),
 profile(creditCardPayoffCalculator,{catalogId:18,primaryKey:'payoffMonths',unit:'months',scope:'One balance, fixed APR divided by 12, end-of-month fixed payments and no new charges, fees or rate changes. v1 retains its monthly cent rounding and final partial payment.',fieldUnits:{balance:currency,annualAprPercent:'% per year',monthlyPayment:currency+'/month',extraMonthlyPayment:currency+'/month'}},'Payoff period',{totalInterest:currencyMetric('Total interest'),totalPaid:currencyMetric('Total paid'),effectiveMonthlyPayment:currencyMetric('Combined monthly payment'),firstMonthInterest:currencyMetric('First month interest')}),
 profile(mortgageCalculator,{catalogId:26,primaryKey:'monthlyPayment',unit:currency+'/month',scope:'Fixed-rate principal and interest only, assuming monthly end-of-period payments. No property taxes, insurance, escrow, HOA fees or closing costs. v1 totals use the rounded monthly payment.',fieldUnits:loanFields},'Mortgage principal and interest',loanMetrics),
 profile(stepUpSipCalculator,{catalogId:53,primaryKey:'futureValue',unit:currency,scope:'Monthly contributions increase annually. Uses the entered nominal return and selected within-month contribution timing. The usual investment uncertainty, taxes and fees are outside this estimate.',fieldOptions:{contributionTiming:timing},fieldUnits:{initialMonthlyContribution:currency+'/month',annualStepUpPercent:'%',annualReturnPercent:'%',termMonths:'months'}},'Estimated future value',{investedAmount:currencyMetric('Invested amount'),estimatedGain:currencyMetric('Estimated gain'),finalMonthlyContribution:currencyMetric('Final monthly contribution')}),
 profile(recurringDepositCalculator,{catalogId:56,primaryKey:'maturityValue',unit:currency,scope:'Fixed monthly deposits with user-selected within-month timing and nominal rate divided by 12. v1 rounds the maturity estimate to two decimals. No product-specific compounding rules, tax, fees or early withdrawal.',fieldOptions:{depositTiming:timing},fieldUnits:{monthlyDeposit:currency+'/month',annualInterestPercent:'%',termMonths:'months'}},'Estimated maturity value',{depositedAmount:currencyMetric('Deposited amount'),interestEarned:currencyMetric('Interest earned')}),
 profile(graphingCalculator,{catalogId:235,primaryKey:'maximum',unit:'y units',scope:plotScope,textFields:['expression']},'Largest sampled value',{minimum:{label:'Smallest sampled value',unit:'y units'}}),
 profile(functionPlotter2dCalculator,{catalogId:251,primaryKey:'maximum',unit:'y units',scope:plotScope,textFields:['expression']},'Largest sampled value',{minimum:{label:'Smallest sampled value',unit:'y units'}}),
 profile(slopeCalculator,{catalogId:276,primaryKey:'value',unit:'y units / x units',scope:'Slope from two coordinates with consistent units on each axis. Vertical lines have no finite slope and are refused. Uses the recorded v2 arithmetic.'},'Slope',{dx:{label:'Change in x',unit:'x units'},dy:{label:'Change in y',unit:'y units'}}),
 profile(standardDeviationCalculator,{catalogId:282,primaryKey:'standardDeviation',unit:'input unit',scope:dispersionScope,...dispersionFields},'Standard deviation',{mean:{label:'Mean',unit:'input unit'},count:observationCount}),
 profile(varianceCalculator,{catalogId:283,primaryKey:'variance',unit:'squared input unit',scope:dispersionScope,...dispersionFields},'Variance',{mean:{label:'Mean',unit:'input unit'},count:observationCount}),
 profile(bmiCalculator,{catalogId:388,primaryKey:'bmi',unit:'kg/m²',scope:'Adult educational weight-to-height index, not a direct measure of body composition. v1 rounds BMI to one decimal. '+adultEstimate,fieldUnits:{weightKg:'kg',heightCm:'cm'}},'Body mass index'),
 profile(bmrCalculator,{catalogId:389,primaryKey:'value',unit:'kcal/day',scope:'Mifflin–St Jeor adult resting-energy estimate, ages 18–120 in the engine schema. Encoded age bounds are not proof of population validation. '+adultEstimate,fieldOptions:{sex:groups},fieldUnits:{weightKg:'kg',heightCm:'cm',ageYears:'years'},validate:(_,out)=>{if(out.value<=0)throw Error('Estimated resting energy is outside the supported positive domain');}},'Estimated resting energy'),
 profile(tdeeCalculator,{catalogId:390,primaryKey:'value',unit:'kcal/day',scope:'Multiplies supplied resting energy by the entered factor, from 1 to 2.5. No automatic activity or recommended-intake classification. '+adultEstimate,fieldUnits:{bmrKcal:'kcal/day',activityMultiplier:'ratio'}},'Estimated daily energy expenditure'),
 profile(leanBodyMassCalculator,{catalogId:395,primaryKey:'value',unit:'kg',scope:'Boer linear estimate from weight, height and its two equation branches. No direct body-composition measurement. '+adultEstimate,fieldOptions:{sex:groups},fieldUnits:{weightKg:'kg',heightCm:'cm'},validate:(input,out)=>{if(out.value<=0||out.value>input.weightKg)throw Error('Estimated lean mass is outside the supported positive domain');}},'Estimated lean body mass'),
 profile(bodySurfaceAreaCalculator,{catalogId:396,primaryKey:'value',unit:'m²',scope:'Mosteller estimate, square root of centimetres times kilograms divided by 3,600. '+adultEstimate,fieldUnits:{weightKg:'kg',heightCm:'cm'}},'Estimated body surface area'),

 profile(volumeCalculator,{catalogId:275,primaryKey:'volume',unit:'cubic supplied units',scope:'Rectangular prism only. Enter three positive dimensions in one common length unit. Output is the product of the dimensions, excluding bulk packing or capacity assumptions.',fieldUnits:{length:'supplied length unit',width:'supplied length unit',height:'supplied length unit'}},'Prism volume',{surfaceArea:{label:'Prism surface area',unit:'square supplied units'}}),
 profile(doublingTimeCalculator,{catalogId:412,primaryKey:'value',unit:'supplied time unit',scope:'Ideal positive continuous exponential model with a constant supplied growth rate. Result is ln(2) divided by the rate, in its reciprocal time unit. v1 rounds to six decimals. No resource-limit or real population projection.',fieldUnits:{growthConstant:'per supplied time unit'}},'Ideal doubling time'),
 profile(calorieCalculator,{catalogId:391,primaryKey:'value',unit:'kcal/day',scope:'Adds a supplied daily adjustment to a supplied energy-expenditure estimate. The private capture requires a positive result. No recommendation of an adjustment or intake. '+adultEstimate,fieldUnits:{tdeeKcal:'kcal/day',dailyAdjustmentKcal:'kcal/day'},validate:(_,out)=>{if(out.value===0)throw Error('Enter assumptions yielding a positive arithmetic result');}},'Adjusted arithmetic total'),
 profile(bodyFatCalculator,{catalogId:392,primaryKey:'value',unit:'%',scope:'Deurenberg adult equation from supplied BMI, age and equation reference group. New capture refuses results outside 0–100%. '+adultEstimate,fieldOptions:{sex:groups},fieldUnits:{bmi:'kg/m²',ageYears:'years'},validate:(_,out)=>{if(out.value<0||out.value>100)throw Error('Estimated body fat is outside 0–100%');}},'Equation estimate'),
 profile(idealWeightCalculator,{catalogId:393,primaryKey:'value',unit:'kg',scope:'Historical Devine estimate for height 152.4–250 cm. The name identifies the original equation and is not a personal weight goal. '+adultEstimate,fieldOptions:{sex:groups},fieldUnits:{heightCm:'cm'}},'Devine equation estimate'),
 profile(healthyWeightCalculator,{catalogId:394,primaryKey:'value',unit:'kg',scope:'Weight corresponding mathematically to the supplied adult BMI reference between 18.5 and 24.9. No judgment of health or individual recommendation. '+adultEstimate,fieldUnits:{heightCm:'cm',targetBmi:'kg/m²'}},'Reference BMI equivalent'),
 profile(proteinIntakeCalculator,{catalogId:398,primaryKey:'value',unit:'g/day',scope:'Illustrates the general adult reference of 0.8 grams per kilogram. Pregnancy, lactation, athletics, disease and therapeutic diets are outside this scope. '+adultEstimate,fieldUnits:{weightKg:'kg'}},'Protein reference arithmetic'),
 profile(carbohydrateIntakeCalculator,{catalogId:399,primaryKey:'value',unit:'g/day',scope:'Converts 55% of supplied energy to grams using 4 kcal/g. The midpoint of the adult 45–65% reference range is illustrative. '+adultEstimate,fieldUnits:{dailyCalories:'kcal/day'}},'Carbohydrate reference midpoint'),
 profile(fatIntakeCalculator,{catalogId:400,primaryKey:'value',unit:'g/day',scope:'Converts 27.5% of supplied energy to grams using 9 kcal/g. The midpoint of the adult 20–35% reference range is illustrative. '+adultEstimate,fieldUnits:{dailyCalories:'kcal/day'}},'Fat reference midpoint'),
 profile(caloriesBurnedCalculator,{catalogId:401,primaryKey:'value',unit:'kcal',scope:'Gross estimated activity energy from supplied MET, body weight and duration. No automatic MET selection or net expenditure claim. '+adultEstimate,fieldUnits:{weightKg:'kg',met:'MET',minutes:'min'}},'Estimated gross activity energy'),
 profile(populationGrowthCalculator,{catalogId:411,primaryKey:'value',unit:'modeled individuals',scope:'Ideal constant-rate continuous exponential model, without resource limits or demographic forecasts. v1 rounds to six decimals. Refuses a positive model value that rounds to zero.',fieldUnits:{initialPopulation:'modeled individuals',growthConstant:'per supplied time unit',time:'supplied time unit'},validate:requirePositiveAstronomyResult},'Modeled population'),
 profile(hardyWeinbergCalculator,{catalogId:417,primaryKey:'twoPq',unit:'fraction',scope:'Educational two-allele diploid equilibrium model with random mating and no selection, migration, mutation or drift. Reports theoretical fractions, not observed genetics or clinical risk.',fieldUnits:{allelePFrequency:'fraction (0–1)'}},'Heterozygote fraction',{p:{label:'Allele p',unit:'fraction'},q:{label:'Allele q',unit:'fraction'},p2:{label:'Homozygote p²',unit:'fraction'},q2:{label:'Homozygote q²',unit:'fraction'}}),
 profile(punnettSquareCalculator,{catalogId:418,primaryKey:'offspring',unit:'equally likely combinations',scope:'Educational single-locus diploid cross. Enter two copies of a single allele letter for each parent, using case to distinguish variants. Reports four equally likely Mendelian outcomes and grouped genotype fractions, without phenotype, disease or real offspring prediction.',textFields:['parent1','parent2'],primaryStringList:true},'Offspring combinations'),
 suppliedMargin(139,'Gross margin from entered revenue and direct costs in the same period, currency and measurement basis. No inventory, cost attribution or accounting policy is inferred.'),
 suppliedMargin(140,'Net margin from entered net income and revenue in the same period, currency and measurement basis. No recognition, taxation or formal financial statement judgment is inferred.'),
 ...borrowerIds.map(id=>suppliedProfile(id,'component')),
 ...batch35FinanceIds.map(id=>suppliedProfile(id,'remaining')),
 ...supplementalBusinessIds.map(id=>suppliedProfile(id,'business')),
 ...supplementalFinanceIds.map(id=>suppliedProfile(id,'remaining')),
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
 const capture=id===63||id===67?'private.worker2.investment-horizon-average.20261124.1':batch35Ids.has(id)?'private.worker2.batch35.20261124.1':id===66||id===111?'private.worker2.annualized-inputs.20261124.1':supplementalSources[id]?'private.worker2.batch27.20261124.1':marginSources[id]?'private.worker2.supplied-margins.20261124.1':batch20Sources[id]?'private.worker2.batch20.20261124.1':nextSources[id]?'private.worker2.next-quantity.20261124.1':familySources[id]?'private.worker2.math-borrower-health.20261124.1':agricultureSources[id]?'private.worker2.agricultural-quantity.20261124.1':financeSources[id]?'private.worker2.finance-business.20261124.1':additions[id]?'private.worker2.astronomy-mobility.20261124.1':id===509?'private.worker2.fuel-trip.20261124.1':'private.worker2.energy-mobility.20261119.1';
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
