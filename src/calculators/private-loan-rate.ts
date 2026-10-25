import {paymentForLoan,loanAnalysisCalculator} from './finance/loan-analysis';
/** Nominal annual rate for the existing fixed monthly amortization equation, not fee-inclusive regulatory APR. */
export function solvePrivateLoanRate(principal:number,monthlyPayment:number,termMonths:number){
 if(loanAnalysisCalculator.id!=='finance.loan-analysis'||loanAnalysisCalculator.version!==1)throw Error('Private rate solver requires the original v1 forward contract');
 if(!Number.isFinite(principal)||principal<=0||!Number.isFinite(monthlyPayment)||monthlyPayment<=0||!Number.isInteger(termMonths)||termMonths<1||termMonths>1200)throw Error('Invalid fixed-loan input');
 const minimum=paymentForLoan(principal,0,termMonths),maximum=paymentForLoan(principal,1000,termMonths);
 if(!(minimum>0&&maximum>minimum))throw Error('Payment range is below supported numeric resolution');
 const tolerance=Math.max(Number.MIN_VALUE,1e-10*Math.max(monthlyPayment,minimum));
 if(monthlyPayment<minimum-tolerance||monthlyPayment>maximum+tolerance)throw Error('Payment has no rate within the supported0to1000percent bracket');
 if(Math.abs(monthlyPayment-minimum)<=tolerance)return 0;
 let low=0,high=1000;
 for(let i=0;i<100;i++){const middle=(low+high)/2,value=paymentForLoan(principal,middle,termMonths);if(value<monthlyPayment)low=middle;else high=middle;}
 const rate=(low+high)/2;if(Math.abs(paymentForLoan(principal,rate,termMonths)-monthlyPayment)>tolerance)throw Error('Rate did not converge within the forward contract tolerance');return rate;
}
