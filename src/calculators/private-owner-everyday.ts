import {z} from 'zod';
import {amount,positive,label,finiteNumber,sumFinite,isoDay,multiplyFinite,divideFinite,ownerModel,type OwnerBinding} from './owner-model-support';
import {tripCostCalculator} from './travel/catalog-batch-2';
import {runCalculator} from './engine';
const currency=z.string().regex(/^[A-Z]{3}$/);
const date=z.string().refine(v=>{try{isoDay(v);return true;}catch{return false;}},'Valid Gregorian YYYY-MM-DD required');
const basket=z.array(z.object({category:label,amount}).strict()).min(1).max(1000);
const compare=ownerModel(109,z.object({currency,period:label,first:basket,second:basket}).strict(),i=>{
 const a=i.first.map(x=>x.category),b=i.second.map(x=>x.category);
 if(new Set(a).size!==a.length||new Set(b).size!==b.length||a.length!==b.length||a.some(x=>!b.includes(x)))throw Error('Unique matching labeled categories required');
 const firstTotal=sumFinite(i.first.map(x=>x.amount)),secondTotal=sumFinite(i.second.map(x=>x.amount)),difference=finiteNumber(secondTotal-firstTotal);
 return{currency:i.currency,period:i.period,firstTotal,secondTotal,difference,percentage:firstTotal>0?finiteNumber(difference/firstTotal*100):null};
},[{label:'Matched monthly baskets',input:{currency:'USD',period:'month',first:[{category:'rent',amount:100}],second:[{category:'rent',amount:125}]},expected:{currency:'USD',period:'month',firstTotal:100,secondTotal:125,difference:25,percentage:25}}],{expression:'difference = second − first; percentage = 100 × difference / positive first',description:'Like-for-like supplied expense baskets in one currency and period; no cost-of-living index.'});
const depreciationCommon={currency,initial:amount,floor:amount,years:z.number().int().min(1).max(1200)};
const depreciationSchema=z.discriminatedUnion('mode',[
 z.object({...depreciationCommon,mode:z.literal('straightLine'),annualAmount:amount}).strict(),
 z.object({...depreciationCommon,mode:z.literal('percentDecline'),annualRatePercent:amount.max(100)}).strict(),
]);
const depreciation=ownerModel<z.infer<typeof depreciationSchema>>(467,depreciationSchema,i=>{if(i.floor>i.initial)throw Error('Floor must not exceed initial value');let value=i.initial;
 const schedule=Array.from({length:i.years},(_,n)=>{value=Math.max(i.floor,i.mode==='straightLine'?finiteNumber(value-i.annualAmount):finiteNumber(multiplyFinite(value,(1-i.annualRatePercent/100))));return{year:n+1,value};});return{currency:i.currency,mode:i.mode,schedule};
},[
 {label:'Straight-line supplied annual amount',input:{mode:'straightLine',currency:'USD',initial:100,floor:20,years:3,annualAmount:30},expected:{currency:'USD',mode:'straightLine',schedule:[{year:1,value:70},{year:2,value:40},{year:3,value:20}]}},
 {label:'Percentage decline supplied annual rate',input:{mode:'percentDecline',currency:'USD',initial:100,floor:20,years:2,annualRatePercent:50},expected:{currency:'USD',mode:'percentDecline',schedule:[{year:1,value:50},{year:2,value:25}]}}
],{expression:'V[y] = max(floor, V[y−1] − amount) or max(floor, V[y−1] × (1 − rate/100))',description:'Explicit annual straight-line or percent decline. 1200-year limit is an engine runtime guard, not a physical limit. No resale prediction or tax depreciation.'});
const flow=z.object({date,kind:z.enum(['purchase','financing','operating']),amount}).strict();
const scenario=z.object({currency,startDate:date,endDate:date,cashflows:z.array(flow).max(10000),terminalResale:z.object({date,amount}).strict()}).strict();
const carSchema=z.object({new:scenario,used:scenario}).strict();
const car=ownerModel<z.infer<typeof carSchema>>(471,carSchema,i=>{
 const a=i.new,b=i.used;if(a.currency!==b.currency||a.startDate!==b.startDate||a.endDate!==b.endDate)throw Error('Matching currency and dated horizon required');
 const cost=(s:z.infer<typeof scenario>)=>{if(isoDay(s.startDate)>isoDay(s.endDate)||s.terminalResale.date!==s.endDate||s.cashflows.some(f=>isoDay(f.date)<isoDay(s.startDate)||isoDay(f.date)>isoDay(s.endDate)))throw Error('Cashflows and terminal resale must match horizon');return finiteNumber(sumFinite(s.cashflows.map(f=>f.amount))-s.terminalResale.amount);};
 const newCost=cost(a),usedCost=cost(b);return{currency:a.currency,startDate:a.startDate,endDate:a.endDate,newCost,usedCost,difference:finiteNumber(newCost-usedCost)};
},[{label:'Undiscounted supplied new and used scenarios',input:{new:{currency:'USD',startDate:'2026-01-01',endDate:'2027-01-01',cashflows:[{date:'2026-01-01',kind:'purchase',amount:100}],terminalResale:{date:'2027-01-01',amount:60}},used:{currency:'USD',startDate:'2026-01-01',endDate:'2027-01-01',cashflows:[{date:'2026-01-01',kind:'purchase',amount:50}],terminalResale:{date:'2027-01-01',amount:20}}},expected:{currency:'USD',startDate:'2026-01-01',endDate:'2027-01-01',newCost:40,usedCost:30,difference:10}}],{expression:'undiscounted cost = sum(supplied cash outflows) − supplied terminal resale',description:'Same-horizon new versus used cashflow comparison. Supply actual purchase/financing/operating outflows without double counting financed principal. No invented amortization, investment return or repair defaults.'});
const fx=ownerModel(512,z.object({reportingCurrency:currency,lines:z.array(z.object({date,baseCurrency:currency,quoteCurrency:currency,amount,rate:positive,direction:z.enum(['reportingPerUnit','unitsPerReporting'])}).strict()).min(1).max(10000)}).strict(),i=>{
 const lines=i.lines.map(l=>{if(l.quoteCurrency!==i.reportingCurrency||(l.baseCurrency===l.quoteCurrency&&l.rate!==1))throw Error('Quote must be reporting currency; same-currency rate must be one');const converted=finiteNumber(l.direction==='reportingPerUnit'?multiplyFinite(l.amount,l.rate):divideFinite(l.amount,l.rate));return{...l,reportingAmount:converted};});return{reportingCurrency:i.reportingCurrency,lines,total:sumFinite(lines.map(l=>l.reportingAmount))};
},[
 {label:'Manual reporting currency per base unit',input:{reportingCurrency:'USD',lines:[{date:'2026-01-01',baseCurrency:'EUR',quoteCurrency:'USD',amount:10,rate:2,direction:'reportingPerUnit'}]},expected:{reportingCurrency:'USD',lines:[{date:'2026-01-01',baseCurrency:'EUR',quoteCurrency:'USD',amount:10,rate:2,direction:'reportingPerUnit',reportingAmount:20}],total:20}},
 {label:'Manual base units per reporting currency',input:{reportingCurrency:'USD',lines:[{date:'2026-01-01',baseCurrency:'EUR',quoteCurrency:'USD',amount:10,rate:2,direction:'unitsPerReporting'}]},expected:{reportingCurrency:'USD',lines:[{date:'2026-01-01',baseCurrency:'EUR',quoteCurrency:'USD',amount:10,rate:2,direction:'unitsPerReporting',reportingAmount:5}],total:5}}
],{expression:'reporting amount = base amount × supplied rate, or base amount / supplied reciprocal rate',description:'Manual dated directional FX only. No live provider, execution rate or fee guarantee. Rejected master #442 mapping remains rejected; this is only owner-approved #512.'});
const tripSchema=z.object({transportCost:z.unknown(),lodgingCost:z.unknown(),foodCost:z.unknown(),otherCost:z.unknown()}).strict().transform(i=>tripCostCalculator.inputSchema.parse(i));
const trip=ownerModel(507,tripSchema,i=>{if(tripCostCalculator.version!==1||tripCostCalculator.slug!=='trip-cost-calculator')throw Error('Approved immutable trip-cost v1 unavailable');return runCalculator(tripCostCalculator,i).output;},tripCostCalculator.examples,{expression:tripCostCalculator.formulas[0].expression,description:'Reuses registered trip-cost-calculator version 1, exact transportCost/lodgingCost/foodCost/otherCost fields and original numeric caps through runCalculator. All four costs must share the user’s chosen currency and trip period.'},'standard');
export const privateOwnerEveryday:OwnerBinding[]=[compare,depreciation,car,fx,trip];
