import { z } from "zod";
import type { CalculatorDefinition } from "../types";
import { roundTo } from "../precision";
const inputSchema=z.object({fixedCosts:z.number().finite().nonnegative(),pricePerUnit:z.number().finite().positive(),variableCostPerUnit:z.number().finite().nonnegative()}).refine(v=>v.pricePerUnit>v.variableCostPerUnit,{message:"Price per unit must exceed variable cost per unit"});
type Input=z.infer<typeof inputSchema>; type Output={breakEvenUnits:number;breakEvenRevenue:number;contributionMarginPerUnit:number;contributionMarginPercent:number};
export const breakEvenCalculator:CalculatorDefinition<Input,Output>={
 id:"business.break-even",slug:"break-even-calculator",title:"Break-even Calculator",category:"business",version:1,riskClass:"general",reviewStatus:"draft",inputSchema,
 calculate:({fixedCosts,pricePerUnit,variableCostPerUnit})=>{const margin=pricePerUnit-variableCostPerUnit;const units=fixedCosts/margin;return {breakEvenUnits:roundTo(units,2),breakEvenRevenue:roundTo(units*pricePerUnit,2),contributionMarginPerUnit:roundTo(margin,2),contributionMarginPercent:roundTo(margin/pricePerUnit*100,2)}},
 formulas:[{id:"break-even",expression:"Break-even units = Fixed costs / (Price per unit - Variable cost per unit)",description:"Units required for contribution margin to cover fixed costs."}],
 sources:[{label:"U.S. Small Business Administration — Break-even analysis",url:"https://www.sba.gov/business-guide/plan-your-business/calculate-your-startup-costs"}],
 examples:[{label:"$10,000 fixed cost, $50 price, $30 variable cost",input:{fixedCosts:10000,pricePerUnit:50,variableCostPerUnit:30},expected:{breakEvenUnits:500,breakEvenRevenue:25000,contributionMarginPerUnit:20,contributionMarginPercent:40}}],
 jurisdictions:[{country:"GLOBAL"}]
};