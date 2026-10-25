import {z} from 'zod';
import {ownerModel,amount,positive,label,finiteNumber,sumFinite,isoDay,multiplyFinite,divideFinite,type OwnerBinding} from './owner-model-support';

const money={currency:label,period:label};
const signed=z.number().finite();
const day=label.refine(value=>{try{isoDay(value);return true;}catch{return false;}},'Valid YYYY-MM-DD required');
const salesSchema=z.object({...money,lines:z.array(z.object({price:amount,quantity:amount}).strict()).min(1)}).strict();
const projectSchema=z.discriminatedUnion('mode',[
 z.object({...money,mode:z.literal('profit'),revenue:amount,costs:amount}).strict(),
 z.object({...money,mode:z.literal('margin'),revenue:positive,costs:amount}).strict(),
 z.object({mode:z.literal('dated-npv'),currency:label,valuationDate:day,dayCount:z.literal('ACT365F'),annualEffectiveRatePercent:signed.gt(-100),cashflows:z.array(z.object({date:day,amount:signed}).strict()).min(1)}).strict(),
]);
const hourlySchema=z.object({currency:label,annualPeriod:label,annualRevenueTarget:amount,billableHours:positive}).strict();
const pricingSchema=z.discriminatedUnion('mode',[
 z.object({...money,mode:z.literal('markup'),cost:amount,markupPercent:amount}).strict(),
 z.object({...money,mode:z.literal('target-margin'),cost:positive,targetMarginPercent:amount.lt(100)}).strict(),
]);
function price(input:z.infer<typeof pricingSchema>){return {currency:input.currency,period:input.period,price:finiteNumber(input.mode==='markup'?multiplyFinite(input.cost,(1+input.markupPercent/100)):divideFinite(input.cost,(1-input.targetMarginPercent/100)))};}
const unitCommon={currency:label,unit:label,costBoundary:label,cohortPeriod:label,unitRevenue:amount,unitCost:amount};
const unitSchema=z.discriminatedUnion('mode',[
 z.object({...unitCommon,mode:z.literal('contribution')}).strict(),
 z.object({...unitCommon,mode:z.literal('acquisition-ratio'),acquisitionCostPerUnit:positive}).strict(),
]);
const ruleSchema=z.object({growthPeriod:label,profitabilityPeriod:label,profitabilityBasis:label,growthPercent:signed,profitabilityPercent:signed}).strict().refine(x=>x.growthPeriod===x.profitabilityPeriod,'Periods must match');
const pricingExamples=[
 {label:'Cost plus markup',input:{mode:'markup' as const,currency:'USD',period:'month',cost:80,markupPercent:25},expected:{currency:'USD',period:'month',price:100}},
 {label:'Target margin',input:{mode:'target-margin' as const,currency:'USD',period:'month',cost:80,targetMarginPercent:20},expected:{currency:'USD',period:'month',price:100}},
];
const unitExample={currency:'USD',unit:'order',costBoundary:'variable fulfillment',cohortPeriod:'October',unitRevenue:50,unitCost:30};
export const privateOwnerBusinessCore:OwnerBinding[]=[
 ownerModel<z.infer<typeof salesSchema>>(145,salesSchema,input=>({currency:input.currency,period:input.period,grossSales:sumFinite(input.lines.map(x=>multiplyFinite(x.price,x.quantity)))}),[
  {label:'Gross supplied sales',input:{currency:'USD',period:'2026',lines:[{price:12,quantity:3},{price:4,quantity:5}]},expected:{currency:'USD',period:'2026',grossSales:56}},
 ],{expression:'grossSales = Σ(price × quantity)',description:'Supplied gross sales in one declared currency and period; no recognition, tax or discount assumptions.'}),
 ownerModel<z.infer<typeof projectSchema>>(156,projectSchema,input=>{
  if(input.mode==='dated-npv'){
   const valuation=isoDay(input.valuationDate);
   const npv=sumFinite(input.cashflows.map(flow=>{
    const years=(isoDay(flow.date)-valuation)/86400000/365;
    const factor=finiteNumber(Math.pow(1+input.annualEffectiveRatePercent/100,years));
    if(factor===0)throw new RangeError('Discount factor underflow');
    return divideFinite(flow.amount,factor);
   }));
   return {currency:input.currency,dayCount:input.dayCount,valuationDate:input.valuationDate,npv};
  }
  const profit=finiteNumber(input.revenue-input.costs);
  return {currency:input.currency,period:input.period,profit,...(input.mode==='margin'?{marginPercent:finiteNumber(profit/input.revenue*100)}:{})};
 },[
  {label:'Profit only',input:{mode:'profit',currency:'USD',period:'Q1',revenue:80,costs:100},expected:{currency:'USD',period:'Q1',profit:-20}},
  {label:'Profit margin',input:{mode:'margin',currency:'USD',period:'Q1',revenue:80,costs:60},expected:{currency:'USD',period:'Q1',profit:20,marginPercent:25}},
  {label:'Dated NPV, explicit ACT365F',input:{mode:'dated-npv',currency:'USD',valuationDate:'2025-01-01',dayCount:'ACT365F',annualEffectiveRatePercent:0,cashflows:[{date:'2025-01-01',amount:-100},{date:'2026-01-01',amount:120}]},expected:{currency:'USD',dayCount:'ACT365F',valuationDate:'2025-01-01',npv:20}},
 ],{expression:'profit = revenue − costs; margin% = 100 × profit/revenue; NPV = Σ CF/(1+r)^((date−valuationDate)/365)',description:'User selects profit, margin or dated NPV. ACT365F uses actual UTC calendar days divided by 365, including signed dates before valuation; rate is annual effective and supplied as percent.'}),
 ownerModel<z.infer<typeof hourlySchema>>(157,hourlySchema,input=>({currency:input.currency,annualPeriod:input.annualPeriod,hourlyRevenue:divideFinite(input.annualRevenueTarget,input.billableHours)}),[
  {label:'Annual target per billable hour',input:{currency:'USD',annualPeriod:'2026',annualRevenueTarget:90000,billableHours:1500},expected:{currency:'USD',annualPeriod:'2026',hourlyRevenue:60}},
 ],{expression:'hourlyRevenue = annualRevenueTarget/billableHours',description:'Supplied annual revenue target and annual billable capacity; no tax or utilization assumptions.'}),
 ownerModel<z.infer<typeof pricingSchema>>(158,pricingSchema,price,pricingExamples,{expression:'markup: cost × (1+markup%/100); target margin: cost/(1−margin%/100)',description:'Explicit cost-plus markup or target margin on supplied agency costs.'}),
 ownerModel<z.infer<typeof unitSchema>>(161,unitSchema,input=>{
  const contribution=finiteNumber(input.unitRevenue-input.unitCost);
  return {currency:input.currency,unit:input.unit,costBoundary:input.costBoundary,cohortPeriod:input.cohortPeriod,unitRevenue:input.unitRevenue,unitCost:input.unitCost,contribution,...(input.mode==='acquisition-ratio'?{contributionToAcquisitionRatio:divideFinite(contribution,input.acquisitionCostPerUnit)}:{})};
 },[
  {label:'Unit contribution',input:{...unitExample,mode:'contribution'},expected:{...unitExample,contribution:20}},
  {label:'Contribution divided by acquisition cost per declared unit',input:{...unitExample,mode:'acquisition-ratio',acquisitionCostPerUnit:10},expected:{...unitExample,contribution:20,contributionToAcquisitionRatio:2}},
 ],{expression:'contribution = unitRevenue−unitCost; selected acquisition ratio = contribution/acquisitionCostPerUnit',description:'Declared unit, cost boundary and cohort/period required. Ratio uses acquisition cost on the same supplied unit basis, without retention or lifetime inference.'}),
 ownerModel<z.infer<typeof ruleSchema>>(177,ruleSchema,input=>({period:input.growthPeriod,profitabilityBasis:input.profitabilityBasis,scorePercent:finiteNumber(input.growthPercent+input.profitabilityPercent)}),[
  {label:'Matching period supplied percentages',input:{growthPeriod:'2026',profitabilityPeriod:'2026',profitabilityBasis:'operating margin',growthPercent:30,profitabilityPercent:-5},expected:{period:'2026',profitabilityBasis:'operating margin',scorePercent:25}},
 ],{expression:'score% = revenueGrowth% + profitability%',description:'Arithmetic percentage-point sum for explicitly matching periods and declared profitability basis; no valuation recommendation.'}),
 ownerModel<z.infer<typeof pricingSchema>>(181,pricingSchema,price,pricingExamples,{expression:'markup: cost × (1+markup%/100); target margin: cost/(1−margin%/100)',description:'Explicit markup or margin on supplied subscription unit/customer costs for the declared billing period; no demand optimization.'}),
];
