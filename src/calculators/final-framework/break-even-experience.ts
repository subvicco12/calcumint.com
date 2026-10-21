import Decimal from 'decimal.js';
import {breakEvenCalculator} from '../business/break-even';
import {targetProfitUnitsCalculator} from '../business/catalog-batch-1';
import {runCalculator} from '../engine';

// DRAFT presentation projection. Does not replace either immutable v1 engine.
// Source contracts: SBA contribution margin and existing target-profit-units.
// All monetary inputs must share a currency/measurement period; none is inferred.
const D=Decimal.clone({precision:80,rounding:Decimal.ROUND_HALF_UP});
type Inputs={fixedCosts:number;pricePerUnit:number;variableCostPerUnit:number};
export type BreakEvenPoint={units:number;revenue:number;cost:number;profit:number};
const finite=(value:Decimal)=>{
 const number=value.toNumber();
 if(!Number.isFinite(number)||(!value.isZero()&&number===0))throw new Error('Projection is outside the supported finite range');
 return number;
};
export function buildBreakEvenProjection(raw:Inputs){
 const {input,output}=runCalculator(breakEvenCalculator,raw);
 if(!Object.values(output).every(Number.isFinite))throw new Error('Core result is outside the supported finite range');
 const fixed=new D(input.fixedCosts),price=new D(input.pricePerUnit),variable=new D(input.variableCostPerUnit),margin=price.minus(variable);
 const crossover=fixed.div(margin);
 // A projection must not silently supersede the historical engine's rounding.
 if(crossover.toDecimalPlaces(2).toNumber()!==output.breakEvenUnits||crossover.times(price).toDecimalPlaces(2).toNumber()!==output.breakEvenRevenue)throw new Error('Projection does not reconcile with the historical engine rounding');
 const points:BreakEvenPoint[]=fixed.isZero()?[0,1,2].map(units=>({units,revenue:finite(price.times(units)),cost:finite(variable.times(units)),profit:finite(margin.times(units))})):[0,0.5,1,2].map(factor=>{
  const units=crossover.times(factor),revenue=units.times(price);
  // P(q)=q(p-v)-F. At q=kF/(p-v), P=F(k-1), exactly;
  // evaluate that identity, not a cancellation-prone rounded subtraction.
  const profit=fixed.times(new D(factor).minus(1)),cost=revenue.minus(profit);
  return {units:finite(units),revenue:finite(revenue),cost:finite(cost),profit:finite(profit)};
 });
 return {points,threshold:{units:output.breakEvenUnits,revenue:output.breakEvenRevenue}};
}
export function solveBreakEvenTargetProfit(raw:Inputs&{targetProfit:number}){
 const {input,output}=runCalculator(targetProfitUnitsCalculator,raw);
 const units=output.value;
 if(!Number.isFinite(units)||(units===0&&(input.fixedCosts>0||input.targetProfit>0)))throw new Error('Target quantity is outside the supported six-decimal precision');
 const revenue=new D(units).times(input.pricePerUnit),cost=new D(input.fixedCosts).plus(new D(units).times(input.variableCostPerUnit)),profit=revenue.minus(cost);
 return {requiredUnits:units,revenue:finite(revenue),cost:finite(cost),profit:finite(profit),residual:finite(profit.minus(input.targetProfit))};
}
