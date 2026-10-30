/** Private source-bound arithmetic. Does not determine eligibility, filing or payments. */
import {z} from 'zod';
import type {CalculatorDefinition} from './types';
import {runCalculator} from './engine';
import {decimal,divide,rational,formatRational} from './exact-rational';
import {copyCalculationData,createCalculationSnapshot} from '../lib/calculation-snapshot';
import {equalCompletionJson} from './completion-contracts';
import binding from '../../docs/conditional-ten/source-binding.json';
const money=z.string().max(18).regex(/^(0|[1-9]\d{0,11})(\.\d{1,2})?$/);
const cents=(s:string)=>{const [a,b='']=s.split('.');return BigInt(a)*100n+BigInt(b.padEnd(2,'0'));};
const asMoney=(n:bigint)=>formatRational(rational(n,100n));
const min=(...ns:bigint[])=>ns.reduce((a,b)=>a<b?a:b);
const max=(a:bigint,b:bigint)=>a>b?a:b;
const evidenceReference=z.string().trim().min(8).max(500);
const base={evidenceReference,mode:z.literal('conditional-private-arithmetic'),currency:z.literal('USD')};
const iraBase={...base,taxYear:z.literal(2025),filingStatus:z.literal('single'),under50:z.literal(true),originalOwner:z.literal(true),otherIraContributions:z.literal(false),spousalCompensation:z.literal(false),excessContributions:z.literal(false),conversionOrInherited:z.literal(false),timelyEligibleContribution:z.literal(true),taxableCompensationUSD:money,magiUSD:money};
const rmdSchema=z.object({...base,profile:z.literal('rmd-2026-age75-tableIII'),taxYear:z.literal(2026),ageAtBirthday:z.literal(75),account:z.literal('traditional-IRA'),livingOriginalOwner:z.literal(true),table:z.literal('III'),spouseSoleBeneficiaryMoreThanTenYearsYounger:z.literal(false),balanceDate:z.literal('2025-12-31'),firstRmdYear:z.literal(false),unsupportedBalanceAdjustments:z.literal(false),annuityOrAggregation:z.literal(false),balanceUSD:money}).strict();
const rothSchema=z.object({...iraBase,profile:z.literal('roth-2025-unphased-contribution')}).strict().refine(p=>cents(p.magiUSD)<15000000n,{message:'Only MAGI below150000; phaseout/distributions excluded'});
const deductionSchema=z.object({...iraBase,profile:z.literal('ira-2025-covered-deduction'),employerCovered:z.literal(true),receivedSocialSecurityBenefits2025:z.literal(false),basisOrDistributionBranch:z.literal(false),adjustedCompensationUSD:money,contributionUSD:money}).strict().refine(p=>cents(p.contributionUSD)<=min(700000n,cents(p.taxableCompensationUSD))&&cents(p.adjustedCompensationUSD)<=cents(p.taxableCompensationUSD),{message:'Contribution cap and distinct adjusted compensation must be consistent'});
const corporationSchema=z.object({evidenceReference,mode:z.literal('conditional-private-arithmetic'),currency:z.literal('GBP'),profile:z.literal('uk-corporation-fy2026-n-equals-a'),periodStart:z.literal('2026-04-01'),periodEnd:z.literal('2027-03-31'),ukResident:z.literal(true),ordinaryNonRingFence:z.literal(true),closeInvestmentHolding:z.literal(false),associates:z.literal(0),specialRegimesOrForeignDistributions:z.literal(false),profitsNGBP:money,augmentedProfitsAGBP:money}).strict().refine(p=>cents(p.profitsNGBP)===cents(p.augmentedProfitsAGBP),{message:'Only N=A'});
const schema=z.union([rmdSchema,rothSchema,deductionSchema,corporationSchema]);
export type ConditionalInput=z.infer<typeof schema>;
type Output=Record<string,string>;
const source=copyCalculationData({binding},{}).input.binding as typeof binding;
export const conditionalProfiles=Object.freeze([
 {id:95,profile:'rmd-2026-age75-tableIII',title:'2026 age75 traditional IRA — exact quotient',formula:'Exact RMD=2025-12-31 balance/24.6. TableIII only. No rounded payment instruction.',source:'IRS Publication590-B(2025), 2026 lifetime examples and AppendixB TableIII.',url:'https://www.irs.gov/publications/p590b',deferred:'Other ages/tables, inherited accounts, first-year deadlines, annuities, adjustments, account aggregation and payment rounding.'},
 {id:97,profile:'roth-2025-unphased-contribution',title:'2025 single under50 Roth — contribution maximum',formula:'Maximum=min(7000,taxable compensation), only legally computed MAGI<150000.',source:'IRS Publication590-A(2025), Table2-1 and How Much Can Be Contributed.',url:'https://www.irs.gov/publications/p590a',deferred:'Phaseout,2026 rules, distributions/five-taxyear and age59.5 tests, conversions, inherited and excess contributions.'},
 {id:98,profile:'ira-2025-covered-deduction',title:'2025 employer-covered IRA — deduction worksheet',formula:'MAGI<=79000:full cap; >=89000:zero; otherwise max(200,ceilTo10((89000-MAGI)*0.70)), then min with contribution and adjusted compensation. Worksheet nondeductible=min(adjusted compensation,contribution)-deduction.',source:'IRS Publication590-A(2025), Table1-2, Worksheet1-2 lines1–8 and Social Security exclusion.',url:'https://www.irs.gov/publications/p590a',deferred:'Social Security/AppendixB, other filing or coverage statuses, return serialization, basis and distribution branches.'},
 {id:132,profile:'uk-corporation-fy2026-n-equals-a',title:'FY2026 UK corporation tax — N=A computational estimate',formula:'N<=50000:0.19N; 50000<N<=250000:0.25N-(3/200)(250000-N); above:0.25N. Exact arithmetic, no CT600/final collection amount.',source:'HMRC2026 rates table, CTM03930 marginal relief illustration (N=A), CTM03940 associated companies, CTM93220 no rounding before form entries.',url:'https://www.gov.uk/government/publications/rates-and-allowances-corporation-tax/rates-and-allowances-corporation-tax',deferred:'Associates, N!=A, short/straddling periods, special regimes, augmented-profit derivation and filing/payment rounding.'}
].map(p=>Object.freeze(p)));
const metadata=(p:ConditionalInput)=>{const found=conditionalProfiles.find(x=>x.profile===p.profile);if(!found)throw Error('Unsupported private profile');return found;};
const calculation:CalculatorDefinition<ConditionalInput,Output>=Object.freeze({id:'private.conditional-source-arithmetic.v1',slug:'private-conditional-source-arithmetic',title:'Source-bound conditional private arithmetic',category:'private-source-components',version:1,riskClass:'tax',reviewStatus:'draft',inputSchema:schema,
 calculate:(raw:ConditionalInput)=>{const p=schema.parse(raw);let o:Output;
 switch(p.profile){
 case 'rmd-2026-age75-tableIII':o={exactRmdUSD:formatRational(divide(decimal(p.balanceUSD),rational(246n,10n))),divisor:'24.6',ordinaryDeadline:'2026-12-31'};break;
 case 'roth-2025-unphased-contribution':o={contributionMaximumUSD:asMoney(min(700000n,cents(p.taxableCompensationUSD)))};break;
 case 'ira-2025-covered-deduction':{const m=cents(p.magiUSD),c=cents(p.contributionUSD),a=cents(p.adjustedCompensationUSD);let cap=700000n;if(m>=8900000n)cap=0n;else if(m>7900000n){const numerator=(8900000n-m)*70n;cap=max(20000n,((numerator+99999n)/100000n)*1000n);}const deduction=min(cap,c,a);o={deductionMaximumUSD:asMoney(deduction),nondeductibleWorksheetUSD:asMoney(min(c,a)-deduction)};break;}
 case 'uk-corporation-fy2026-n-equals-a':{const n=cents(p.profitsNGBP);const numerator=n<=5000000n?n*380n:n<=25000000n?n*500n-(25000000n-n)*30n:n*500n;o={computationalTaxGBP:formatRational(rational(numerator,200000n))};break;}
 }
 return z.record(z.string(),z.string().max(500)).parse(o);
 },formulas:Object.freeze(conditionalProfiles.map(p=>Object.freeze({id:p.profile,expression:p.formula,description:p.deferred}))),sources:Object.freeze(conditionalProfiles.map(p=>Object.freeze({label:p.source,url:p.url,note:'Frozen normalized capture; publisher-byte identity not claimed. Conditional arithmetic only, not tax eligibility or qualified applicability acceptance.'}))),examples:Object.freeze([])});
const common={mode:'conditional-private-arithmetic',currency:'USD',evidenceReference:'synthetic-fixture-not-a-real-taxpayer'} as const;
const ira={...common,taxYear:2025,filingStatus:'single',under50:true,originalOwner:true,otherIraContributions:false,spousalCompensation:false,excessContributions:false,conversionOrInherited:false,timelyEligibleContribution:true,taxableCompensationUSD:'200000',magiUSD:'80000'} as const;
export const conditionalExamples:Readonly<Record<number,ConditionalInput>>=copyCalculationData({examples:{
 95:{...common,profile:'rmd-2026-age75-tableIII',taxYear:2026,ageAtBirthday:75,account:'traditional-IRA',livingOriginalOwner:true,table:'III',spouseSoleBeneficiaryMoreThanTenYearsYounger:false,balanceDate:'2025-12-31',firstRmdYear:false,unsupportedBalanceAdjustments:false,annuityOrAggregation:false,balanceUSD:'100000'},
 97:{...ira,profile:'roth-2025-unphased-contribution'},
 98:{...ira,profile:'ira-2025-covered-deduction',employerCovered:true,receivedSocialSecurityBenefits2025:false,basisOrDistributionBranch:false,adjustedCompensationUSD:'200000',contributionUSD:'7000'},
 132:{evidenceReference:common.evidenceReference,mode:common.mode,currency:'GBP',profile:'uk-corporation-fy2026-n-equals-a',periodStart:'2026-04-01',periodEnd:'2027-03-31',ukResident:true,ordinaryNonRingFence:true,closeInvestmentHolding:false,associates:0,specialRegimesOrForeignDistributions:false,profitsNGBP:'100000',augmentedProfitsAGBP:'100000'}
}},{}).input.examples as Readonly<Record<number,ConditionalInput>>;
export function exportConditional(input:unknown,plan:'free'|'pro'|'business'='free'){
 z.enum(['free','pro','business']).parse(plan);const run=runCalculator(calculation,input),profile=metadata(run.input);
 const governance={relatedCatalogId:profile.id,canonicalImplementationClass:'CONTRACT_BLOCKED',canonicalAccepted:false,canonicalMappingApproved:false,qualifiedApplicability:'UNRESOLVED',inputEvidenceMeaning:'Reference is supplied, not authenticated or legally determined by this engine; synthetic examples are not verified real-account facts.',releaseHold:true,certificationAuthorized:false as boolean,publicationAuthorized:false as boolean};
 const envelope={schemaVersion:1,profileId:profile.profile,source,methodology:profile,governance,calculation:createCalculationSnapshot({calculatorSlug:calculation.slug+'-'+profile.id,calculatorVersion:calculation.version,input:run.input,output:run.output})};return copyCalculationData({envelope},{}).input.envelope as typeof envelope;
}
export function importConditional(raw:unknown){const s=copyCalculationData({envelope:raw},{}).input.envelope as ReturnType<typeof exportConditional>;if(!s?.calculation)throw Error('Missing calculation');const expected=exportConditional(s.calculation.input);if(!equalCompletionJson(s,expected))throw Error('Snapshot differs from immutable source, profile, version, governance or recomputed output');return expected;}
