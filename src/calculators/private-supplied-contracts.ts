import {z} from 'zod';
import type {CalculatorDefinition} from './types';
import {createCalculationSnapshot} from '../lib/calculation-snapshot';
import {runCalculator} from './engine';
import {SUPPLIED_COMPONENT_CONTRACTS,compareSuppliedLedgers,projectSuppliedBalance,suppliedRatioPercent,suppliedLeaseBase,suppliedHeatSavings,suppliedWeightedMean,suppliedPriceFactor} from './source-driven-components';

// Private engineering contracts for supplied-input scenarios, never canonical
// substitutes for the candidate IDs. No registry, routes or lifecycle imports.
const finite=z.number().finite(),nonnegative=finite.nonnegative(),positive=finite.positive();
const count=finite.int().min(0).max(10000),rate=finite.gt(-1);
const basis={currency:z.string().trim().min(1).max(160),period:z.string().trim().min(1).max(160)};
const ledger=z.object({...basis,horizon:count,flows:z.array(z.object({at:count,outflow:finite}).strict()).max(10000),terminalDebt:nonnegative,terminalAsset:nonnegative}).strict();
const schemas={
 'supplied-ledger-comparison':z.object({left:ledger,right:ledger,discountRate:rate}).strict(),
 'supplied-balance-projection':z.object({...basis,initial:nonnegative,timing:z.enum(['begin','end']),steps:z.array(z.object({rate,cashflow:finite}).strict()).max(10000)}).strict(),
 'supplied-ratio-percent':z.object({...basis,numerator:finite,denominator:positive}).strict(),
 'supplied-lease-base':z.object({...basis,capitalized:nonnegative,residual:nonnegative,rentCharge:nonnegative,payments:count.min(1)}).strict(),
 'supplied-heat-balance':z.object({...basis,usefulHeatKWh:nonnegative,baselineEfficiency:positive.max(1),scop:positive,baselinePricePerKWh:nonnegative,heatPumpPricePerKWh:nonnegative,auxiliaryKWh:nonnegative}).strict(),
 'supplied-weighted-mean':z.object({rows:z.array(z.object({value:finite,weight:nonnegative}).strict()).min(1).max(10000)}).strict(),
 'supplied-price-factor':z.object({...basis,amount:nonnegative,rate:nonnegative,mode:z.enum(['exclusive','inclusive'])}).strict(),
};
type Id=keyof typeof schemas;
const expression:Record<Id,string>={
 'supplied-ledger-comparison':'PV = sum(outflow[t] / (1+r)^t) + (terminalDebt-terminalAsset)/(1+r)^H; difference = left-right',
 'supplied-balance-projection':'Apply supplied return before/after supplied cashflow; cap withdrawals at available balance',
 'supplied-ratio-percent':'percent = numerator / denominator * 100',
 'supplied-lease-base':'basePayment = (capitalized - residual + disclosedRentCharge) / payments',
 'supplied-heat-balance':'savings = usefulHeat / efficiency * baselinePrice - (usefulHeat / SCOP + externalAuxiliary) * electricityPrice',
 'supplied-weighted-mean':'mean = sum(value * weight) / sum(weight)',
 'supplied-price-factor':'exclusive: net=amount; inclusive: net=amount/(1+rate); tax=net*rate; gross=net+tax',
};
function calculate(id:Id,raw:unknown):Record<string,unknown>{
 // Direct callers receive the same validation as runCalculator callers.
 switch(id){
  case 'supplied-ledger-comparison':{const p=schemas[id].parse(raw);return compareSuppliedLedgers(p.left,p.right,p.discountRate);}
  case 'supplied-balance-projection':return projectSuppliedBalance(schemas[id].parse(raw));
  case 'supplied-ratio-percent':return {percent:suppliedRatioPercent(schemas[id].parse(raw))};
  case 'supplied-lease-base':return {basePayment:suppliedLeaseBase(schemas[id].parse(raw))};
  case 'supplied-heat-balance':return {savings:suppliedHeatSavings(schemas[id].parse(raw))};
  case 'supplied-weighted-mean':return {mean:suppliedWeightedMean(schemas[id].parse(raw).rows)};
  case 'supplied-price-factor':return suppliedPriceFactor(schemas[id].parse(raw));
 }
}
const b={currency:'USD',period:'month'};
const l={...b,horizon:0,flows:[{at:0,outflow:10}],terminalDebt:0,terminalAsset:0};
const examples:Record<Id,{input:Record<string,unknown>;expected:Record<string,unknown>}>= {
 'supplied-ledger-comparison':{input:{left:l,right:{...l,flows:[]},discountRate:0},expected:{left:10,right:0,difference:10}},
 'supplied-balance-projection':{input:{...b,initial:100,timing:'end',steps:[{rate:0,cashflow:-100}]},expected:{balance:0,exactZeroPeriod:1,firstShortfallPeriod:null}},
 'supplied-ratio-percent':{input:{...b,numerator:25,denominator:200},expected:{percent:12.5}},
 'supplied-lease-base':{input:{...b,capitalized:18800,residual:12350,rentCharge:5295,payments:48},expected:{basePayment:244.6875}},
 'supplied-heat-balance':{input:{...b,usefulHeatKWh:10000,baselineEfficiency:1,scop:4,baselinePricePerKWh:.1,heatPumpPricePerKWh:.3,auxiliaryKWh:100},expected:{savings:220}},
 'supplied-weighted-mean':{input:{rows:[{value:4,weight:1},{value:0,weight:1}]},expected:{mean:2}},
 'supplied-price-factor':{input:{...b,amount:100,rate:.15,mode:'exclusive'},expected:{net:100,tax:15,gross:115}},
};
export const privateSuppliedDefinitions:readonly CalculatorDefinition<unknown,Record<string,unknown>>[]=Object.freeze(SUPPLIED_COMPONENT_CONTRACTS.map(c=>{
 const id=c.id as Id;
 return Object.freeze({id:`private.${id}`,slug:`private-${id}`,title:`Private ${id.slice(9).replaceAll('-',' ')} scenario`,category:'private-supplied-scenarios',version:1,riskClass:'standard',reviewStatus:'draft',inputSchema:schemas[id],calculate:(raw:unknown)=>calculate(id,raw),
  formulas:Object.freeze([{id,expression:expression[id],description:`${c.units}. ${c.assumptions.join('. ')}. ${c.limits}. Unrounded IEEE-754 engineering values; no currency display rounding selected.`}]),
  sources:Object.freeze([{label:'Preserved supplied-arithmetic contract and provenance',note:'data/catalog/source-driven-2026-10-27/README.md; engineering-register.json. Source observations are not publisher-byte captures or normative acceptance. RELEASE HOLD.'}]),
  examples:Object.freeze([{label:'Independent supplied-input arithmetic witness',...examples[id]}]),
 });
}));
/** Copy and freeze the validated actual-engine result; never trust supplied output.
 * Re-execution also rejects a snapshot whose output belongs to another input. */
export function exportPrivateSuppliedRun(definition:CalculatorDefinition<unknown,Record<string,unknown>>,input:unknown,output:Record<string,unknown>){
 if(!privateSuppliedDefinitions.includes(definition))throw new Error('Unknown private supplied contract');
 const run=runCalculator(definition,input);
 const snapshot=createCalculationSnapshot({calculatorSlug:definition.slug,calculatorVersion:definition.version,input:run.input as Record<string,unknown>,output});
 if(JSON.stringify(snapshot.output)!==JSON.stringify(run.output))throw new Error('Output does not match the validated engine result');
 return snapshot;
}
export const suppliedCaseBindings=Object.freeze([...new Set(SUPPLIED_COMPONENT_CONTRACTS.flatMap(c=>[...c.candidateIds]))].sort((a,b)=>a-b).map(masterId=>Object.freeze({masterId,contractIds:Object.freeze(SUPPLIED_COMPONENT_CONTRACTS.filter(c=>(c.candidateIds as readonly number[]).includes(masterId)).map(c=>`private.${c.id}`)),canonicalScopeAdopted:false as const,publicationAuthorized:false as const})));
