import {createRoot} from 'react-dom/client';
import {CalculatorInteractive} from '../../src/components/calculator-interactive';
import {useCalculatorPlan} from '../../src/components/use-calculator-plan';
import {calculatorRegistry} from '../../src/calculators/registry';
import {runCalculator} from '../../src/calculators/engine';
import {displayFinalValue} from '../../src/calculators/final-framework/renderer-display';
import {FinalResultPresentation} from '../../src/components/final-result-presentation';
import type {StructuredCalculationResult} from '../../src/calculators/final-framework/types';
import {synthetic} from './synthetic-client';
import {requiredMonthlySip} from '../../src/calculators/finance/sip';
import '../../src/app/globals.css';
const defaults:Record<string,Record<string,unknown>>={
 'loan-emi-calculator':{principal:100000,annualRatePercent:6,termMonths:360,extraMonthlyPayment:0},
 'sip-calculator':{monthlyContribution:500,annualReturnPercent:8,termMonths:120,contributionTiming:'beginning'},
 'compound-interest-calculator':{principal:10000,annualRatePercent:5,years:10,compoundsPerYear:12},
 'mortgage-payment':{principal:320000,annualRatePercent:6.5,termMonths:360},
 'bmi-calculator':{weightKg:70,heightCm:175},
 'break-even-calculator':{fixedCosts:10000,pricePerUnit:50,variableCostPerUnit:30}
};
const keys:Record<string,string>={'loan-emi-calculator':'monthlyPayment','sip-calculator':'futureValue','compound-interest-calculator':'futureValue','mortgage-payment':'monthlyPayment','bmi-calculator':'bmi','break-even-calculator':'breakEvenUnits'};
const slug=new URLSearchParams(location.search).get('slug')??'loan-emi-calculator';
if(!Object.hasOwn(defaults,slug))throw Error('Unsupported reference fixture');
function evaluate(input=defaults[slug]){const definition=calculatorRegistry.getBySlug(slug);if(!definition)throw Error('Unregistered reference');return runCalculator(definition,input).output as Record<string,unknown>;}
function expectedScheduleTerminal(){const output=evaluate();let values:unknown[]=[];if(slug==='loan-emi-calculator'){const last=(output.amortization as {month:number;payment:number;principal:number;interest:number;balance:number}[]).at(-1)!;values=[last.month,last.payment,last.principal,last.interest,last.balance];}else if(slug==='sip-calculator')values=[defaults[slug].termMonths,output.investedAmount,output.estimatedGain,output.futureValue];else if(slug==='compound-interest-calculator')values=[defaults[slug].years,String(defaults[slug].years),output.totalInterest,output.futureValue];return values.map(value=>displayFinalValue(value as string|number));}
const oracle={defaults:defaults[slug],evaluate,expectedScheduleTerminal,reverseContribution:displayFinalValue(requiredMonthlySip(100000,8,120,'beginning')),expectedHeadline:displayFinalValue(evaluate()[keys[slug]] as number)};
Object.assign(window,{__reference:{synthetic,oracle}});
const probeResult:StructuredCalculationResult={primaryResult:{id:'total',label:'Total',value:30},schedule:[{id:'a',period:1,values:{principal:10,interest:20}},{id:'b',period:2,values:{interest:3,principal:7}},{id:'c',period:3,values:{interest:0,fee:-0.0001}}]};
function ScheduleProbe(){return <main className="container" style={{padding:'1rem',maxWidth:1100,margin:'auto'}}><h1>Private schedule contract probe</h1><section aria-label="Legacy schedule probe"><FinalResultPresentation result={probeResult} plan="pro"/></section><section aria-label="Metadata schedule probe"><FinalResultPresentation plan="business" result={{...probeResult,schedule:probeResult.schedule!.slice(0,2),scheduleMetadata:{caption:'Declared amounts',period:{key:'month',label:'Month',unit:'months'},columns:[{key:'interest',label:'Interest',unit:'EUR'},{key:'principal',label:'Principal',unit:'EUR'}],granularity:'checkpoints'}}}/></section></main>;}
function Fixture(){const plan=useCalculatorPlan();return <main className="container" style={{padding:'1rem',maxWidth:1100,margin:'auto'}}><p>Private synthetic reference review. Real authentication unverified.</p><h1>{slug}</h1><output data-testid="resolved-plan">{plan}</output><CalculatorInteractive slug={slug}/><button type="button" id="other-control">Other control</button></main>;}
createRoot(document.getElementById('root')!).render(new URLSearchParams(location.search).get('probe')==='schedule'?<ScheduleProbe/>:<Fixture/>);
