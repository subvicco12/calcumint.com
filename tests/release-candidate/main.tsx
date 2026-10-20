import {createRoot} from 'react-dom/client';
import {CalculatorInteractive} from '../../src/components/calculator-interactive';
import {useCalculatorPlan} from '../../src/components/use-calculator-plan';
import {calculatorRegistry} from '../../src/calculators/registry';
import {runCalculator} from '../../src/calculators/engine';
import {displayFinalValue} from '../../src/calculators/final-framework/renderer-display';
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
function Fixture(){const plan=useCalculatorPlan();return <main className="container" style={{padding:'1rem',maxWidth:1100,margin:'auto'}}><p>Private synthetic reference review. Real authentication unverified.</p><h1>{slug}</h1><output data-testid="resolved-plan">{plan}</output><CalculatorInteractive slug={slug}/><button type="button" id="other-control">Other control</button></main>;}
createRoot(document.getElementById('root')!).render(<Fixture/>);
