import { z } from "zod";
import { roundTo } from "../precision";
import type { CalculatorDefinition } from "../types";

const inputSchema = z.object({
  principal: z.number().finite().nonnegative(),
  annualRatePercent: z.number().finite().min(-99.999999).max(1000),
  years: z.number().finite().nonnegative().max(200),
  compoundsPerYear: z.number().int().min(1).max(365)
});

type Input = z.infer<typeof inputSchema>;
type Output = { futureValue: number; totalInterest: number };

function finite(value:number,label:string){if(!Number.isFinite(value))throw new Error(`${label} exceeds supported numeric range`);return value;}

export const compoundInterestCalculator: CalculatorDefinition<Input, Output> = {
  id: "finance.compound-interest",
  slug: "compound-interest-calculator",
  title: "Compound Interest Calculator",
  category: "finance-investment",
  version: 1,
  riskClass: "financial",
  reviewStatus: "draft",
  inputSchema,
  calculate: ({ principal, annualRatePercent, years, compoundsPerYear }) => {
    const periodicRate=annualRatePercent/100/compoundsPerYear;
    if(periodicRate<=-1)throw new Error("Periodic rate must be greater than -100%");
    const futureValue=finite(principal*Math.pow(1+periodicRate,compoundsPerYear*years),"Future value");
    const roundedFutureValue=roundTo(futureValue,2);
    return {futureValue:roundedFutureValue,totalInterest:roundTo(roundedFutureValue-principal,2)};
  },
  formulas:[{id:"compound-interest",expression:"A = P(1 + r/n)^(nt)",description:"Future value with a fixed nominal annual rate compounded n times per year."}],
  sources:[],
  examples:[{label:"$10,000 at 5% for 10 years, compounded monthly",input:{principal:10000,annualRatePercent:5,years:10,compoundsPerYear:12},expected:{futureValue:16470.09,totalInterest:6470.09}}],
  jurisdictions:[{country:"GLOBAL"}],
  ui:{simpleInputKeys:["principal","annualRatePercent","years"],advancedInputKeys:["compoundsPerYear"]},
  relatedCalculators:["effective-interest-rate-calculator","investment-growth-calculator","fixed-term-deposit-calculator"],
  journeyMemberships:["invest-for-a-goal","plan-retirement"]
};
