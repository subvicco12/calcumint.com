import {z} from 'zod';
import type {CalculatorDefinition,CalculatorRunResult} from './types';
import {calculatorRegistry} from './registry';
import {runCalculator} from './engine';
import {copyCalculationData,createCalculationSnapshot} from '../lib/calculation-snapshot';
import {equalCompletionJson} from './completion-contracts';
import evidence from '../../docs/cloud-batch08/selected-contract-evidence.json';

type P=Record<string,unknown>;
const amount=z.number().finite().min(0).max(1e12),positive=amount.min(0.01),rate=z.number().finite().min(0).max(1000),months=z.number().int().min(1).max(1200);
const monetary={currency:z.string().trim().min(1).max(80),scope:z.literal('supplied-fixed-monthly-no-policy')};
const basis={currency:'USD',scope:'supplied-fixed-monthly-no-policy'};
const dep=(slug:string)=>{const d=calculatorRegistry.getBySlug(slug);if(!d||d.version!==1)throw Error('Unsupported immutable component');return d;};
type Spec={id:number;fields:z.ZodRawShape;slug:string;key:string;example:P;fixed?:P;comparison?:boolean;unit:string;method:string};
const specs:Spec[]=[];
const loan={principal:positive,annualRatePercent:rate,termMonths:months,extraMonthlyPayment:amount};
const loanExample={principal:1200,annualRatePercent:0,termMonths:3,extraMonthlyPayment:0};
for(const id of [3,5,6,7,8,22,27,29])specs.push({id,fields:loan,slug:'loan-emi-calculator',key:'scheduledPayment',example:{...loanExample,extraMonthlyPayment:[5,29].includes(id)?200:0},unit:'currency/month',method:'Fixed nominal annual rate divided by12; interest before monthly payments. M=P*r/(1-(1+r)^(-n)), zero rate P/n. Full unrounded internal balance, rows rounded to2 decimals; totals sum displayed rounded rows. Balance closure0.005; at most termMonths1200. Final payment capped at amount due; monthlyPayment is requested, scheduledPayment is base. No fees, grace, subsidies, balloon, escrow, tax, insurance or lender eligibility.'});
const payoff={balance:positive,annualAprPercent:rate,monthlyPayment:positive,extraMonthlyPayment:amount};
for(const id of [4,11,28])specs.push({id,fields:payoff,slug:'credit-card-payoff-calculator',key:'payoffMonths',example:{balance:1200,annualAprPercent:0,monthlyPayment:400,extraMonthlyPayment:0},unit:'months',method:'Supplied fixed monthly payment, nominal annual rate/12, interest before payments; no issuer minimum-payment model. Final partial payment capped at amount due. Closure0.005 and horizon2400 months. Nonamortizing or horizon-exceeding inputs rejected. Outputs retain original2-decimal totals; no calendar payoff dates or daily accrual.'});
const affordability={grossMonthlyIncome:positive,existingMonthlyDebt:amount,targetDtiPercent:z.number().finite().positive().max(100),annualRatePercent:rate,termMonths:months,downPayment:amount};
const affordabilityExample={grossMonthlyIncome:1000,existingMonthlyDebt:100,targetDtiPercent:20,annualRatePercent:0,termMonths:10,downPayment:0};
for(const id of [12,30,104,105])specs.push({id,fields:affordability,slug:'loan-affordability-calculator',key:'maximumLoanPrincipal',example:affordabilityExample,unit:'currency',method:'Caller-selected DTI only: capacity=max(0,income*targetDTI/100-existingDebt); principal=capacity*(1-(1+r)^(-n))/r or capacity*n at zero rate. Purchase price adds supplied down payment. Monthly periods, nominal rate/12, outputs rounded2 decimals. Gross income and debt inclusion supplied by caller. No statutory or lender approval, taxes, housing operating costs or insurance inferred.'});
specs.push({id:13,fields:{grossMonthlyIncome:positive,existingMonthlyDebt:amount},slug:'ratio-calculator',key:'result',example:{grossMonthlyIncome:1000,existingMonthlyDebt:100},unit:'percent',method:'Supplied monthly debt/gross monthly income*100. Same currency and period; positive income required. No debt classification or lender threshold inferred.'});
const debt=z.object({name:z.string().trim().min(1).max(80),balance:positive,annualRatePercent:rate,minimumPayment:amount}).strict();
for(const id of [14,15,16,17])specs.push({id,fields:{debts:z.array(debt).min(1).max(50),extraMonthlyPayment:amount},slug:'debt-payoff-calculator',key:'monthsToPayoff',example:{debts:[{name:'A',balance:100,annualRatePercent:12,minimumPayment:0},{name:'B',balance:50,annualRatePercent:0,minimumPayment:0}],extraMonthlyPayment:151},fixed:{strategy:id===15?'snowball':'avalanche'},comparison:id===17,unit:'months',method:'Supplied disjoint balances and fixed original minimums plus extra form a constant monthly budget. Monthly nominal interest/12; released minimum capacity rolls forward. Snowball sorts balance then rate then input order; avalanche sorts rate then balance then input order. Require monthly aggregate balance reduction; closure0.005, horizon1200; impossible plans rejected rather than marked complete. Comparison runs both strategies on identical inputs without selecting a winner. No issuer, delinquency or statutory rules.'});
const refinance={remainingBalance:positive,currentAnnualRatePercent:rate,currentRemainingMonths:months,newAnnualRatePercent:rate,newTermMonths:months,refinanceCosts:amount};
for(const id of [24,33])specs.push({id,fields:refinance,slug:'loan-refinance-calculator',key:id===33?'breakEvenMonths':'netLifetimeSavings',example:{remainingBalance:201,currentAnnualRatePercent:12,currentRemainingMonths:2,newAnnualRatePercent:0,newTermMonths:2,refinanceCosts:1},unit:id===33?'months':'currency',method:'Compare fully amortizing level monthly payments using nominal rates/12 and supplied costs. Net lifetime savings=current remaining interest-new interest-costs. Simple cashflow break-even=ceil(costs/monthly payment savings), null without positive savings; zero costs break even immediately only with positive savings. Break-even may exceed loan horizon and is not lifetime savings. Original2-decimal outputs retained; no tax, eligibility, cash-out, penalty or date policy.'});
specs.push({id:31,fields:{price:positive,downPaymentPercent:z.number().finite().min(0).max(100)},slug:'percentage-of-value-calculator',key:'result',example:{price:1000,downPaymentPercent:20},unit:'currency',method:'Supplied price*supplied down payment percentage/100; remainder price-down payment. No minimum percentage, loan eligibility, closing costs or provider policy.'});
for(const [id,slug,units,example] of [
 [426,'unit-conversion-calculator',['kg','g','lb','oz'],{value:1,fromUnit:'kg',toUnit:'g'}],
 [506,'cooking-measurement-converter',['ml','l','tsp_us','tbsp_us','fl_oz_us','cup_us','pint_us','quart_us','gallon_us'],{value:1,fromUnit:'cup_us',toUnit:'ml'}]
] as const)specs.push({id,fields:{value:amount,fromUnit:z.enum(units),toUnit:z.enum(units),scope:z.literal('named-unit-conversion')},slug,key:'result',example,unit:'selected target unit',method:id===426?'Mass only: kg=1kg,g=0.001kg,lb=0.45359237kg,oz=0.028349523125kg. Source value*source factor/target factor; inherited12-decimal output rounding. Nonnegative quantities; mass is not gravitational force.':'US kitchen volume only, approximate inherited milliliter factors: ml1,l1000,tsp_us4.928922,tbsp_us14.78676,fl_oz_us29.57353,cup_us236.58824,pint_us473.1765,quart_us946.3529,gallon_us3785.412. Same units return original value; otherwise source*source factor/target factor. Not exact rational equivalencies; no ingredient density, mass conversion or other regional cups.'});
specs.sort((a,b)=>a.id-b.id);
const byId=(id:number)=>{const s=specs.find(s=>s.id===id);if(!s)throw Error('Unsupported private identity');return s;};
const schema=(s:Spec)=>z.object({...s.id<400?monetary:{},...s.fields}).strict();
const numeric=(p:P,key:string)=>p[key] as number;
function checkRate(r:number,n:number){const denominator=1-(1+r/1200)**-n;if(r!==0&&(1+r/1200===1||denominator<=0||denominator>=1))throw Error('Rate is not representable in original component arithmetic');}
function ensureFinite(value:unknown):void{if(typeof value==='number'&&!Number.isFinite(value))throw Error('Nonfinite private output');if(value&&typeof value==='object')for(const v of Object.values(value))ensureFinite(v);}
const f=z.number().finite(),whole=z.number().int().min(0);
const scheduleOutput=z.object({monthlyPayment:f,scheduledPayment:f,totalPayment:f,totalInterest:f,payoffMonths:whole,interestSavedVsScheduled:f,monthsSavedVsScheduled:whole,amortization:z.array(z.object({month:whole,payment:f,principal:f,interest:f,balance:f}).strict()).max(1200)}).strict();
const payoffOutput=z.object({payoffMonths:whole,totalInterest:f,totalPaid:f,effectiveMonthlyPayment:f,firstMonthInterest:f}).strict();
const affordabilityOutput=z.object({currentDtiPercent:f,maximumTotalMonthlyDebt:f,availableMonthlyLoanPayment:f,maximumLoanPrincipal:f,maximumPurchasePrice:f,modeledPaymentAtMaximumPrincipal:f}).strict();
const debtOutput=z.object({strategy:z.enum(['avalanche','snowball']),monthsToPayoff:whole,totalInterest:f,totalPaid:f,startingBalance:f,payoffOrder:z.array(z.string()).max(50)}).strict();
const refinanceOutput=z.object({currentMonthlyPayment:f,newMonthlyPayment:f,monthlyPaymentChange:f,currentRemainingInterest:f,newLoanInterest:f,refinanceCosts:f,grossInterestSavings:f,netLifetimeSavings:f,breakEvenMonths:whole.nullable()}).strict();
function nativeOutput(s:Spec){
 switch(s.slug){case 'loan-emi-calculator':return scheduleOutput;case 'credit-card-payoff-calculator':return payoffOutput;case 'loan-affordability-calculator':return affordabilityOutput;case 'debt-payoff-calculator':return debtOutput;case 'loan-refinance-calculator':return refinanceOutput;default:return z.object({result:f}).strict();}
}
export const componentOutputSchemas:Readonly<Record<number,z.ZodType>>=Object.freeze(Object.fromEntries(specs.map(s=>{
 const native=nativeOutput(s),base=native.shape;
 return [s.id,z.object({...base,...s.comparison?{avalanche:debtOutput,snowball:debtOutput}:{},...s.id===31?{remainingPrincipal:f}:{},value:f.nullable(),unit:z.string(),dependencyRuns:z.array(z.object({calculatorId:z.literal(dep(s.slug).id),slug:z.literal(s.slug),version:z.literal(1),input:z.record(z.string(),z.unknown()),output:native}).strict()).length(s.comparison?2:1)}).strict()];
})));
function execute(s:Spec,raw:unknown){
 const p=schema(s).parse(raw) as P, runs:CalculatorRunResult<unknown,unknown>[]=[];
 const call=(input:P)=>{const run=runCalculator(dep(s.slug),input);ensureFinite(run.output);runs.push(run);return run.output as P;};
 let input:P=Object.fromEntries(Object.keys(s.fields).filter(k=>k!=='scope').map(k=>[k,p[k]]));
 if('annualRatePercent' in p)checkRate(numeric(p,'annualRatePercent'),numeric(p,'termMonths'));
 if(s.slug==='loan-refinance-calculator'){checkRate(numeric(p,'currentAnnualRatePercent'),numeric(p,'currentRemainingMonths'));checkRate(numeric(p,'newAnnualRatePercent'),numeric(p,'newTermMonths'));}
 if(s.id===13)input={a:p.existingMonthlyDebt,b:p.grossMonthlyIncome};
 if(s.id===31)input={percentage:p.downPaymentPercent,value:p.price};
 let out=call({...input,...s.fixed});
 if(s.slug==='loan-emi-calculator'){const rows=out.amortization as {balance:number}[];if(numeric(out,'scheduledPayment')<=0||!rows.length||rows.at(-1)!.balance>0.005)throw Error('Original rounded schedule does not represent a complete amortizing payment');}
 if(s.comparison){const snowball=call({...input,strategy:'snowball'});out={...out,avalanche:out,snowball};}
 let value=out[s.key] as number|null;
 if(s.id===13)value=(value as number)*100;
 if(s.id===31)out={...out,remainingPrincipal:numeric(p,'price')-(value as number)};
 if(s.slug==='loan-affordability-calculator'&&numeric(out,'availableMonthlyLoanPayment')>0&&numeric(out,'maximumLoanPrincipal')<=0)throw Error('Unrepresentable inverse principal');
 const result={...out,value,unit:s.id>=400?String(p.toUnit):s.unit,dependencyRuns:runs};ensureFinite(result);componentOutputSchemas[s.id].parse(result);return result;
}
export const componentContracts:readonly CalculatorDefinition<unknown,P>[]=Object.freeze(specs.map(s=>Object.freeze({id:`private.component.${s.id}`,slug:`private-component-${s.id}`,title:evidence.rows.find(r=>r.masterId===s.id)!.title+' — bounded private contract',category:'private-component-contracts',version:1,riskClass:s.id>=400?'standard' as const:'financial' as const,reviewStatus:'draft' as const,inputSchema:schema(s),calculate:(p:unknown)=>execute(s,p),formulas:Object.freeze([{id:`component-${s.id}`,expression:s.method,description:s.method+' Inputs bounded0..1e12; positive monetary amounts at least0.01. Unrepresentable annuity denominators and incomplete/zero-displayed-payment schedules are rejected. Strict closed named input. Output includes full actual immutable component runs. Private scope only; canonical requirements and specialist applicability remain unresolved. RELEASE HOLD.'}]),sources:dep(s.slug).sources,examples:[]})));
export const componentExamples=copyCalculationData(Object.fromEntries(specs.map(s=>[s.id,{...(s.id<400?basis:{scope:'named-unit-conversion'}),...s.example}])),{}).input as Record<number,P>;
export function exportComponentContract(id:number,input:unknown,plan:'free'|'pro'|'business'='free'){
 z.enum(['free','pro','business']).parse(plan);const s=byId(id),d=componentContracts.find(d=>d.id===`private.component.${id}`)!,component=dep(s.slug),run=runCalculator(d,input);
 const envelope={schemaVersion:1,masterId:id,profileId:d.id,methodology:{formulas:d.formulas,sources:d.sources},dependencies:[{id:component.id,slug:component.slug,version:component.version}],calculation:createCalculationSnapshot({calculatorSlug:d.slug,calculatorVersion:d.version,input:run.input as P,output:run.output})};
 return copyCalculationData({envelope},{}).input.envelope as typeof envelope;
}
export function importComponentContract(raw:unknown){const p=copyCalculationData({envelope:raw},{}).input.envelope as ReturnType<typeof exportComponentContract>;if(!p||typeof p.masterId!=='number'||!p.calculation)throw Error('Invalid snapshot');const expected=exportComponentContract(p.masterId,p.calculation.input);if(!equalCompletionJson(p,expected))throw Error('Snapshot selected identity, methodology, dependency or actual result mismatch');return expected;}
