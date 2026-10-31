/** Explicit verification only. Never rewrite history, change versions or grant lifecycle approval. */
import {z} from 'zod';
import type {CalculatorDefinition} from '@/calculators/types';
import {percentageCalculator} from '@/calculators/core/percentage';
import {unitConversionCalculator} from '@/calculators/core/unit-conversion';
import {simpleInterestCalculator} from '@/calculators/finance/simple-interest';
import {bmiCalculator} from '@/calculators/health/bmi';
import {runCalculator} from '@/calculators/engine';
import {copyCalculationData,createCalculationSnapshot,type CalculationSnapshot} from './calculation-snapshot';
import {sameRecordedJson as equalCompletionJson} from './recorded-json-equality';
import {sipCalculator} from '@/calculators/finance/sip';
import {compoundInterestCalculator} from '@/calculators/finance/compound-interest';
import {mortgageCalculator} from '@/calculators/finance/mortgage';
import {loanAnalysisCalculator} from '@/calculators/finance/loan-analysis';
import {loanPaymentCalculator} from '@/calculators/finance/loan-payment';
import {sipPeriodResult,compoundPeriodResult,investmentPeriodExport} from '@/calculators/final-framework/investment-periods';
import {sipRegisteredRateAnalysis,compoundRegisteredRateAnalysis,loanRegisteredRateAnalysis,registeredRateExport} from '@/calculators/final-framework/registered-rate-analysis';
import {buildMortgageRateAnalysis} from '@/calculators/final-framework/mortgage-rate-analysis';
export const registeredReplaySlugs=Object.freeze(['mortgage-payment','bmi-calculator','sip-calculator','loan-emi-calculator','loan-payment-calculator','percentage-of-value-calculator','simple-interest-calculator','compound-interest-calculator','unit-conversion-calculator']);
const shape=z.object({calculatorSlug:z.string().min(1).max(200),calculatorVersion:z.number().int().positive(),input:z.record(z.string(),z.unknown()),output:z.record(z.string(),z.unknown())}).strict();
export function verifyRegisteredSnapshot(raw:unknown):Readonly<{snapshot:CalculationSnapshot;engineId:string;engineVersion:number;scope:string}>{
 const clean=copyCalculationData({value:raw},{}).input.value,snapshot=createCalculationSnapshot(shape.parse(clean));
 if(!registeredReplaySlugs.includes(snapshot.calculatorSlug))throw Error('Exact-engine verification is unavailable for this recorded contract; original history remains readable.');
 const definitions=[percentageCalculator,unitConversionCalculator,simpleInterestCalculator,bmiCalculator,mortgageCalculator,sipCalculator,loanAnalysisCalculator,loanPaymentCalculator,compoundInterestCalculator] as unknown as readonly CalculatorDefinition<Record<string,unknown>,Record<string,unknown>>[];
 const definition=definitions.find(d=>d.slug===snapshot.calculatorSlug);
 if(!definition||definition.version!==snapshot.calculatorVersion)throw Error('This historical engine version is not in the replay allowlist; no upgrade is applied.');
 const input=definition.inputSchema.parse(snapshot.input) as Record<string,unknown>;
 if(Object.keys(snapshot.input).some(key=>!Object.hasOwn(input,key)))throw Error('The recorded input has unsupported fields for this forward-engine contract; original history is unchanged.');
 const core=runCalculator(definition,input).output as Record<string,unknown>;let expected:Record<string,unknown>=core;
 if(definition.slug===sipCalculator.slug){const p=sipCalculator.inputSchema.parse(input),out=runCalculator(sipCalculator,p).output;if(Object.hasOwn(snapshot.output,'periodProjection'))expected=investmentPeriodExport(out,sipPeriodResult(p,out));if(Object.hasOwn(snapshot.output,'rateAnalysis'))expected=registeredRateExport(expected,sipRegisteredRateAnalysis(p),sipCalculator,{key:'futureValue',label:'Future value'});}
 if(definition.slug===compoundInterestCalculator.slug){const p=compoundInterestCalculator.inputSchema.parse(input),out=runCalculator(compoundInterestCalculator,p).output;if(Object.hasOwn(snapshot.output,'periodProjection'))expected=investmentPeriodExport(out,compoundPeriodResult(p,out));if(Object.hasOwn(snapshot.output,'rateAnalysis'))expected=registeredRateExport(expected,compoundRegisteredRateAnalysis(p),compoundInterestCalculator,{key:'futureValue',label:'Future value'});}
 if(definition.slug===loanAnalysisCalculator.slug||definition.slug===loanPaymentCalculator.slug){if(Object.hasOwn(snapshot.output,'rateAnalysis')){const canonical=definition.slug===loanAnalysisCalculator.slug;const p=canonical?loanAnalysisCalculator.inputSchema.parse(input):loanPaymentCalculator.inputSchema.parse(input);expected=registeredRateExport(expected,loanRegisteredRateAnalysis(p,canonical),definition,{key:'totalInterest',label:'Total interest'});}}
 if(definition.slug===mortgageCalculator.slug){const p=mortgageCalculator.inputSchema.parse(input);if(Object.hasOwn(snapshot.output,'mortgageContext')){const context=z.object({version:z.literal(1),propertyPrice:z.number().finite().positive(),downPayment:z.number().finite().min(0),scope:z.literal('principal-and-interest-only')}).strict().parse(snapshot.output.mortgageContext);if(context.propertyPrice-context.downPayment!==p.principal)throw Error('Recorded property/down-payment context does not reconcile to principal.');expected={...expected,mortgageContext:context};}if(Object.hasOwn(snapshot.output,'rateAnalysis'))expected={...expected,rateAnalysis:buildMortgageRateAnalysis(p)};}
 if(!equalCompletionJson(expected,snapshot.output))throw Error('Recorded output or presentation data does not match its exact immutable engine; original history is unchanged.');
 return Object.freeze({snapshot,engineId:definition.id,engineVersion:definition.version,scope:'Exact forward-engine arithmetic (including its original schema defaults) and supported presentation agreement only. This does not establish canonical acceptance, qualified applicability, certification or publication.'});
}
