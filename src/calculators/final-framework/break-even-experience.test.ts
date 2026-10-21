import {expect,it} from 'vitest';
import {buildBreakEvenProjection,solveBreakEvenTargetProfit} from './break-even-experience';
import {breakEvenCalculator} from '../business/break-even';
import {runCalculator} from '../engine';
const input={fixedCosts:10000,pricePerUnit:50,variableCostPerUnit:30};
it('matches independent linear-model vectors: q=0,250,500,1000; revenue=50q; cost=10000+30q',()=>{
 expect(buildBreakEvenProjection(input).points).toEqual([
 {units:0,revenue:0,cost:10000,profit:-10000},{units:250,revenue:12500,cost:17500,profit:-5000},
 {units:500,revenue:25000,cost:25000,profit:0},{units:1000,revenue:50000,cost:40000,profit:10000}]);
});
it('retains independent engine rounding for fractional crossover and labels amounts without a currency assumption',()=>{
 const data=buildBreakEvenProjection({fixedCosts:1,pricePerUnit:4,variableCostPerUnit:1});expect(data.threshold).toEqual({units:0.33,revenue:1.33});expect(data.points[2]).toEqual({units:1/3,revenue:4/3,cost:4/3,profit:0});
});
it('handles zero fixed costs with zero crossover and a useful nonzero sample domain',()=>{
 expect(buildBreakEvenProjection({fixedCosts:0,pricePerUnit:4,variableCostPerUnit:1}).points).toEqual([{units:0,revenue:0,cost:0,profit:0},{units:1,revenue:4,cost:1,profit:3},{units:2,revenue:8,cost:2,profit:6}]);
});
it('preserves tiny nonzero values and negative modeled profits',()=>{
 const p=buildBreakEvenProjection({fixedCosts:0.000001,pricePerUnit:0.000004,variableCostPerUnit:0.000001});expect(p.points[0].profit).toBe(-0.000001);expect(p.points[2].revenue).toBeCloseTo(0.000004/3,18);
});
for(const plan of ['free','pro','business']as const)it(`${plan} uses unchanged deterministic core and existing target-profit contract`,()=>{
 const core=runCalculator(breakEvenCalculator,{...input,plan}).output;expect(buildBreakEvenProjection(input).threshold.units).toBe(core.breakEvenUnits);
 expect(solveBreakEvenTargetProfit({...input,targetProfit:5000})).toMatchObject({requiredUnits:750,revenue:37500,cost:32500,profit:5000,residual:0});
 expect(solveBreakEvenTargetProfit({...input,targetProfit:0}).requiredUnits).toBe(500);
});
it('reports existing six-place continuous-unit precision rather than promising whole-unit or exact profit',()=>{
 const result=solveBreakEvenTargetProfit({fixedCosts:1,pricePerUnit:4,variableCostPerUnit:1,targetProfit:1});expect(result.requiredUnits).toBe(0.666667);expect(result.profit).toBe(1.000001);expect(result.residual).toBe(0.000001);
});
it('rejects invalid domains, nonfinite projections and unrepresentable target quantities',()=>{
 for(const bad of [NaN,Infinity,-1])expect(()=>buildBreakEvenProjection({...input,fixedCosts:bad})).toThrow();
 expect(()=>buildBreakEvenProjection({...input,pricePerUnit:30})).toThrow();
 expect(()=>buildBreakEvenProjection({fixedCosts:1e308,pricePerUnit:1,variableCostPerUnit:0})).toThrow();
 for(const targetProfit of [NaN,Infinity,-1,1e16])expect(()=>solveBreakEvenTargetProfit({...input,targetProfit})).toThrow();
 expect(()=>solveBreakEvenTargetProfit({fixedCosts:0,targetProfit:1,pricePerUnit:1e15,variableCostPerUnit:0})).toThrow();
});
