// @vitest-environment jsdom
import {cleanup,fireEvent,render,screen,within} from '@testing-library/react';
import {afterEach,expect,it,vi} from 'vitest';
import type {PlanTier} from '@/calculators/final-framework/types';
import {runCalculator} from '@/calculators/engine';
import {loanPaymentCalculator} from '@/calculators/finance/loan-payment';
import {sipCalculator} from '@/calculators/finance/sip';
import {compoundInterestCalculator} from '@/calculators/finance/compound-interest';
import {displayFinalValue} from '@/calculators/final-framework/renderer-display';
const state=vi.hoisted(()=>({plan:'free' as PlanTier,account:null as null|{calculatorSlug:string;calculatorVersion:number;input:Record<string,unknown>;output:Record<string,unknown>|null}}));
vi.mock('./use-calculator-plan',()=>({useCalculatorPlan:()=>state.plan}));
vi.mock('./calculator-account-actions',()=>({CalculatorAccountActions:(props:typeof state.account)=>{state.account=props;return null;}}));
import {CalculatorInteractive} from './calculator-interactive';
afterEach(cleanup);
it.each(['free','pro','business'] as const)('preserves valid SIP core at its upper rate boundary on %s and contains unavailable requests',plan=>{
 state.plan=plan;render(<CalculatorInteractive slug="sip-calculator"/>);fireEvent.change(screen.getByLabelText('Term (months)'),{target:{value:'1'}});fireEvent.change(screen.getByLabelText('Modeled annual return (%)'),{target:{value:'1000'}});fireEvent.click(screen.getByRole('button',{name:'Advanced'}));
 const expected=runCalculator(sipCalculator,{monthlyContribution:500,annualReturnPercent:1000,termMonths:1,contributionTiming:'beginning'}).output;
 expect(document.querySelector('.result-box')?.textContent).toContain(displayFinalValue(expected.futureValue));expect(state.account).toMatchObject({calculatorSlug:sipCalculator.slug,calculatorVersion:sipCalculator.version,output:expected});
 if(plan!=='free'){expect(screen.getByRole('rowheader',{name:/Annual return: 1,000 %.*Baseline/})).toBeTruthy();expect(screen.getByRole('alert').textContent).toContain('1,001');expect(screen.getByRole('alert').textContent).toContain('1,002');}
 fireEvent.change(screen.getByLabelText('Modeled annual return (%)'),{target:{value:'8'}});expect(screen.queryByRole('alert')).toBeNull();
});
it.each(['pro','business'] as const)('uses the ordinary LoanPayment authority for rate comparisons on %s',plan=>{
 state.plan=plan;render(<CalculatorInteractive slug={loanPaymentCalculator.slug}/>);fireEvent.change(screen.getByLabelText('Loan principal'),{target:{value:'320000'}});fireEvent.change(screen.getByLabelText('Annual rate (%)'),{target:{value:'0'}});fireEvent.click(screen.getByRole('button',{name:'Advanced'}));
 const expected=runCalculator(loanPaymentCalculator,{principal:320000,annualRatePercent:0,termMonths:360}).output;
 const baseline=screen.getByRole('rowheader',{name:/Annual rate: 0 %.*Baseline/}).closest('tr')!;expect(within(baseline).getAllByRole('cell')[0].textContent).toBe(displayFinalValue(expected.totalInterest));expect(state.account).toMatchObject({calculatorSlug:loanPaymentCalculator.slug,calculatorVersion:loanPaymentCalculator.version,output:expected});expect(screen.queryByText('Detailed schedule')).toBeNull();expect(screen.getByText(/authoritative period-by-period loan-payment schedule is not available/)).toBeTruthy();expect(state.account?.output?.rateAnalysis).toMatchObject({version:1,calculator:{id:loanPaymentCalculator.id,slug:loanPaymentCalculator.slug,version:loanPaymentCalculator.version},resultMetric:{key:'totalInterest'},scenarios:expect.any(Array)});
});
it.each(['pro','business'] as const)('retains valid Compound baseline when optional upper-rate requests fail on %s',plan=>{
 state.plan=plan;render(<CalculatorInteractive slug="compound-interest-calculator"/>);fireEvent.change(screen.getByLabelText('Years'),{target:{value:'0.01'}});fireEvent.change(screen.getByLabelText('Annual rate (%)'),{target:{value:'1000'}});fireEvent.click(screen.getByRole('button',{name:'Advanced'}));
 const expected=runCalculator(compoundInterestCalculator,{principal:10000,annualRatePercent:1000,years:.01,compoundsPerYear:12}).output;
 expect(screen.getByRole('rowheader',{name:/Annual rate: 1,000 %.*Baseline/})).toBeTruthy();expect(screen.getByRole('alert').textContent).toContain('1,001');expect(state.account).toMatchObject({calculatorSlug:compoundInterestCalculator.slug,calculatorVersion:compoundInterestCalculator.version,output:expected});
});
