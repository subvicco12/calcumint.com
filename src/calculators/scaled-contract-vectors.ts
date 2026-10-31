import {copyCalculationData} from '../lib/calculation-snapshot';
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
// Second witnesses use identities/zero boundaries or independently known loss cases.
const boundary:Record<number,[Record<string,unknown>,number|null]>={
25:[{balance:110,annualAprPercent:0,firstPaymentDate:'2028-02-29',targetPaymentDate:'2028-02-29',monthRule:'end-of-month'},110],
37:[{income:[],expenses:[],period:'month'},0],
45:[{presentValue:100,annualReturnPercent:0,years:1,inflationPercent:0},100],
47:[{initialInvestment:100,additionalCosts:0,finalValue:0,incomeReceived:0,holdingMonths:12},-100],
58:[{currentSavings:0,targetAmount:300,annualReturnPercent:0,months:3,timing:'end',monthlyContribution:100},300],
60:[{futureValue:0,annualReturnPercent:0,years:1},0],
61:[{currentSavings:0,targetAmount:300,annualReturnPercent:0,months:3,timing:'end'},100],
62:[{beginningValue:100,endingValue:100,years:1},0],
63:[{beginningValue:100,targetValue:100,annualReturnPercent:0},0],
67:[{returns:[0]},0],68:[{nominalReturnPercent:0,inflationPercent:0},0],
70:[{purchases:[{name:'one',unitPrice:10,units:1}]},10],
71:[{lumpSum:100,monthlyContribution:100,annualReturnPercent:0,termMonths:1,contributionTiming:'end'},0],
72:[{cashFlows:[-100,100],lowerRatePercent:0,upperRatePercent:20,period:'year'},0],
73:[{cashFlows:[100],periodYieldPercent:0,period:'year'},100],
74:[{dividendPerShare:0,sharePrice:10},0],78:[{netCost:0,annualSavings:10},0],79:[{constant72:72,annualGrowthPercent:72},1],
93:[{requiredIncome:0,suppliedIncome:0,period:'month'},0],94:[{retirementIncome:0,priorIncome:100},0],
101:[{suppliedNetIncome:0,period:'month'},0],102:[{savings:0,income:100},0],
110:[{annualSalary:0,annualWorkHours:100},0],111:[{hourlyPay:0,annualWorkHours:100},0],113:[{previousPay:100,newPay:100},0],
114:[{amount:80,annualInflationPercent:0,years:0},80],115:[{amount:80,annualInflationPercent:0,years:0},80],
116:[{bill:80,tipPercent:0,people:1},0],117:[{price:80,discountPercent:0},0],118:[{price:80,discountPercent:100},0],119:[{eligibleSales:0,commissionPercent:1},0],
465:[{distanceKm:100,batteryEnergyAddedKwh:0,electricityRatePerKwh:0,chargingEfficiencyPercent:100,fuelConsumptionLitersPer100Km:0,fuelPricePerLiter:0},0],
466:[{purchasePrice:100,resaleValue:100,operatingCosts:[],years:1,ownershipBasis:'cash-purchase-excludes-financing'},0],
473:[{distanceKm:0,baselineLitersPer100Km:6,alternativeLitersPer100Km:8,baselineFuelPrice:2,alternativeFuelPrice:2},0],
477:[{energyKwh:0,tariffPerKwh:1},0],494:[{seaLevelPressurePa:80000,altitudeM:0},80000],
528:[{weightKg:100,met:1,minutes:20,metBasis:'caller-supplied-gross-MET'},35]
};
for(const [alias,original] of [[57,45],[59,45],[76,47],[77,47],[83,61],[106,61],[66,62],[75,62],[69,68],[100,37],[107,37],[108,37],[480,78],[537,494]])boundary[alias]=boundary[original];
const context=(id:number,input:Record<string,unknown>)=>({scope:'supplied-mathematical-scenario',...(id<400||[465,466,473,477,480].includes(id)?{currency:'USD'}:{}),...input});
export type ScaledWitness={name:string;input:Record<string,unknown>;expected:Record<string,unknown>;absoluteTolerance:number};
export type ScaledVectors={id:number;witnesses:ScaledWitness[];invalid:Record<string,unknown>[];derivation:string};
const rows:ScaledVectors[]=cases.map(([id,input,value])=>{const second=boundary[id];if(!second)throw Error('Missing independent boundary '+id);const full=context(id,input);const field=Object.keys(input)[0];let bad:Record<string,unknown>={...full,[field]:typeof input[field]==='number'?-1:typeof input[field]==='string'?'invalid':[]};
// Explicit numerical, calendar, denominator and unsupported-scope negatives.
if(id===25)bad={...full,firstPaymentDate:'2028-02-30'};
if([37,100,107,108].includes(id))bad={...full,income:[{name:'same',amount:1}],expenses:[{name:'same',amount:1}]};
if([114,115].includes(id))bad={...full,annualInflationPercent:-100};
if(id===68||id===69)bad={...full,inflationPercent:-100};
if(id===72)bad={...full,lowerRatePercent:20,upperRatePercent:30};
if(id===73)bad={...full,periodYieldPercent:-100};
if(id===494||id===537)bad={...full,altitudeM:11001};
if(id===528)bad={...full,met:21};
return {id,witnesses:[{name:'independent-methodology-witness',input:full,expected:{value},absoluteTolerance:id===72?1e-7:1e-9},{name:'identity-loss-or-domain-boundary',input:context(id,second[0]),expected:{value:second[1]},absoluteTolerance:0}],invalid:[bad],derivation:'Reused independently authored Batch09 numerical witness; boundary uses zero/identity, total loss, exact calendar count or declared physical formula. Tolerance is explicit only for the scalar binary64 witness, not schemas/identity/replay or all-domain accuracy.'};});
export const scaledVectors=copyCalculationData({rows},{}).input.rows as ScaledVectors[];
