import { mortgageCalculator } from '../finance/mortgage';
import { runCalculator } from '../engine';

type MortgageInput = Parameters<typeof mortgageCalculator.calculate>[0];
type MortgageOutput = ReturnType<typeof mortgageCalculator.calculate>;
export type MortgageRateCandidate = {
 id: string; input: MortgageInput; baseline: boolean;
} & ({state:'available';output:MortgageOutput}|{state:'unavailable';reason:'outside-supported-inputs'|'nonfinite-result'});
export type MortgageRateAnalysis = {
 version:1;kind:'aggregate-rate-comparison';calculatorId:typeof mortgageCalculator.id;calculatorVersion:typeof mortgageCalculator.version;
 scenarios:readonly MortgageRateCandidate[];sensitivity:readonly MortgageRateCandidate[];
};

/** Independent aggregate evaluations; these are never amortization periods or an ownership-cost model. */
export function buildMortgageRateAnalysis(input:MortgageInput):MortgageRateAnalysis {
 // The baseline must be a valid, finite engine result before any comparison is offered.
 const run=runCalculator(mortgageCalculator,input);
 input=run.input;
 const baseline=run.output;
 if(!Object.values(baseline).every(Number.isFinite))throw new Error('Invalid Mortgage baseline');
 const candidate=(offset:number):MortgageRateCandidate=>{
  const requested={...input,annualRatePercent:input.annualRatePercent+offset};
  const identity={id:String(offset),input:requested,baseline:offset===0};
  if(!mortgageCalculator.inputSchema.safeParse(requested).success)return {...identity,state:'unavailable',reason:'outside-supported-inputs'};
  try{
   const output=offset===0?baseline:runCalculator(mortgageCalculator,requested).output;
   if(!Object.values(output).every(Number.isFinite))throw new Error('Nonfinite Mortgage output');
   return {...identity,state:'available',output};
  }catch{return {...identity,state:'unavailable',reason:'nonfinite-result'};}
 };
 return {version:1,kind:'aggregate-rate-comparison',calculatorId:mortgageCalculator.id,calculatorVersion:mortgageCalculator.version,scenarios:[-1,0,1].map(candidate),sensitivity:[-2,-1,0,1,2].map(candidate)};
}
