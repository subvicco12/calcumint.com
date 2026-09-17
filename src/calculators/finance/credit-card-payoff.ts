import { z } from "zod";
import { roundTo } from "../precision";
import type { CalculatorDefinition } from "../types";
import { paymentForLoan } from "./loan-analysis";

const inputSchema = z.object({
  balance: z.number().finite().positive(),
  annualAprPercent: z.number().finite().min(0).max(1000),
  monthlyPayment: z.number().finite().positive(),
  extraMonthlyPayment: z.number().finite().min(0).default(0),
});
type Input = z.infer<typeof inputSchema>;
type Output = { payoffMonths: number; totalInterest: number; totalPaid: number; effectiveMonthlyPayment: number; firstMonthInterest: number };
function finite(value:number,label:string){if(!Number.isFinite(value))throw new Error(`${label} exceeds supported numeric range`);return value;}

export function requiredMonthlyPaymentForTargetMonths(balance:number,annualAprPercent:number,targetMonths:number):number{
  if(!Number.isFinite(balance)||balance<=0)throw new Error("Balance must be positive and finite");
  if(!Number.isInteger(targetMonths)||targetMonths<1||targetMonths>2400)throw new Error("Target months must be an integer from 1 to 2400");
  return finite(paymentForLoan(balance,annualAprPercent,targetMonths),"Required monthly payment");
}

export function simulateCreditCardPayoff(input:Input):Output{
  const payment=finite(input.monthlyPayment+input.extraMonthlyPayment,"Monthly payment");
  const monthlyRate=input.annualAprPercent/100/12;
  const firstMonthInterest=finite(input.balance*monthlyRate,"First month interest");
  if(monthlyRate>0&&payment<=firstMonthInterest)throw new Error("Monthly payment does not amortize the modeled balance");
  let balance=input.balance,totalInterest=0,totalPaid=0,months=0;
  while(balance>0.005&&months<2400){
    const interest=finite(balance*monthlyRate,"Monthly interest");
    const due=finite(balance+interest,"Monthly balance");
    const paid=Math.min(payment,due);
    balance=Math.max(0,due-paid);
    totalInterest=finite(totalInterest+interest,"Total interest");
    totalPaid=finite(totalPaid+paid,"Total paid");
    months++;
  }
  if(balance>0.005)throw new Error("Credit card payoff exceeds supported 2400-month horizon");
  return{payoffMonths:months,totalInterest:roundTo(totalInterest,2),totalPaid:roundTo(totalPaid,2),effectiveMonthlyPayment:roundTo(payment,2),firstMonthInterest:roundTo(firstMonthInterest,2)};
}

export const creditCardPayoffCalculator:CalculatorDefinition<Input,Output>={
  id:"finance.credit-card-payoff",slug:"credit-card-payoff-calculator",title:"Credit Card Payoff Calculator",category:"loans-mortgages",version:1,riskClass:"financial",reviewStatus:"draft",inputSchema,
  calculate:(input)=>simulateCreditCardPayoff(input),
  reverseSolvers:[{id:"target-payoff-payment",target:"monthlyPayment",description:"Solves the level modeled monthly payment required to repay the entered balance within a target number of months at the stated APR."}],
  formulas:[{id:"monthly-interest",expression:"interest = balance × APR / 12",description:"Generic monthly-interest approximation using nominal APR divided by 12."},{id:"target-payment",expression:"M = P × r / (1 − (1+r)^−n)",description:"Reverse-solves a level monthly payment for a target payoff term; zero-rate balances use principal divided by months."}],
  sources:[],examples:[],jurisdictions:[{country:"GLOBAL"}],ui:{simpleInputKeys:["balance","annualAprPercent","monthlyPayment"],advancedInputKeys:["extraMonthlyPayment"]},relatedCalculators:["debt-payoff-calculator","loan-affordability-calculator","loan-prepayment-calculator"],journeyMemberships:["get-out-of-debt"]
};
