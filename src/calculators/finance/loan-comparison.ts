import { z } from "zod";
import { roundTo } from "../precision";
import type { CalculatorDefinition } from "../types";
import { paymentForLoan } from "./loan-analysis";

const loanSchema=z.object({principal:z.number().finite().positive(),annualRatePercent:z.number().finite().min(0).max(1000),termMonths:z.number().int().min(1).max(1200),upfrontCosts:z.number().finite().min(0).default(0)});
const inputSchema=z.object({loanA:loanSchema,loanB:loanSchema});
type Input=z.infer<typeof inputSchema>;
type LoanSummary={monthlyPayment:number,totalInterest:number,upfrontCosts:number,totalCost:number};
type Output={loanA:LoanSummary;loanB:LoanSummary;monthlyPaymentDifference:number,totalCostDifference:number;lowerMonthlyPayment:"A"|"B"|"equal";lowerTotalCost:"A"|"B"|"equal"};
function finite(v:number,label:string){if(!Number.isFinite(v))throw new Error(`${label} exceeds supported numeric range`);return v;}
function summarize(loan:z.infer<typeof loanSchema>):LoanSummary{const payment=finite(paymentForLoan(loan.principal,loan.annualRatePercent,loan.termMonths),"Monthly payment");const interest=finite(payment*loan.termMonths-loan.principal,"Total interest");const total=finite(loan.principal+interest+loan.upfrontCosts,"Total cost");return{monthlyPayment:roundTo(payment,2),totalInterest:roundTo(interest,2),upfrontCosts:roundTo(loan.upfrontCosts,2),totalCost:roundTo(total,2)};}
function compare(a:number,b:number):"A"|"B"|"equal"{if(Math.abs(a-b)<0.005)return"equal";return a<b?"A":"B";}
export function compareLoans(input:Input):Output{const a=summarize(input.loanA),b=summarize(input.loanB);return{loanA:a,loanB:b,monthlyPaymentDifference:roundTo(a.monthlyPayment-b.monthlyPayment,2),totalCostDifference:roundTo(a.totalCost-b.totalCost,2),lowerMonthlyPayment:compare(a.monthlyPayment,b.monthlyPayment),lowerTotalCost:compare(a.totalCost,b.totalCost)};}
export const loanComparisonCalculator:CalculatorDefinition<Input,Output>={id:"finance.loan-comparison",slug:"loan-comparison-calculator",title:"Loan Comparison Calculator",category:"loans-mortgages",version:1,riskClass:"financial",reviewStatus:"draft",inputSchema,calculate:(input)=>compareLoans(input),formulas:[{id:"loan-payment-comparison",expression:"M = P × r / (1 - (1+r)^(-n))",description:"Computes the fully amortizing monthly payment for each fixed-rate loan."},{id:"loan-total-cost",expression:"total cost = principal + total interest + upfront costs",description:"Compares modeled lifetime cash cost including explicit upfront costs."}],sources:[],examples:[],jurisdictions:[{country:"GLOBAL"}],ui:{simpleInputKeys:["loanA","loanB"]},relatedCalculators:["loan-emi-calculator","loan-refinance-calculator","loan-prepayment-calculator"],journeyMemberships:["buy-a-home","get-out-of-debt"]};
