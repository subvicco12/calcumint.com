import {describe,it,expect} from 'vitest';
import {runCalculator} from './engine';
import {calculatorRegistry} from './registry';
import {solvePrivateCashflowRate} from './private-cashflow-rate';
const native=(slug:string,input:unknown)=>runCalculator(calculatorRegistry.getBySlug(slug)!,input).output;
describe('independent underlying remaining-component witnesses',()=>{
 it('monthly savings apply deposits after growth, not before',()=>{
  expect(native('savings-goal-calculator',{currentSavings:100,targetAmount:142,annualReturnPercent:120,months:2,monthlyContribution:10})).toMatchObject({futureValue:142,requiredMonthlyContribution:10,targetReached:true});
 });
 it('holding return includes supplied costs/income in their declared bases',()=>{
  expect(native('roi-calculator',{initialInvestment:100,additionalCosts:20,finalValue:132,incomeReceived:12,holdingMonths:24})).toMatchObject({netGain:24,totalInvested:120,roiPercent:20,annualizedReturnPercent:9.544512});
 });
 it('Fisher real return divides growth factors rather than subtracting rates',()=>{
  expect(native('investment-growth-calculator',{presentValue:80,annualReturnPercent:50,years:2,inflationPercent:25})).toMatchObject({futureValue:180,inflationAdjustedFutureValue:115.2,realAnnualReturnPercent:20});
 });
 it('periodic yield returns the caller-selected root among multiple roots',()=>{
  expect(solvePrivateCashflowRate([-100,230,-132],5,15).periodRatePercent).toBeCloseTo(10,8);
  expect(solvePrivateCashflowRate([-100,230,-132],15,25).periodRatePercent).toBeCloseTo(20,8);
  expect(solvePrivateCashflowRate([-100,0,121],0,20).periodRatePercent).toBeCloseTo(10,8);
 });
 it('inflation preserves deflation and zero horizon',()=>{
  expect(native('inflation-calculator',{amount:80,annualInflationPercent:-20,years:1})).toMatchObject({futureEquivalentCost:64,futurePurchasingPower:100,cumulativeInflationPercent:-20,purchasingPowerLossPercent:-25});
  expect(native('inflation-calculator',{amount:80,annualInflationPercent:20,years:0})).toMatchObject({futureEquivalentCost:80,futurePurchasingPower:80});
 });
});

import {remainingContracts,remainingExamples,exportRemainingContract,importRemainingContract} from './remaining-contracts';
const calc=(id:number,p:Record<string,unknown>)=>exportRemainingContract(id,{scope:'supplied-mathematical-scenario',...(id<400||[465,466,473,477,480].includes(id)?{currency:'USD'}:{}),...p}).calculation.output;
const cash={income:[{name:'rent',amount:150}],expenses:[{name:'upkeep',amount:40},{name:'debt service',amount:20}],period:'month'};
const fv={presentValue:80,annualReturnPercent:50,years:2,inflationPercent:25};
const roi={initialInvestment:100,additionalCosts:20,finalValue:132,incomeReceived:12,holdingMonths:24};
const savings={currentSavings:100,targetAmount:142,annualReturnPercent:120,months:2,timing:'end'};
const growth={beginningValue:80,endingValue:180,years:2};
const cases:readonly [number,Record<string,unknown>,number][]=[
 [25,{balance:210,annualAprPercent:120,firstPaymentDate:'2028-01-30',targetPaymentDate:'2028-02-29',monthRule:'clamp-original-day'},121],
 [37,cash,90],[45,fv,180],[47,roi,20],[57,fv,180],
 [58,{...savings,monthlyContribution:10},142],[59,fv,180],
 [60,{futureValue:180,annualReturnPercent:50,years:2},80],[61,savings,10],[62,growth,50],
 [63,{beginningValue:80,targetValue:180,annualReturnPercent:50},2],[66,growth,50],
 [67,{returns:[30,-10,40]},20],
 [68,{nominalReturnPercent:50,inflationPercent:25},20],[69,{nominalReturnPercent:50,inflationPercent:25},20],
 [70,{purchases:[{name:'first',unitPrice:8,units:3},{name:'second',unitPrice:20,units:1}]},11],
 [71,{lumpSum:100,monthlyContribution:10,annualReturnPercent:120,termMonths:2,contributionTiming:'end'},100],
 [72,{cashFlows:[-100,0,121],lowerRatePercent:0,upperRatePercent:20,period:'year'},10],
 [73,{cashFlows:[10,110],periodYieldPercent:10,period:'year'},100],
 [74,{dividendPerShare:3,sharePrice:80},3.75],[75,growth,50],[76,roi,20],[77,roi,20],
 [78,{netCost:90,annualSavings:12},7.5],[79,{constant72:72,annualGrowthPercent:9},8],
 [83,savings,10],[93,{requiredIncome:80,suppliedIncome:100,period:'month'},-20],
 [94,{retirementIncome:30,priorIncome:80},37.5],[100,cash,90],
 [101,{suppliedNetIncome:80,period:'month'},16],[102,{savings:30,income:80},37.5],
 [106,savings,10],[107,cash,90],[108,cash,90],
 [110,{annualSalary:720,annualWorkHours:90},8],[111,{hourlyPay:8,annualWorkHours:90},720],
 [113,{previousPay:80,newPay:60},-25],
 [114,{amount:80,annualInflationPercent:-20,years:1},100],[115,{amount:80,annualInflationPercent:-20,years:1},64],
 [116,{bill:80,tipPercent:12.5,people:3},10],[117,{price:80,discountPercent:12.5},10],
 [118,{price:80,discountPercent:12.5},70],[119,{eligibleSales:80,commissionPercent:12.5},10],
 [465,{distanceKm:200,batteryEnergyAddedKwh:40,electricityRatePerKwh:0.3,chargingEfficiencyPercent:80,fuelConsumptionLitersPer100Km:6,fuelPricePerLiter:2},9],
 [466,{purchasePrice:100,resaleValue:180,operatingCosts:[{name:'energy',amount:40}],years:2,ownershipBasis:'cash-purchase-excludes-financing'},-40],
 [473,{distanceKm:200,baselineLitersPer100Km:6,alternativeLitersPer100Km:8,baselineFuelPrice:2,alternativeFuelPrice:2},-8],
 [477,{energyKwh:75,tariffPerKwh:0.4},30],[480,{netCost:90,annualSavings:12},7.5],
 [494,{seaLevelPressurePa:80000,altitudeM:1000},70959.435817],
 [528,{weightKg:80,met:4,minutes:20,metBasis:'caller-supplied-gross-MET'},112],
 [537,{seaLevelPressurePa:80000,altitudeM:1000},70959.435817],
];
describe('all51 independent supplied remaining-contract goldens',()=>{
 it('covers every distinct selected contract, without treating aliases as canonical mappings',()=>{
  expect(cases.map(([id])=>id)).toEqual(remainingContracts.map(d=>Number(d.id.split('.').at(-1))));
  expect(new Set(cases.map(([id])=>id)).size).toBe(51);
 });
 it.each(cases)('%i executes an independently derived literal numerical witness',(id,p,value)=>expect(calc(id,p).value).toBeCloseTo(value,7));
 it('calendar dates are inclusive and distinguish EOM from original-day clamping',()=>{
  expect(calc(25,{balance:210,annualAprPercent:120,firstPaymentDate:'2028-01-30',targetPaymentDate:'2028-02-29',monthRule:'clamp-original-day'})).toMatchObject({details:{targetMonths:2,paymentDates:['2028-01-30','2028-02-29'],payoffDate:'2028-02-29',totalPaid:242,totalInterest:32}});
  expect(calc(25,{balance:110,annualAprPercent:0,firstPaymentDate:'2028-02-29',targetPaymentDate:'2028-03-31',monthRule:'end-of-month'})).toMatchObject({value:55,details:{paymentDates:['2028-02-29','2028-03-31']}});
  expect(calc(25,{balance:110,annualAprPercent:0,firstPaymentDate:'2028-02-29',targetPaymentDate:'2028-02-29',monthRule:'end-of-month'})).toMatchObject({value:110,details:{targetMonths:1}});
  expect(()=>calc(25,{balance:110,annualAprPercent:0,firstPaymentDate:'2028-02-29',targetPaymentDate:'2028-03-31',monthRule:'clamp-original-day'})).toThrow();
 });
 it('lump/SIP timing and unequal contributed capitals remain visible',()=>{
  const p={lumpSum:100,monthlyContribution:10,annualReturnPercent:120,termMonths:2,contributionTiming:'beginning'};
  expect(calc(71,p)).toMatchObject({value:97.9,details:{lumpFutureValue:121,sipFutureValue:23.1,lumpContributed:100,sipContributed:20}});
 });
 it('losses and absence of future equality remain distinct from zero',()=>{
  expect(calc(63,{beginningValue:100,targetValue:80,annualReturnPercent:10})).toMatchObject({value:null,details:{status:'no-future-equality'}});
  expect(calc(63,{beginningValue:100,targetValue:80,annualReturnPercent:-20})).toMatchObject({value:1});
  expect(calc(63,{beginningValue:100,targetValue:100,annualReturnPercent:0})).toMatchObject({value:0,details:{status:'already-equal'}});
  expect(calc(76,{...roi,finalValue:0,incomeReceived:0})).toMatchObject({value:-100,details:{annualizedReturnPercent:null}});
 });
 it('DCA is units-weighted and does not average trade prices equally',()=>expect(calc(70,{purchases:[{name:'a',unitPrice:8,units:3},{name:'b',unitPrice:20,units:1}]})).toMatchObject({details:{averageUnitCost:11,totalUnits:4,totalCost:44}}));
 it('cash ownership remains disjoint and retains negative costs rather than clipping profits',()=>{
  expect(calc(466,{purchasePrice:100,resaleValue:180,operatingCosts:[{name:'energy',amount:40}],years:2,ownershipBasis:'cash-purchase-excludes-financing'})).toMatchObject({value:-40,details:{costPerYear:-20}});
  expect(()=>calc(466,{purchasePrice:100,resaleValue:0,operatingCosts:[{name:'loan payments',amount:40}],years:2,ownershipBasis:'cash-purchase-excludes-financing'})).toThrow();
 });
 it('source/domain decisions cannot be introduced as extra policy fields',()=>{
  expect(()=>calc(528,{weightKg:80,met:4,minutes:20,metBasis:'caller-supplied-gross-MET',activity:'clinically-approved'})).toThrow();
  expect(()=>calc(72,{cashFlows:[-100,110],lowerRatePercent:20,upperRatePercent:30,period:'year'})).toThrow();
  expect(()=>calc(74,{dividendPerShare:1,sharePrice:0})).toThrow();
  expect(()=>calc(58,{...savings,annualReturnPercent:1e-20,monthlyContribution:10})).toThrow();
 });
 it('complete exports are deeply detached, and cross-profile method/output replay fails',()=>{
  const s=exportRemainingContract(57,remainingExamples[57]);
  expect(Object.isFrozen(s.methodology.formulas[0])).toBe(true);
  expect(Object.isFrozen(s.calculation.output.details)).toBe(true);
  const swapped=JSON.parse(JSON.stringify(s));swapped.masterId=59;
  expect(()=>importRemainingContract(swapped)).toThrow();
 });
});

it.each([
 [477,{energyKwh:1e-200,tariffPerKwh:1e-200}],
 [74,{dividendPerShare:Number.MIN_VALUE,sharePrice:1e12}],
 [119,{eligibleSales:Number.MIN_VALUE,commissionPercent:1}],
] as const)('%i rejects a nonzero raw result lost to binary underflow',(id,input)=>expect(()=>calc(id,input)).toThrow());
it('actual zero remains valid for cost, yield and commission',()=>{
 expect(calc(477,{energyKwh:0,tariffPerKwh:1}).value).toBe(0);
 expect(calc(74,{dividendPerShare:0,sharePrice:10}).value).toBe(0);
 expect(calc(119,{eligibleSales:0,commissionPercent:1}).value).toBe(0);
});
