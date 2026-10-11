import { expect,it } from 'vitest';
import evidence from '../../../docs/MORTGAGE-SPECIALIST-REVIEW-VECTORS.json';
import { mortgageCalculator } from '../finance/mortgage';
import { runCalculator } from '../engine';
it.each(evidence.vectors)('keeps reviewer vector $id tied to actual proposed v1 engine behavior',vector=>{
 expect(evidence.calculatorId).toBe(mortgageCalculator.id);expect(evidence.calculatorVersion).toBe(mortgageCalculator.version);
 if(vector.outcome==='rejected')expect(()=>runCalculator(mortgageCalculator,vector.input)).toThrow();
 else expect(runCalculator(mortgageCalculator,vector.input).output).toEqual(vector.output);
});
it('documents why the other engine period rows cannot authorize Mortgage reconciliation',async()=>{
 const {loanAnalysisCalculator}=await import('../finance/loan-analysis');const comparison=evidence.incompatiblePeriodEngineObservation;
 const output=runCalculator(loanAnalysisCalculator,comparison.input).output;
 expect(comparison.output).toEqual({monthlyPayment:output.monthlyPayment,totalPayment:output.totalPayment,totalInterest:output.totalInterest,payoffMonths:output.payoffMonths,terminalBalance:output.amortization.at(-1)!.balance});
 expect(output.totalInterest).not.toBe(evidence.vectors.find(v=>v.id==='zero-rate-rounded-total')!.output!.totalInterest);
});
