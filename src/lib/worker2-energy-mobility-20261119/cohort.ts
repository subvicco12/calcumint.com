import {sourceBoundProfiles} from '@/calculators/source-bound-profiles';
import {ingredientWeightVolumeDraftCalculator} from '@/calculators/food/draft-master-498';
import {draftMaster435Calculator} from '@/calculators/conversion/draft-master-435';
import {airDensityCalculator} from '@/calculators/earth-science/catalog-batch-2';
import {weightedGradeCalculator} from '@/calculators/travel/draft-master-517';
import {sipCalculator} from '@/calculators/finance/sip';
import {swpCalculator} from '@/calculators/finance/swp';
import {termDepositCalculator} from '@/calculators/finance/term-deposit';
import {annualHeatComparison} from '@/calculators/annual-heat-comparison';
import {completionContracts,completionExamples} from '@/calculators/completion-contracts';
import {finalPrivateExamples} from '@/calculators/final-private-workbench';
import {privateWorkflowDefinitions} from '@/calculators/private-scenario-workflows';
import Decimal from 'decimal.js';
import {electricalLoadCalculator,voltageDropCalculator,resistorCalculator,hvacBtuCalculator,solarPanelRequirementCalculator} from '@/calculators/engineering-construction/catalog-batch-3';
import {annualRecurringRevenueCalculator,monthlyRecurringRevenueCalculator} from '@/calculators/business/catalog-batch-1';
import {arpuCalculator,cashRunwayCalculator} from '@/calculators/business/catalog-batch-2';
import {scientificDraftCalculator,type ScientificDraftInput} from '@/calculators/core/draft-master-206';
import {draftMaster232Calculator} from '@/calculators/core/draft-master-232';
import {draftMaster233Calculator} from '@/calculators/core/draft-master-233';
import {oddsCalculator} from '@/calculators/statistics/catalog-batch-4';
import {meanMedianModeRangeCalculator} from '@/calculators/statistics/catalog-batch-1';
import {molecularWeightCalculator} from '@/calculators/chemistry/molecular-weight';
import {derivativeCalculator,integralCalculator,limitCalculator} from '@/calculators/advanced-math/catalog-batch-9';
import {seriesCalculator} from '@/calculators/advanced-math/catalog-batch-10';
import {polynomialCalculator} from '@/calculators/advanced-math/catalog-batch-8';
import {linearEquationCalculator,quadraticFormulaCalculator,matrixDeterminantCalculator} from '@/calculators/advanced-math/catalog-batch-5';
import {systemOfEquationsCalculator,matrixInverseCalculator,complexNumberCalculator} from '@/calculators/advanced-math/catalog-batch-6';
import {rrefCalculator,sequenceCalculator,vectorCalculator} from '@/calculators/advanced-math/catalog-batch-7';
import {functionPlotter3dCalculator,matrixCalculator} from '@/calculators/advanced-math/catalog-final';
import {privateScientificDefinitions} from '@/calculators/private-scientific-definitions';
import type {FactoryWorkbenchField} from '@/components/calculator-factory-workbench';
import {getFactoryContract} from '@/lib/calculator-factory/registry';
import {calculatorRegistry} from '@/calculators/registry';
import {basicDraftCalculator} from '@/calculators/core/draft-master-205';
import {draftMaster441Calculator} from '@/calculators/conversion/draft-master-441';
import {evChargingEnergyDraftCalculator} from '@/calculators/energy/draft-master-484';
import {sleepDurationCalculator} from '@/calculators/travel/draft-master-518';
import {powerWeightRatioDraftCalculator} from '@/calculators/sports/draft-master-529';
import {planetaryWeightCalculator,GRAVITY_REFERENCE_VERSION} from '@/calculators/astronomy/draft-master-531';
import {rainwaterHarvestingDraftCalculator} from '@/calculators/energy/draft-master-487';
import {privateCatalogAdapters} from '@/calculators/private-catalog-adapters';
import {privateOwnerBusinessCore} from '@/calculators/private-owner-business-core';
import {privateOwnerBusinessImpact} from '@/calculators/private-owner-business-impact';
import {privateOwnerEveryday} from '@/calculators/private-owner-everyday';
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
const batch39ComponentIds=[22,24,27,28,29,30,33,104,105] as const;
const batch39RemainingIds=[70,74,79,94,101,102,110,113,477,480] as const;
const batch39BusinessIds=[141,144,148,149,151,152,153,164,174,175,176,180,183,185,188,189,197,202] as const;
const batch39Ids=new Set<number>([...batch39ComponentIds,...batch39RemainingIds,...batch39BusinessIds]);
const borrowerIds=[3,4,5,6,7,8,11,12,13,14,15,16,17] as const;
const batch35FinanceIds=[25,37,45,47,68,71,72,73,75,76,77,83,93,100,106,107,108,465,466,473] as const;
const batch35Ids=new Set<number>([...borrowerIds,...batch35FinanceIds]);
const supplementalBusinessIds=[142,143,165,166,167,169,171,178,182,186,187,190,192,193,196] as const;
const supplementalFinanceIds=[57,58,59,60,61,62,69,78,114,115,66,111,63,67] as const;
const supplementalSources:Readonly<Partial<Record<number,string>>>=Object.fromEntries([
 ...batch39ComponentIds.map(id=>[id,'component-contracts']),
 ...batch39RemainingIds.map(id=>[id,'remaining-contracts']),
 ...batch39BusinessIds.map(id=>[id,'business-contracts']),
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
 primaryLabel:string, secondary:Readonly<Record<string,ScenarioFieldDisplay>>={}, engineSource?:string,
){
 const finance=financeSources[options.catalogId]??familySources[options.catalogId]??nextSources[options.catalogId]??batch20Sources[options.catalogId]??marginSources[options.catalogId]??supplementalSources[options.catalogId];
 const path=finance?`src/calculators/${finance}.ts`:additions[options.catalogId]??agricultureSources[options.catalogId];
 const contract=createEngineeringContract(engine,{...options,sourceEvidence:engineSource?[engineSource]:path?[path]:sourceEvidence});
 const outputUnit=(options.catalogId===534||options.catalogId===441)?(input:Record<string,unknown>)=>String(input.toUnit):undefined;
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
 const scope=engine.formulas[0].description+(id===3?' This capture displays the original scheduled amortization with zero extra payment.':id===5?' This capture evaluates a positive extra payment and shows interest saved against the original schedule.':id===24?' This view evaluates net lifetime refinancing savings.':id===33?' This view evaluates the month when supplied refinancing costs are recovered from positive payment savings.':'');
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
  }},id===5?'Estimated interest saved':id===24?'Net lifetime savings':id===33?'Break-even period':'Supplied-input result',Object.fromEntries(scalarCompanions));
}
const batch44Profiles = [
 [10,'nominalAnnualRatePercent','% per year','Nominal annual interest rate'],
 [38,'netOperatingIncome','supplied currency','Net operating income'],
 [39,'capitalizationRatePercent','% per year','Capitalization rate'],
 [40,'cashOnCashReturnPercent','% per year','Pretax cash-on-cash return'],
 [41,'debtServiceCoverageRatio','multiple','Debt service coverage'],
 [42,'grossRentMultiplier','multiple','Gross rent multiplier'],
 [65,'periodRatePercent','% per supplied period','Bracketed internal rate of return'],
 [146,'costOfGoodsSold','supplied currency','Cost of goods sold'],
 [147,'operatingMarginPercent','%','Operating margin'],
 [150,'quickRatio','multiple','Quick ratio'],
 [154,'returnOnAssetsPercent','%','Return on assets'],
 [155,'returnOnEquityPercent','%','Return on equity'],
] as const;
const batch44OwnerProfiles = [
 [44,'changeLostRent','supplied currency per period','Change in lost rent',privateOwnerBusinessImpact,'private-owner-business-impact'],
 [109,'difference','supplied currency per period','Difference between basket costs',privateOwnerEveryday,'private-owner-everyday'],
 [145,'grossSales','supplied currency per period','Gross sales',privateOwnerBusinessCore,'private-owner-business-core'],
 [157,'hourlyRevenue','supplied currency/hour','Required revenue per billable hour',privateOwnerBusinessCore,'private-owner-business-core'],
 [177,'scorePercent','percentage points','Growth plus profitability',privateOwnerBusinessCore,'private-owner-business-core'],
 [200,'profit','supplied currency per period','Marketplace profit',privateOwnerBusinessImpact,'private-owner-business-impact'],
 [203,'shippingContribution','supplied currency per selected basis','Shipping contribution',privateOwnerBusinessImpact,'private-owner-business-impact'],
] as const;
const batch44Ids = new Set<number>([31,...batch44Profiles.map(row=>row[0]),...batch44OwnerProfiles.map(row=>row[0])]);

function batch44Profile(definition:CalculatorDefinition<unknown,unknown>,catalogId:number,primaryKey:string,unit:string,label:string,source:string,sample?:Record<string,unknown>){
 const engine=definition as CalculatorDefinition<Record<string,unknown>,Record<string,unknown>>;
 const base=engine.examples[0];
 const input=sample??base.input;
 const result=engine.calculate(input,{});
 const bound=sample?{...engine,examples:[{label:'Retained source vector',input,expected:result}]}:engine;
 const choices:Record<string,readonly string[]>={};
 if(catalogId===203)choices.basis=['per-order','period'];
 if(catalogId===31)choices.scope=[String(input.scope)];
 const fields=Object.entries(input);
 const secondary=Object.fromEntries(Object.entries(result)
  .filter(([key,value])=>key!==primaryKey&&typeof value==='number')
  .map(([key])=>[key,{label:labelForField(key)}]));
 return profile(bound,{
  catalogId,primaryKey,unit,scope:engine.formulas[0].description,registered:false,fieldOptions:choices,
  textFields:fields.filter(([key,value])=>typeof value==='string'&&!Object.hasOwn(choices,key)).map(([key])=>key),
  structuredFields:fields.filter(([,value])=>Array.isArray(value)).map(([key])=>key),
 },label,secondary,`src/calculators/${source}.ts`);
}

const overnightExample={sleepStart:'2026-01-01T23:00Z',wakeEnd:'2026-01-02T07:00Z',awakeMinutes:30};
const gravityExample={bodyMass:1,massUnit:'kg',body:'standard-earth',referenceVersion:GRAVITY_REFERENCE_VERSION} as const;
const batch41Ids = new Set([205,441,484,518,529,531]);

const densityExample={value:'96',fromUnit:'dpi',toUnit:'dppx'} as const;
const densityUnits=['dpi','dpcm','dppx'] as const;

const mathCaptureIds = new Set([
 208,209,210,211,212,215,216,218,219,220,221,223,224,225,227,228,230,231,234,
 255,256,257,258,259,260,261,262,263,264,
]);

const statisticsFollowupIds=new Set([284,285,286,287,288,289,291,300]);
const chemistryIds=new Set([328,329,330,331,332,333,334,335,336,337,338,339,340,341,342]);

function retainedNumericProfile(catalogId:number){
 const retained=getFactoryContract(catalogId);
 if(!retained?.registered||retained.fields.some(field=>field.kind!=='number'))throw Error('Exact retained numeric factory contract required');
 const definition=calculatorRegistry.getById(retained.engineId);
 if(!definition||definition.slug!==retained.slug||definition.version!==retained.version)throw Error('Exact retained registered engine required');
 const engine=definition as CalculatorDefinition<Record<string,unknown>,Record<string,unknown>>;
 const raw=Object.fromEntries(retained.fields.map(field=>[field.key,String(field.defaultValue)]));
 const snapshot=retained.execute(raw);
 const unit=retained.unit||'dimensionless';
 const fields:readonly import('@/components/calculator-factory-workbench').FactoryWorkbenchField[]=retained.fields.map(({key,label,kind,defaultValue,unit})=>({key,label,kind,defaultValue,...(unit?{unit}:{})}));
 const secondary=Object.fromEntries(Object.entries(snapshot.output)
  .filter(([key,value])=>key!==retained.primaryKey&&typeof value==='number')
  .map(([key])=>[key,{label:labelForField(key),...(key.startsWith('angle')?{unit:'degrees'}:key==='area'?{unit:'square supplied units'}:key==='perimeter'?{unit:'supplied units'}:key==='volume'?{unit:'cubic supplied units'}:{})}]));
 const bound={...engine,examples:[{label:'Retained factory example',input:snapshot.input,expected:snapshot.output}]};
 const contract=profile(bound,{catalogId,primaryKey:retained.primaryKey,unit,scope:retained.scope,registered:false},'Result',secondary);
 return Object.freeze({...contract,fields,execute:retained.execute,
  sourceEvidence:retained.sourceEvidence,limitations:retained.limitations});
}

const carryoverIds = new Set([156,161,194,195,535]);
function requireAnnualSchedule(value:unknown){
 if(!Array.isArray(value)||value.length===0||!value.every((row,index)=>row?.year===index+1&&Number.isFinite(row.value)))throw Error('Complete finite annual schedule required');
}

function requireRationalPrimary(value:unknown){
 if(typeof value!=='object'||value===null||!('numerator' in value)||!('denominator' in value)||
    typeof value.numerator!=='string'||! /^-?\d+$/.test(value.numerator)||
    typeof value.denominator!=='string'||! /^[1-9]\d*$/.test(value.denominator))throw Error('Exact rational primary result required');
}

const ownerModes = [
 [156,privateOwnerBusinessCore,'private-owner-business-core','profit','supplied currency','Project profit'],
 [161,privateOwnerBusinessCore,'private-owner-business-core','contribution','supplied currency per unit','Unit contribution'],
 [194,privateOwnerBusinessImpact,'private-owner-business-impact','requiredSpend','supplied currency per period','Required advertising spend'],
 [195,privateOwnerBusinessImpact,'private-owner-business-impact','targetRoasMultiple','multiple','Target ROAS'],
 [467,privateOwnerEveryday,'private-owner-everyday','schedule','supplied currency','Ending value'],
] as const;

function modeSpecificProfile([id,bindings,source,primary,unit,label]:typeof ownerModes[number]){
 const engine=bindings.find(binding=>binding.masterId===id)!.definition as CalculatorDefinition<Record<string,unknown>,Record<string,unknown>>;
 const variants=engine.examples.map(example=>{
  const mode=String(example.input.mode);
  const fields=Object.entries(example.input);
  const key=mode==='dated-npv'?'npv':primary;
  const output=engine.calculate(example.input,{});
  const secondary=Object.fromEntries(Object.entries(output).filter(([name,value])=>name!==key&&typeof value==='number').map(([name])=>[name,{label:labelForField(name)}]));
  return {mode,contract:profile({...engine,examples:[example]},{
   catalogId:id,primaryKey:key,unit,scope:engine.formulas[0].description,registered:false,
   fieldOptions:{mode:[mode]},
   ...(id===467?{validateStructuredPrimary:requireAnnualSchedule}:{}),
   textFields:fields.filter(([key,value])=>key!=='mode'&&typeof value==='string').map(([key])=>key),
   structuredFields:fields.filter(([,value])=>Array.isArray(value)).map(([key])=>key),
  },mode==='dated-npv'?'Net present value':label,secondary,`src/calculators/${source}.ts`)};
 });
 const first=variants[0].contract;
 const fields=new Map<string,FactoryWorkbenchField>();
 for(const {contract} of variants)for(const field of contract.fields)if(!fields.has(field.key))fields.set(field.key,field);
 const allModes=variants.map(row=>row.mode);
 const visible=Array.from(fields.values(),field=>{
  if(field.key==='mode')return {...field,options:allModes};
  const modes=variants.filter(row=>row.contract.fields.some(candidate=>candidate.key===field.key)).map(row=>row.mode);
  return modes.length===allModes.length?field:{...field,visibilityModes:modes};
 });
 const fromMode=(mode:unknown)=>{
  const variant=variants.find(row=>row.mode===mode);
  if(!variant)throw Error('Unsupported calculation mode');
  return variant.contract;
 };
 return Object.freeze({...first,engine,fields:visible,outputs:Object.assign({},...variants.map(row=>row.contract.outputs)) as typeof first.outputs,
  execute:(raw:Parameters<typeof first.execute>[0])=>fromMode(raw.mode).execute(raw),
  verifyHistorical:(snapshot:CalculationSnapshot)=>fromMode(snapshot.input.mode).verifyHistorical(snapshot),
 });
}

const sunEventsEngine=privateScientificDefinitions.find(row=>row.masterId===535)!.definition as CalculatorDefinition<Record<string,unknown>,Record<string,unknown>>;
const sunExample={date:'2024-03-20',latitude:0,longitude:0,utcOffsetMinutes:60};

const structuredMathRows = [
 [237,linearEquationCalculator,'solution','Solution x','batch-5'],
 [238,quadraticFormulaCalculator,'discriminant','Discriminant','batch-5'],
 [239,systemOfEquationsCalculator,'x','Solution x','batch-6'],
 [240,matrixCalculator,'determinant','Result determinant','final'],
 [241,matrixDeterminantCalculator,'determinant','Determinant','batch-5'],
 [242,matrixInverseCalculator,'determinant','Input determinant','batch-6'],
 [243,rrefCalculator,'rank','Rank','batch-7'],
 [244,complexNumberCalculator,'real','Real component','batch-6'],
 [245,vectorCalculator,'dot','Dot product','batch-7'],
 [246,derivativeCalculator,'value','Estimated derivative','batch-9'],
 [247,integralCalculator,'value','Estimated definite integral','batch-9'],
 [248,limitCalculator,'value','Estimated finite limit','batch-9'],
 [249,sequenceCalculator,'nth','Term at selected position','batch-7'],
 [250,seriesCalculator,'sum','Finite series sum','batch-10'],
 [253,polynomialCalculator,'discriminant','Cubic discriminant','batch-8'],
] as const;
const geometryFollowupIds=new Set([265,266,267,268,269,270,271,272,274,279,280]);
const structuredMathIds=new Set<number>([214,...structuredMathRows.map(([id])=>id)]);
const rational214=calculatorRegistry.getById('launch-decimal-to-fraction-calculator') as CalculatorDefinition<{decimal:number;precision:number},{result:number}>;
function structuredMathProfile([catalogId,definition,primaryKey,label,source]:typeof structuredMathRows[number]){
 const engine=definition as unknown as CalculatorDefinition<Record<string,unknown>,Record<string,unknown>>;
 const expected=engine.examples[0].expected;
 const fieldOptions:Readonly<Record<string,readonly string[]>>|undefined=catalogId===248?{direction:['both','left','right']}:catalogId===240?{operation:['add','subtract','multiply']}:catalogId===244?{operation:['add','subtract','multiply','divide']}:undefined;
 const secondary=Object.fromEntries(Object.entries(expected)
  .filter(([key,value])=>key!==primaryKey&&typeof value==='number')
  .map(([key])=>[key,{label:labelForField(key),...(key==='angleRadians'||key==='argument'?{unit:'rad'}:{})}]));
 return profile(engine,{catalogId,primaryKey,unit:'dimensionless',scope:engine.formulas[0].description,registered:false,fieldOptions,textFields:(catalogId>=246&&catalogId<=248)||catalogId===250?['expression']:undefined},
  label,secondary,`src/calculators/advanced-math/catalog-${source}.ts`);
}

function oddsProfile(){
 const scope='Convert probability to odds or odds to probability. Supply one quantity. Probability 1 has no finite odds. This is a mathematical conversion.';
 const shared={catalogId:301,primaryKey:'probability',unit:'probability (0–1)',scope,registered:false} as const;
 const path='src/calculators/statistics/catalog-batch-4.ts';
 const forOdds=profile(oddsCalculator,{
  ...shared,
  validate:(input,output)=>{
   if(input.odds!==undefined&&input.odds>0&&!(output.probability>0&&output.probability<1))throw Error('Odds exceed the probability precision of this capture');
  },
 },'Probability',{odds:{label:'Odds in favor',unit:'ratio'}},path);
 const input={probability:0.75};
 const forProbability=profile({...oddsCalculator,examples:[{label:'Convert probability',input,expected:oddsCalculator.calculate(input,{})}]},
  shared,'Probability',{odds:{label:'Odds in favor',unit:'ratio'}},path);
 const fields:readonly FactoryWorkbenchField[]=[
  {key:'odds',label:'Odds in favor',kind:'number',defaultValue:'3'},
  {key:'probability',label:'Probability (0–1)',kind:'number',defaultValue:''},
 ];
 return Object.freeze({...forOdds,fields,
  execute:(raw:Parameters<typeof forOdds.execute>[0])=>{
   if(Object.keys(raw).some(key=>key!=='odds'&&key!=='probability')||Object.values(raw).some(value=>typeof value!=='string'))throw Error('Expected odds or probability text');
   const odds=raw.odds?.trim(),probability=raw.probability?.trim();
   if(Boolean(odds)===Boolean(probability))throw Error('Enter exactly one of odds or probability');
   return odds?forOdds.execute({odds}):forProbability.execute({probability:probability!});
  },
  verifyHistorical:(snapshot:CalculationSnapshot)=>(Object.hasOwn(snapshot.input,'odds')?forOdds:forProbability).verifyHistorical(snapshot),
 });
}

function integerProfile(){
 const engine=draftMaster232Calculator as CalculatorDefinition<Parameters<typeof draftMaster232Calculator.calculate>[0],Record<string,string>>;
 const options={catalogId:232,unit:'integer',scope:engine.formulas[0].description,registered:false,primaryDecimalText:true,textFields:['left','right'],
  fieldOptions:{operation:['add','subtract','multiply','divmod','gcd']}} as const;
 const path='src/calculators/core/draft-master-232.ts';
 const input={left:'-7',right:'3',operation:'divmod'} as const;
 const normal=profile(engine,{...options,primaryKey:'result'},'Exact result',{},path);
 const division=profile({...engine,examples:[{label:'Signed integer division',input,expected:engine.calculate(input,{})}]},
  {...options,primaryKey:'quotient'},'Quotient',{remainder:{label:'Remainder'}},path);
 return Object.freeze({...normal,outputs:{...normal.outputs,...division.outputs},
  execute:(raw:Parameters<typeof normal.execute>[0])=>(raw.operation==='divmod'?division:normal).execute(raw),
  verifyHistorical:(snapshot:CalculationSnapshot)=>(snapshot.input.operation==='divmod'?division:normal).verifyHistorical(snapshot),
 });
}
function scientificProfile(){
 const engine=scientificDraftCalculator;
 const operations=['sin','cos','tan','asin','acos','atan','sqrt','ln','log10','exp','pow'] as const;
 const angles=['degrees','radians'] as const;
 const examples:readonly ScientificDraftInput[]=[
  {operation:'sqrt',x:'4'},{operation:'pow',x:'2',y:'3'},
  {operation:'sin',x:'180',angleMode:'degrees'},{operation:'pow',x:'2',y:'3',angleMode:'radians'},
 ];
 const profiles=examples.map(input=>profile({...engine,examples:[{label:'Retained scientific input shape',input,expected:engine.calculate(input,{})}]},{
  catalogId:206,primaryKey:'result',unit:'operation-dependent',scope:engine.formulas[0].description,registered:false,primaryDecimalText:true,
  textFields:['x',...(input.y===undefined?[]:['y'])],
  fieldOptions:input.angleMode===undefined?{operation:operations}:{operation:operations,angleMode:angles},
 },'Decimal result',{},'src/calculators/core/draft-master-206.ts'));
 const select=(input:Readonly<Record<string,unknown>>)=>profiles[Number(Object.hasOwn(input,'y'))+2*Number(Object.hasOwn(input,'angleMode'))];
 const fields:readonly FactoryWorkbenchField[]=[
  {key:'operation',label:'Operation',kind:'select',options:operations,defaultValue:'sqrt'},
  {key:'x',label:'x (plain decimal)',kind:'text',defaultValue:'4'},
  {key:'y',label:'y (power only)',kind:'text',defaultValue:''},
  {key:'angleMode',label:'Angle unit (trigonometry)',kind:'select',options:angles,defaultValue:''},
 ];
 return Object.freeze({...profiles[0],fields,
  execute:(raw:Parameters<typeof profiles[0]['execute']>[0])=>{
   const active=Object.fromEntries(Object.entries(raw).filter(([key,value])=>!((key==='y'||key==='angleMode')&&typeof value==='string'&&value.trim()==='')));
   return select(active).execute(active);
  },
  verifyHistorical:(snapshot:CalculationSnapshot)=>select(snapshot.input).verifyHistorical(snapshot),
 });
}
const businessMetricRows=[
 [162,monthlyRecurringRevenueCalculator,'supplied currency per month','Customer-count run rate from recurring amounts only. Excludes one-time revenue and accounting recognition.'],
 [163,annualRecurringRevenueCalculator,'supplied currency per year','Annualize one supplied monthly recurring amount at a constant run rate. No seasonality, forecast or recognition model.'],
 [170,arpuCalculator,'supplied currency per user','Divide revenue by a positive whole user count for the same measurement period and population.'],
 [179,cashRunwayCalculator,'months','Divide available cash by a positive constant monthly burn in the same currency. Excludes financing changes, forecasts and cash timing.'],
] as const;
const businessMetricIds=new Set<number>(businessMetricRows.map(([id])=>id));

function businessMetricProfile([catalogId,definition,unit,scope]:typeof businessMetricRows[number]){
 const engine=definition as unknown as CalculatorDefinition<Record<string,number>,{value:number;steps:readonly string[]}>;
 return profile(engine,{catalogId,primaryKey:'value',unit,scope,registered:false,
  validate:(input,output)=>{
   if(catalogId===170&&!Number.isInteger(input.users))throw Error('Enter a whole user count');
   if(output.value===0&&Object.values(input).every(value=>value>0))throw Error('Positive metric rounds to zero at retained engine precision');
  },
 },'Result',{},`src/calculators/business/catalog-batch-${catalogId<170?1:2}.ts`);
}
const electricalHvacIds=new Set([363,364,365,366,486]);
const solarCountDecimal=Decimal.clone({precision:100});
const waterUsageEngine=calculatorRegistry.getById('launch-water-usage-calculator') as CalculatorDefinition<{rate:number;minutes:number},{result:number}>;
const currencyTravelEngine=privateOwnerEveryday.find(binding=>binding.masterId===512)!.definition as CalculatorDefinition<Record<string,unknown>,Record<string,unknown>>;
const retainedValuationIds=new Set([80,81,84,467,469,488]);
const retirementValuationRows=[
 [80,'requiredInitialCapital','Required initial corpus'],
 [81,'balance','Ending savings balance'],
 [84,'requiredInitialCapital','Inflation-adjusted initial need'],
 [96,'vestedBalance','Vested balance'],
] as const;

function retainedRetirementProfile([catalogId,primaryKey,label]:typeof retirementValuationRows[number]){
 const engine=completionContracts.find(row=>row.id===`private.completion.${catalogId}`)! as CalculatorDefinition<Record<string,unknown>,Record<string,unknown>>;
 const input=completionExamples[catalogId];
 const expected=engine.calculate(input,{});
 return profile({...engine,examples:[{label:'Retained finite-period witness',input,expected}]},{
  catalogId,primaryKey,unit:'supplied currency',scope:engine.formulas[0].description+' Private capture accepts up to 60 explicit periods.',
  registered:false,structuredFields:catalogId===96?['steps','tranches']:['steps'],fieldOptions:{timing:['begin','end']},
  textFields:Object.keys(input).filter(key=>key!=='timing'&&typeof input[key]==='string'),
  validateStructuredPrimary:requireRationalPrimary,
  validate:entered=>{if((entered.steps as unknown[]).length>60)throw Error('Up to 60 explicit periods for this capture');},
 },label,{},'src/calculators/retirement-contracts.ts');
}

const leaseEngine=privateWorkflowDefinitions.find(row=>row.id==='private.workflow.disclosed-lease')! as CalculatorDefinition<Record<string,unknown>,Record<string,unknown>>;
const leaseInput=finalPrivateExamples[469];
const heatInput=annualHeatComparison.inputSchema.parse(finalPrivateExamples[488]);
const carComparisonEngine=privateOwnerEveryday.find(binding=>binding.masterId===471)!.definition as CalculatorDefinition<Record<string,unknown>,Record<string,unknown>>;
const gradeExample=weightedGradeCalculator.goldenTests![0].input;
const fuelEconomyUnits=['km_per_l','l_per_100km','mpg_us','mpg_imp'] as const;
const fuelEconomyLabels:Readonly<Record<string,string>>={km_per_l:'km/L',l_per_100km:'L/100 km',mpg_us:'US mpg',mpg_imp:'Imperial mpg'};
const fuelEconomyInput={value:'20',fromUnit:'km_per_l',toUnit:'l_per_100km'} as const;
const fuelEconomyProfile=profile({...draftMaster435Calculator,examples:[{label:'Reciprocal economy witness',input:fuelEconomyInput,expected:draftMaster435Calculator.calculate(fuelEconomyInput,{})}]},{
 catalogId:435,primaryKey:'result',unit:'selected fuel-economy unit',registered:false,textFields:['value'],primaryDecimalText:true,
 fieldOptions:{fromUnit:fuelEconomyUnits,toUnit:fuelEconomyUnits},scope:draftMaster435Calculator.formulas[0].description,
},'Converted fuel economy',{},'src/calculators/conversion/draft-master-435.ts');
const ingredientDensityProfile=profile(ingredientWeightVolumeDraftCalculator,{
 catalogId:498,primaryKey:'convertedValue',unit:'g or mL by direction',registered:false,
 fieldOptions:{direction:['massToVolume','volumeToMass']},
 fieldUnits:{value:'g for mass to volume, mL for volume to mass',densityGPerMl:'g/mL'},
 scope:'Conversion with a positive supplied density for the stated ingredient preparation and temperature. No assumed density or universal kitchen conversion.',
},'Converted quantity',{},'src/calculators/food/draft-master-498.ts');
const retainedPolicyRows=[
 [126,'nz-gst-prices','gst','GST from supplied classifications','NZD','lines'],
 [133,'assessment-levies','totalTax','Total supplied assessment levy','supplied currency','levies'],
 [516,'stanford-transcript-gpa','gpa','Exact transcript GPA','grade points per graded unit','rows'],
] as const;
const retainedPolicyIds=new Set<number>(retainedPolicyRows.map(([id])=>id));

function retainedPolicyProfile([catalogId,name,primaryKey,label,unit,rows]:typeof retainedPolicyRows[number]){
 const engine=sourceBoundProfiles.find(row=>row.id===`private.profile.${name}`)! as CalculatorDefinition<Record<string,unknown>,Record<string,unknown>>;
 const input=finalPrivateExamples[catalogId];
 return profile({...engine,examples:[{label:'Retained source-snapshot witness',input,expected:engine.calculate(input,{})}]},{
  catalogId,primaryKey,unit,scope:engine.formulas[0].description,registered:false,
  structuredFields:[rows],textFields:Object.keys(input).filter(key=>typeof input[key]==='string'),
  validateStructuredPrimary:value=>{if(catalogId!==516||value!==null)requireRationalPrimary(value);},
 },label,{},'src/calculators/source-bound-profiles.ts');
}

export const mobilityContracts=Object.freeze([
 profile(rational214,{
  catalogId:214,primaryKey:'result',unit:'dimensionless',registered:false,
  scope:'Reduced fraction after the retained decimal rounding rule at the chosen precision (0–12 places). New captures require a safe scaled integer. Saved v1 numeric snapshots retain their original replay domain.',
  validate:input=>{
   const scaled=Math.round((input.decimal+Number.EPSILON)*10**input.precision);
   if(!Number.isSafeInteger(scaled))throw Error('Scaled numerator exceeds the exact fraction range');
  },
 },'Reduced fraction',{},'src/calculators/launch-portfolio.ts'),
 profile(functionPlotter3dCalculator,{
  catalogId:252,primaryKey:'maximum',unit:'z coordinate',registered:false,textFields:['expression'],
  scope:'Sample the retained 17 × 17 grid of the supplied surface. Undefined points are omitted. Extrema refer to retained samples.',
 },'Sampled maximum',{minimum:{label:'Sampled minimum',unit:'z coordinate'}},'src/calculators/advanced-math/catalog-final.ts'),
 oddsProfile(),
 Object.freeze({...ingredientDensityProfile,outputUnit:(input:Record<string,unknown>)=>input.direction==='massToVolume'?'mL':'g'}),
 profile(electricalLoadCalculator,{
  catalogId:362,primaryKey:'value',unit:'VA',registered:false,fieldUnits:{voltageVolts:'V',currentAmps:'A'},
  scope:'Apparent load from supplied voltage and current magnitudes. Power factor, real power, circuit loading limits and equipment selection are outside this model.',
 },'Apparent load',{},'src/calculators/engineering-construction/catalog-batch-3.ts'),
 profile(voltageDropCalculator,{
  catalogId:363,primaryKey:'value',unit:'V',registered:false,
  fieldUnits:{currentAmps:'A',oneWayLengthMeters:'m',resistanceOhmsPerMeter:'Ω/m',conductors:'1 or 2'},
  scope:'Resistive voltage drop from supplied current, one-way length, resistance per metre and one or two path conductors. Excludes reactance, ampacity and code compliance.',
 },'Voltage drop',{},'src/calculators/engineering-construction/catalog-batch-3.ts'),
 profile(resistorCalculator,{
  catalogId:364,primaryKey:'value',unit:'Ω',registered:false,fieldUnits:{voltageVolts:'V',currentAmps:'A'},
  scope:'Ohmic resistance from supplied positive voltage and current. Component power, tolerance and suitability require separate assessment.',
 },'Resistance',{},'src/calculators/engineering-construction/catalog-batch-3.ts'),
 profile(hvacBtuCalculator,{
  catalogId:365,primaryKey:'value',unit:'BTU/h',registered:false,
  fieldUnits:{floorAreaSquareMeters:'m²',ceilingHeightMeters:'m',btuPerCubicMeter:'BTU/h per m³'},
  scope:'Multiply room volume by a supplied volumetric load factor. This estimate has no climate, envelope, occupancy or equipment-sizing model.',
 },'Supplied-factor load',{},'src/calculators/engineering-construction/catalog-batch-3.ts'),
 profile(solarPanelRequirementCalculator,{
  catalogId:366,primaryKey:'value',unit:'panels',registered:false,
  fieldUnits:{dailyEnergyKwh:'kWh/day',panelWatts:'W',peakSunHours:'h/day',systemEfficiencyPercent:'%'},
  scope:'Whole-panel count for supplied daily demand, rating, peak sun hours and efficiency. Uses a constant daily model. Estimates carry no installation or site-specific generation approval.',
  validate:(input,output)=>{
   const target=new solarCountDecimal(input.dailyEnergyKwh).times(1000);
   const production=new solarCountDecimal(input.panelWatts).times(input.peakSunHours).times(input.systemEfficiencyPercent).div(100);
   if(!Number.isSafeInteger(output.value)||output.value<1||production.times(output.value).lt(target)||production.times(output.value-1).gte(target)){
    throw Error('Whole-panel count cannot be verified at this input precision');
   }
  },
 },'Whole panel count',{},'src/calculators/engineering-construction/catalog-batch-3.ts'),
 profile(waterUsageEngine,{
  catalogId:486,primaryKey:'result',unit:'supplied volume unit',registered:false,
  fieldUnits:{rate:'supplied volume unit per minute',minutes:'min'},
  scope:'Constant flow multiplied by elapsed minutes. The output uses the volume unit of the supplied rate.',
 },'Water use',{},'src/calculators/launch-portfolio.ts'),
 profile(currencyTravelEngine,{
  catalogId:512,primaryKey:'total',unit:'reporting currency',registered:false,textFields:['reportingCurrency'],structuredFields:['lines'],
  scope:'Sum dated spending lines in a supplied reporting currency using manually supplied rates and their explicit direction. Excludes live rates, fees and execution guarantees.',
 },'Converted spending',{},'src/calculators/private-owner-everyday.ts'),
 Object.freeze({...fuelEconomyProfile,
  fields:fuelEconomyProfile.fields.map(field=>field.kind==='select'?{...field,optionLabels:fuelEconomyLabels}:field),
  outputUnit:(input:Record<string,unknown>)=>fuelEconomyLabels[String(input.toUnit)],
 }),
 profile(airDensityCalculator,{
  catalogId:493,primaryKey:'value',unit:'kg/m³',registered:false,fieldUnits:{pressurePa:'Pa absolute',temperatureC:'°C'},
  scope:'Ideal dry-air density from supplied local absolute pressure and temperature. Humidity, atmospheric profiling and aviation or equipment safety assessments are outside this model.',
 },'Dry air density',{},'src/calculators/earth-science/catalog-batch-2.ts'),
 profile(carComparisonEngine,{
  catalogId:471,primaryKey:'difference',unit:'supplied currency',registered:false,structuredObjectFields:['new','used'],
  scope:carComparisonEngine.formulas[0].description,
 },'New minus used cost',{newCost:{label:'New vehicle net cost'},usedCost:{label:'Used vehicle net cost'}},'src/calculators/private-owner-everyday.ts'),
 profile({...weightedGradeCalculator,examples:[{label:'Retained score and weight witness',input:gradeExample,expected:weightedGradeCalculator.calculate(gradeExample,{})}]},{
  catalogId:517,primaryKey:'average',unit:'supplied score scale',registered:false,
  fieldOptions:{mode:['weighted','unweighted'],missingPolicy:['reject','exclude']},structuredFields:['assessments'],structuredObjectFields:['scale'],
  scope:weightedGradeCalculator.formulas[0].description,
 },'Grade average',{usedCount:{label:'Scores contributing to average'},excludedCount:{label:'Missing scores excluded'},zeroWeightCount:{label:'Scores with zero weight'}},'src/calculators/travel/draft-master-517.ts'),
 profile(sipCalculator,{
  catalogId:52,primaryKey:'futureValue',unit:'supplied currency',registered:false,
  fieldOptions:{contributionTiming:['beginning','end']},fieldUnits:{annualReturnPercent:'% nominal annual',termMonths:'months'},
  scope:'Equal supplied monthly contributions, an explicit beginning or end timing, and a constant nominal return divided into monthly periods. Retained two-decimal rounding; excludes tax, fees and return forecasts.',
 },'Projected value',{investedAmount:{label:'Contributions',unit:'supplied currency'},estimatedGain:{label:'Estimated gain',unit:'supplied currency'}},'src/calculators/finance/sip.ts'),
 profile(swpCalculator,{
  catalogId:54,primaryKey:'endingCorpus',unit:'supplied currency',registered:false,
  fieldOptions:{withdrawalTiming:['beginning','end']},fieldUnits:{annualReturnPercent:'% nominal annual',termMonths:'months'},
  scope:'Trace an equal supplied monthly withdrawal under the selected payment timing and a constant nominal return divided into monthly periods. Contributions, fees, taxes and investment guarantees are outside this model.',
 },'Ending corpus',{totalWithdrawn:{label:'Total withdrawals',unit:'supplied currency'},depletionMonth:{label:'First depletion month',unit:'months'}},'src/calculators/finance/swp.ts'),
 profile(termDepositCalculator,{
  catalogId:55,primaryKey:'maturityValue',unit:'supplied currency',registered:false,
  fieldUnits:{annualRatePercent:'% nominal annual',termMonths:'months',compoundingPerYear:'periods per year'},
  scope:'One supplied principal under the entered fixed nominal rate and compounding frequency. Uses the retained maturity and annual yield rounding. Excludes tax, fees and early redemption.',
 },'Maturity value',{interestEarned:{label:'Interest earned',unit:'supplied currency'},effectiveAnnualYieldPercent:{label:'Effective annual yield',unit:'%'}},'src/calculators/finance/term-deposit.ts'),
 ...retainedPolicyRows.map(retainedPolicyProfile),
 ...retirementValuationRows.map(retainedRetirementProfile),
 profile({...leaseEngine,examples:[{label:'Retained disclosed-payment witness',input:leaseInput,expected:leaseEngine.calculate(leaseInput,{})}]},{
  catalogId:469,primaryKey:'totalPayment',unit:'supplied currency per payment',registered:false,textFields:['currency','period'],
  scope:leaseEngine.formulas[0].description,
 },'Payment including supplied recurring charges',{},'src/calculators/private-scenario-workflows.ts'),
 profile({...annualHeatComparison,examples:[{label:'Retained annual heat witness',input:heatInput,expected:annualHeatComparison.calculate(heatInput,{})}]},{
  catalogId:488,primaryKey:'annualSavings',unit:'supplied currency per year',registered:false,validateStructuredPrimary:requireRationalPrimary,
  textFields:Object.keys(heatInput),scope:annualHeatComparison.formulas[0].description,
  fieldUnits:{usefulHeatKwh:'kWh/year',outsideAuxiliaryKwh:'kWh/year',existingEfficiency:'fraction',fuelTariff:'currency/kWh',electricityTariff:'currency/kWh',incrementalInstalledCost:'currency'},
 },'Annual cost difference',{},'src/calculators/annual-heat-comparison.ts'),
 ...businessMetricRows.map(businessMetricProfile),
 scientificProfile(),
 integerProfile(),
 profile(draftMaster233Calculator,{
  catalogId:233,primaryKey:'finalState',unit:'',registered:false,primaryDecimalText:true,textFields:['seed','stream'],
  scope:draftMaster233Calculator.formulas[0].description,
 },'Final generator state',{},'src/calculators/core/draft-master-233.ts'),
 ...structuredMathRows.map(structuredMathProfile),
 ...Array.from(geometryFollowupIds,retainedNumericProfile),
 ...Array.from(statisticsFollowupIds,retainedNumericProfile),
 retainedNumericProfile(254),
 profile(meanMedianModeRangeCalculator,{
  catalogId:281,primaryKey:'mean',unit:'supplied observation unit',registered:false,numberLists:['values'],
  scope:'Describe a supplied numeric sample in a common unit. Reports the mean, median, range and all tied modes. If no value repeats, the result has no mode.',
 },'Mean',{median:{label:'Median'},range:{label:'Range'},minimum:{label:'Minimum'},maximum:{label:'Maximum'},count:{label:'Observation count'}},'src/calculators/statistics/catalog-batch-1.ts'),
 ...Array.from(chemistryIds).filter(id=>id!==330).map(retainedNumericProfile),
 profile(molecularWeightCalculator,{
  catalogId:330,primaryKey:'value',unit:'g/mol',registered:false,textFields:['formula'],
  scope:'Formula mass using the retained v1 element weight table and supported formula syntax. Use standard element symbols, integer subscripts, parentheses and square brackets. Isotope-specific masses and hydrate notation are outside this contract.',
 },'Formula mass',{},'src/calculators/chemistry/molecular-weight.ts'),

 ...ownerModes.map(modeSpecificProfile),
 profile({...sunEventsEngine,examples:[{label:'Equatorial equinox fixed-offset witness',input:sunExample,expected:sunEventsEngine.calculate(sunExample,{})}]},{
  catalogId:535,primaryKey:'status',unit:'fixed-offset civil day',registered:false,
  primaryChoices:['events','polar-day','polar-night','grazing'],textFields:['date'],
  fieldUnits:{latitude:'degrees',longitude:'degrees',utcOffsetMinutes:'minutes'},
  scope:'Approximate solar-center horizon crossings within the supplied fixed-offset date. Polar and unresolved grazing conditions do not imply an event timestamp.',
 },'Solar event status',{},'src/calculators/private-scientific-definitions.ts'),

 ...Array.from(mathCaptureIds,retainedNumericProfile),
 profile(basicDraftCalculator,{
  catalogId:205,primaryKey:'result',unit:'dimensionless',registered:false,primaryDecimalText:true,
  scope:'Four arithmetic operations on two plain decimal operands. Exact decimal presentation follows the retained engine precision.',
  textFields:['left','right'],fieldOptions:{operation:['add','subtract','multiply','divide']},
 },'Decimal result',{},'src/calculators/core/draft-master-205.ts'),
 profile({...draftMaster441Calculator,examples:[{label:'CSS reference pixel conversion',input:densityExample,expected:{result:'1'}}]},{
  catalogId:441,primaryKey:'result',unit:'selected resolution unit',registered:false,primaryDecimalText:true,
  scope:'CSS resolution density only. Uses rational conversion factors and 34 significant digits with half-even rounding. Excludes physical device and print size estimates.',
  textFields:['value'],fieldOptions:{fromUnit:densityUnits,toUnit:densityUnits},
 },'Converted resolution',{},'src/calculators/conversion/draft-master-441.ts'),

 profile(evChargingEnergyDraftCalculator,{
  catalogId:484,primaryKey:'wallEnergyKwh',unit:'kWh',registered:false,
  scope:'Supplied battery-side energy divided by the entered charging efficiency fraction. Includes the implied energy loss. Excludes tariffs, charge curves and vehicle-specific predictions.',
  fieldUnits:{batteryEnergyAddedKwh:'kWh',chargingEfficiency:'fraction'},
 },'Estimated wall energy',{lossKwh:{label:'Estimated charging loss',unit:'kWh'}},'src/calculators/energy/draft-master-484.ts'),
 profile({...sleepDurationCalculator,examples:[{label:'Overnight interval with awake time',input:overnightExample,
  expected:sleepDurationCalculator.calculate(overnightExample,{})}]},{
  catalogId:518,primaryKey:'estimatedSleepMinutes',unit:'minutes',registered:false,
  scope:'Explicit-offset minute timestamps. Subtract entered awake minutes from interval length. The estimate excludes clinical interpretation and named timezone rules.',
  textFields:['sleepStart','wakeEnd'],fieldUnits:{awakeMinutes:'minutes'},
 },'Estimated sleep duration',{elapsedMinutes:{label:'Elapsed interval',unit:'minutes'}},'src/calculators/travel/draft-master-518.ts'),
 profile(powerWeightRatioDraftCalculator,{
  catalogId:529,primaryKey:'wattsPerKg',unit:'W/kg',registered:false,
  scope:'Supplied power in watts divided by the selected physical mass in kilograms. Choose the mass basis before entry and use the same basis across comparisons. Excludes performance benchmarks.',
  fieldUnits:{powerWatts:'W',massKg:'kg'},
 },'Power per supplied mass',{},'src/calculators/sports/draft-master-529.ts'),
 profile({...planetaryWeightCalculator,examples:[{label:'Standard Earth gravity convention',input:gravityExample,
  expected:planetaryWeightCalculator.calculate(gravityExample,{})}]},{
  catalogId:531,primaryKey:'weightNewtons',unit:'N',registered:false,
  scope:'Spherical reference gravity, excluding rotation, oblateness and site variation. Standard Earth gravity is a separate convention. Physical mass is unchanged.',
  fieldOptions:{massUnit:['kg','lb'],body:['earth','mars','jupiter','moon','standard-earth'],referenceVersion:[GRAVITY_REFERENCE_VERSION]},
 },'Reference-model weight force',{
  bodyMassKg:{label:'Physical mass',unit:'kg'},referenceGravityMps2:{label:'Reference gravitational acceleration',unit:'m/s²'},
  earthEquivalentKg:{label:'Earth-equivalent indicated mass',unit:'kg equivalent'},
 },'src/calculators/astronomy/draft-master-531.ts'),

 profile(rainwaterHarvestingDraftCalculator,{
  catalogId:487,primaryKey:'collectedLiters',unit:'L',registered:false,
  scope:'Single supplied rainfall depth and catchment area with a supplied collection fraction from 0 to 1. Excludes tank sizing, rainfall time series and safe drinking-water claims.',
  fieldUnits:{rainfallMm:'mm',catchmentAreaM2:'m²',collectionEfficiency:'fraction'},
 },'Estimated collected water',{
  theoreticalVolumeM3:{label:'Rainfall volume before losses',unit:'m³'},
  collectedVolumeM3:{label:'Estimated collected water',unit:'m³'},
 },'src/calculators/energy/draft-master-487.ts'),

 ...batch44Profiles.map(([id,key,unit,label])=>batch44Profile(
  privateCatalogAdapters.find(binding=>binding.masterId===id)!.definition,id,key,unit,label,
  id===65?'private-cashflow-rate':'private-catalog-adapters')),
 ...batch44OwnerProfiles.map(([id,key,unit,label,bindings,source])=>batch44Profile(
  bindings.find(binding=>binding.masterId===id)!.definition,id,key,unit,label,source)),
 batch44Profile(componentContracts.find(engine=>engine.id==='private.component.31')!,31,'value',
  'supplied currency','Down payment amount','component-contracts',componentExamples[31]),

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
 profile({...(remainingContracts.find(engine=>engine.id==='private.remaining.494')! as CalculatorDefinition<Record<string,unknown>,Record<string,unknown>>),examples:[{
  label:'Standard sea-level reference',input:{...remainingExamples[494]},expected:{value:101325,unit:'Pa',pressurePa:101325},
 }]},{catalogId:494,primaryKey:'value',unit:'Pa',registered:false,
  fieldUnits:{seaLevelPressurePa:'Pa',altitudeM:'m'},fieldOptions:{scope:['supplied-mathematical-scenario']},
  scope:'Lower standard atmosphere with supplied sea-level pressure and altitude from −1,000 through 11,000 metres. The v1 result uses six decimal places in pascals. Excludes local weather, humidity, navigation and safety applications.',
 },'Estimated atmospheric pressure'),
 ...batch39ComponentIds.map(id=>suppliedProfile(id,'component')),
 ...batch39RemainingIds.map(id=>suppliedProfile(id,'remaining')),
 ...batch39BusinessIds.map(id=>suppliedProfile(id,'business')),
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
 const capture=retainedPolicyIds.has(id)?'private.worker2.retained-policy.20261124.1':id===96||id===362||id===498?'private.worker2.bounded-evidence-recovery.20261124.1':id===435||id===493?'private.worker2.units-dry-air.20261124.1':id===471||id===517?'private.worker2.structured-intake.20261124.1':id===52||id===54||id===55?'private.worker2.investment-delivery.20261124.1':retainedValuationIds.has(id)?'private.worker2.valuation-energy.20261124.1':id===512?'private.worker2.currency-travel.20261124.1':electricalHvacIds.has(id)?'private.worker2.electrical-hvac-usage.20261124.1':businessMetricIds.has(id)?'private.worker2.business-metrics.20261124.1':id===206?'private.worker2.scientific.20261124.1':id===232||id===233?'private.worker2.exact-integers.20261124.1':id===252||id===301?'private.worker2.surface-odds.20261124.1':id===254||id===281?'private.worker2.remaining-mathematics.20261124.1':statisticsFollowupIds.has(id)?'private.worker2.statistics-followup.20261124.1':chemistryIds.has(id)?'private.worker2.chemistry.20261124.1':geometryFollowupIds.has(id)?'private.worker2.geometry-followup.20261124.1':structuredMathIds.has(id)?'private.worker2.structured-math.20261124.1':carryoverIds.has(id)?'private.worker2.carryover-modes.20261124.1':mathCaptureIds.has(id)?'private.worker2.math-capture.20261124.1':batch41Ids.has(id)?'private.worker2.batch41.20261124.1':id===487?'private.worker2.rainwater-capture.20261124.1':batch44Ids.has(id)?'private.worker2.batch44.20261124.1':id===494?'private.worker2.altitude-pressure.20261124.1':batch39Ids.has(id)?'private.worker2.batch39.20261124.1':id===63||id===67?'private.worker2.investment-horizon-average.20261124.1':batch35Ids.has(id)?'private.worker2.batch35.20261124.1':id===66||id===111?'private.worker2.annualized-inputs.20261124.1':supplementalSources[id]?'private.worker2.batch27.20261124.1':marginSources[id]?'private.worker2.supplied-margins.20261124.1':batch20Sources[id]?'private.worker2.batch20.20261124.1':nextSources[id]?'private.worker2.next-quantity.20261124.1':familySources[id]?'private.worker2.math-borrower-health.20261124.1':agricultureSources[id]?'private.worker2.agricultural-quantity.20261124.1':financeSources[id]?'private.worker2.finance-business.20261124.1':additions[id]?'private.worker2.astronomy-mobility.20261124.1':id===509?'private.worker2.fuel-trip.20261124.1':'private.worker2.energy-mobility.20261119.1';
 const identity={catalogId:id,engineId:contract.engineId,calculatorSlug:contract.slug,calculatorVersion:contract.version,
  sourceVersion:`${capture}/${contract.engineId}@${contract.version}`};
 return createFactoryWorkflows({identity,execute:contract.execute,scopedMetadata:{
  schemaVersion:1,identity,scope:contract.scope,primaryKey:contract.primaryKey,
  ...(id===206||id===232||id===301||ownerModes.some(([catalogId])=>catalogId===id)?{modeDependent:true as const}:{}),fields:contract.fields,
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
 const raw=Object.fromEntries(Object.entries(snapshot.input).map(([key,value])=>[key,value!==null&&typeof value==='object'?JSON.stringify(value):Object.is(value,-0)?'-0':String(value)]));
 try{return {...result,currentCaptureAvailable:sameRecordedJson(mobilityWorkflows(result.catalogId).execute(raw).snapshot,result.snapshot)};}
 catch{return {...result,currentCaptureAvailable:false};}
}
