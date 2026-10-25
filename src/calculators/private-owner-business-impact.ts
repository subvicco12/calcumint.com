import {z} from 'zod';
import {amount,positive,label,finiteNumber,sumFinite,ownerModel,type OwnerBinding} from './owner-model-support';

// Every monetary quantity in a request shares this explicitly supplied currency and period.
const context={currency:label,period:label};
const sampleContext={currency:'USD',period:'2026-10'};
const fraction=amount.max(1);
const items=z.array(z.object({name:label,amount}).strict());
const total=(entries:z.infer<typeof items>)=>sumFinite(entries.map(x=>x.amount));
const scenario=z.object({price:amount,unitVariableCost:amount,units:amount}).strict();
const comparisonSchema=z.object({...context,unit:label,before:scenario,after:scenario}).strict();
function compare(input:z.infer<typeof comparisonSchema>){
 const beforeRevenue=finiteNumber(input.before.price*input.before.units);
 const afterRevenue=finiteNumber(input.after.price*input.after.units);
 const beforeContribution=finiteNumber((input.before.price-input.before.unitVariableCost)*input.before.units);
 const afterContribution=finiteNumber((input.after.price-input.after.unitVariableCost)*input.after.units);
 return {beforeRevenue,afterRevenue,revenueChange:finiteNumber(afterRevenue-beforeRevenue),beforeContribution,afterContribution,contributionChange:finiteNumber(afterContribution-beforeContribution)};
}
const comparisonInput={...sampleContext,unit:'item',before:{price:10,unitVariableCost:4,units:100},after:{price:8,unitVariableCost:3,units:150}};
const comparisonExpected={beforeRevenue:1000,afterRevenue:1200,revenueChange:200,beforeContribution:600,afterContribution:750,contributionChange:150};
const adSchema=z.discriminatedUnion('mode',[
 z.object({...context,mode:z.literal('revenue-roas'),targetAttributedRevenue:amount,targetRoasMultiple:positive}).strict(),
 z.object({...context,mode:z.literal('conversions-cpa'),conversions:amount,costPerAcquisition:amount}).strict(),
]);
const targetSchema=z.discriminatedUnion('mode',[
 z.object({...context,mode:z.literal('profit-revenue'),contributionMarginFraction:fraction,targetProfitFraction:fraction}).strict(),
 z.object({...context,mode:z.literal('profit-ad-spend'),contributionMarginFraction:fraction,targetProfitPerAdSpend:amount}).strict(),
]);
const promoScenario=z.object({revenue:amount,units:amount,costs:items}).strict();
const promotionSchema=z.object({...context,mode:z.enum(['contribution','profit']),unit:label,before:promoScenario,promotion:promoScenario}).strict();
export const privateOwnerBusinessImpact:OwnerBinding[]=[
 ownerModel(44,z.object({...context,potentialGrossRent:amount,beforeVacancyFraction:fraction,afterVacancyFraction:fraction}).strict(),input=>{
 const beforeLostRent=finiteNumber(input.potentialGrossRent*input.beforeVacancyFraction);
 const afterLostRent=finiteNumber(input.potentialGrossRent*input.afterVacancyFraction);
 return {beforeLostRent,afterLostRent,changeLostRent:finiteNumber(afterLostRent-beforeLostRent)};
 },[{label:'Same monthly gross rent',input:{...sampleContext,potentialGrossRent:1000,beforeVacancyFraction:0.1,afterVacancyFraction:0.25},expected:{beforeLostRent:100,afterLostRent:250,changeLostRent:150}}],{expression:'lost rent = potential gross rent × vacancy fraction',description:'Gross rent loss comparison only; same supplied currency and rent period.'}),
 ...[159,160].map(id=>ownerModel(id,comparisonSchema,compare,[{label:'Independently supplied prices, costs and volumes',input:comparisonInput,expected:comparisonExpected}],{expression:'revenue = price × units; contribution = (price − unit variable cost) × units; change = after − before',description:'Both volumes are supplied independently. No demand response is inferred; contribution excludes unsupplied fixed costs.'})),
 ownerModel<z.infer<typeof adSchema>>(194,adSchema,input=>({requiredSpend:finiteNumber(input.mode==='revenue-roas'?input.targetAttributedRevenue/input.targetRoasMultiple:input.conversions*input.costPerAcquisition)}),[
 {label:'Revenue divided by ROAS multiple',input:{...sampleContext,mode:'revenue-roas',targetAttributedRevenue:1200,targetRoasMultiple:3},expected:{requiredSpend:400}},
 {label:'Conversions times supplied CPA',input:{...sampleContext,mode:'conversions-cpa',conversions:20,costPerAcquisition:7},expected:{requiredSpend:140}},
 ],{expression:'spend = attributed revenue / ROAS multiple OR conversions × CPA',description:'Explicit mode; period is the supplied attribution period. ROAS is currency revenue per currency spend; CPA is currency per conversion. No delivery guarantee.'}),
 ownerModel<z.infer<typeof targetSchema>>(195,targetSchema,input=>{
 const denominator=input.mode==='profit-revenue'?input.contributionMarginFraction-input.targetProfitFraction:input.contributionMarginFraction;
 if(denominator<=0)throw new RangeError('Unattainable finite ROAS: positive margin remaining for ad spend required');
 return {targetRoasMultiple:finiteNumber((input.mode==='profit-revenue'?1:finiteNumber(1+input.targetProfitPerAdSpend))/denominator)};
 },[
 {label:'Profit as fraction of revenue',input:{...sampleContext,mode:'profit-revenue',contributionMarginFraction:0.5,targetProfitFraction:0.25},expected:{targetRoasMultiple:4}},
 {label:'Profit per ad spend',input:{...sampleContext,mode:'profit-ad-spend',contributionMarginFraction:0.5,targetProfitPerAdSpend:1},expected:{targetRoasMultiple:4}},
 ],{expression:'profit/revenue target t: ROAS = 1/(margin − t); profit/spend target r: ROAS = (1+r)/margin',description:'Margin is pre-ad contribution divided by attributed revenue. Profit here is contribution after ad spend only, excluding unsupplied fixed costs and taxes. Targets are explicit constraints for the supplied attribution period.'}),
 ownerModel(200,z.object({...context,salesProceeds:amount,fees:items,goodsCosts:items,fulfillmentCosts:items}).strict(),input=>{
 const totalCosts=sumFinite([total(input.fees),total(input.goodsCosts),total(input.fulfillmentCosts)]);
 return {totalCosts,profit:finiteNumber(input.salesProceeds-totalCosts)};
 },[{label:'Declared itemized costs',input:{...sampleContext,salesProceeds:100,fees:[{name:'supplied fee',amount:12}],goodsCosts:[{name:'goods',amount:30}],fulfillmentCosts:[{name:'delivery',amount:8}]},expected:{totalCosts:50,profit:50}}],{expression:'profit = sales proceeds − fees − goods costs − fulfillment costs',description:'All cost arrays are required; empty means explicitly no supplied costs of that kind. Sales proceeds must be before listed deductions to avoid double subtraction. Profit covers listed costs only; no platform or tax defaults.'}),
 ownerModel(201,promotionSchema,input=>{
 const before=finiteNumber(input.before.revenue-total(input.before.costs));
 const promotion=finiteNumber(input.promotion.revenue-total(input.promotion.costs));
 return {measure:input.mode,before,promotion,incremental:finiteNumber(promotion-before)};
 },(['contribution','profit'] as const).map(mode=>({label:`Supplied ${mode} comparison`,input:{...sampleContext,mode,unit:'item',before:{revenue:100,units:10,costs:[{name:'declared costs',amount:60}]},promotion:{revenue:150,units:20,costs:[{name:'declared costs',amount:90}]}},expected:{measure:mode,before:40,promotion:60,incremental:20}})),{expression:'scenario result = supplied total revenue − sum(supplied total costs); incremental = promotion − before',description:'Units are supplied separately for each scenario; revenue and costs are period totals, never per-unit. Contribution mode requires variable and promotion costs; profit mode requires all attributable costs including promotion costs. Completeness is caller declared; no causal demand or tax inference.'}),
 ownerModel(203,z.object({...context,basis:z.enum(['per-order','period']),shippingRevenue:amount,carrier:amount,packaging:amount,handling:amount}).strict(),input=>({shippingContribution:finiteNumber(input.shippingRevenue-sumFinite([input.carrier,input.packaging,input.handling]))}),(['per-order','period'] as const).map(basis=>({label:`Supplied ${basis} shipping amounts`,input:{...sampleContext,basis,shippingRevenue:10,carrier:4,packaging:1,handling:2},expected:{shippingContribution:3}})),{expression:'shipping contribution = shipping revenue − carrier − packaging − handling',description:'Every amount uses the same selected per-order or period basis. Period labels identify the supplied observation window for either basis. No overhead allocation or full-company profit claim.'}),
];
