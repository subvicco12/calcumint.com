import { expect, it } from 'vitest';
import { buildMortgageRateAnalysis } from './mortgage-rate-analysis';
import { mortgageCalculator } from '../finance/mortgage';
import { runCalculator } from '../engine';
import { serializeCalculationCsv } from '@/lib/calculation-export';
it.each([0,6.5,1000])('preserves every requested rate and delegated aggregate at %s',annualRatePercent=>{
 const input={principal:320000,annualRatePercent,termMonths:360},analysis=buildMortgageRateAnalysis(input);
 expect(analysis.version).toBe(1);expect(analysis.kind).toBe('aggregate-rate-comparison');
 expect(analysis.scenarios).toHaveLength(3);expect(analysis.sensitivity).toHaveLength(5);
 for(const candidate of [...analysis.scenarios,...analysis.sensitivity]){
  if(candidate.state==='available')expect(candidate.output).toEqual(runCalculator(mortgageCalculator,candidate.input).output);
  else expect(()=>runCalculator(mortgageCalculator,candidate.input)).toThrow();
 }
 const baseline=analysis.scenarios.find(c=>c.baseline)!;expect(baseline.state).toBe('available');
 if(baseline.state==='available')expect(baseline.output).toEqual(runCalculator(mortgageCalculator,input).output);
 expect(analysis.scenarios.filter(c=>c.state==='unavailable')).toHaveLength(annualRatePercent===6.5?0:1);
 const csv=serializeCalculationCsv(input,{rateAnalysis:analysis});expect(csv).toContain('aggregate-rate-comparison');expect(csv).not.toContain('NaN');
});
it('rejects invalid baseline instead of inventing valid offset results',()=>{
 expect(()=>buildMortgageRateAnalysis({principal:0,annualRatePercent:6,termMonths:360})).toThrow();
 expect(()=>buildMortgageRateAnalysis({principal:100,annualRatePercent:1e-300,termMonths:360})).toThrow();
});
it('preserves nested raw precision and formula-safe CSV cells without treating comparisons as periods',()=>{
 const input={principal:123456.789,annualRatePercent:0.001,termMonths:37};const analysis=buildMortgageRateAnalysis(input);
 const csv=serializeCalculationCsv({...input,note:'=SUM(1,2)'},{rateAnalysis:analysis});
 expect(csv).toContain("'=" );expect(csv).toContain('123456.789');expect(csv).toContain('0.001');expect(csv).not.toContain('amortization');
 const encoded=JSON.stringify(analysis);for(const point of analysis.scenarios)if(point.state==='available')expect(encoded).toContain(JSON.stringify(point.output));
});
