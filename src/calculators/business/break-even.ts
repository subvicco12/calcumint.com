import { z } from "zod";
import type { CalculatorDefinition } from "../types";
import { roundTo } from "../precision";
const inputSchema=z.object({fixedCosts:z.number().finite().nonnegative(),pricePerUnit:z.number().finite().positive(),variableCostPerUnit:z.number().finite().nonnegative()}).refine(v=>v.pricePerUnit>v.variableCostPerUnit,{message:"Price per unit must exceed variable cost per unit"});
type Input=z.infer<typeof inputSchema>; type Output={breakEvenUnits:number;breakEvenRevenue:number;contributionMarginPerUnit:number;contributionMarginPercent:number};
export const breakEvenCalculator:CalculatorDefinition<Input,Output>={
 id:"business.break-even",slug:"break-even-calculator",title:"Break-even Calculator",category:"business",version:1,riskClass:"standard",reviewStatus:"draft",inputSchema,
 calculate:({fixedCosts,pricePerUnit,variableCostPerUnit})=>{const margin=pricePerUnit-variableCostPerUnit;const units=fixedCosts/margin;return {breakEvenUnits:roundTo(units,2),breakEvenRevenue:roundTo(units*pricePerUnit,2),contributionMarginPerUnit:roundTo(margin,2),contributionMarginPercent:roundTo(margin/pricePerUnit*100,2)}},
 formulas:[{id:"break-even",expression:"Break-even units = Fixed costs / (Price per unit - Variable cost per unit)",description:"Units required for contribution margin to cover fixed costs."}],
 sources:[{label:"U.S. Small Business Administration — Break-even analysis",url:"https://www.sba.gov/business-guide/plan-your-business/calculate-your-startup-costs"}],
 goldenTests:[
  {label:"SBA declared model: margin50-30=20; units10000/20=500; revenue500×50=25000; percent20/50×100=40",input:{fixedCosts:10000,pricePerUnit:50,variableCostPerUnit:30},expected:{breakEvenUnits:500,breakEvenRevenue:25000,contributionMarginPerUnit:20,contributionMarginPercent:40}},
  {label:"Zero fixed cost: units/revenue0; margin3; percent75",input:{fixedCosts:0,pricePerUnit:4,variableCostPerUnit:1},expected:{breakEvenUnits:0,breakEvenRevenue:0,contributionMarginPerUnit:3,contributionMarginPercent:75}},
  {label:"Existing two-place contract: units1/3→0.33; revenue4/3→1.33, independently rounded",input:{fixedCosts:1,pricePerUnit:4,variableCostPerUnit:1},expected:{breakEvenUnits:0.33,breakEvenRevenue:1.33,contributionMarginPerUnit:3,contributionMarginPercent:75}},
  {label:"Finite identity margin1: units1e308/1=1e308; revenue1e308×1=1e308",input:{fixedCosts:1e308,pricePerUnit:1,variableCostPerUnit:0},expected:{breakEvenUnits:1e308,breakEvenRevenue:1e308,contributionMarginPerUnit:1,contributionMarginPercent:100}}
 ],
 examples:[{label:"$10,000 fixed cost, $50 price, $30 variable cost",input:{fixedCosts:10000,pricePerUnit:50,variableCostPerUnit:30},expected:{breakEvenUnits:500,breakEvenRevenue:25000,contributionMarginPerUnit:20,contributionMarginPercent:40}}],
 jurisdictions:[{country:"GLOBAL"}]
};
