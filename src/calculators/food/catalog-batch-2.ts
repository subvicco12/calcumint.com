import { z } from "zod";
import type { CalculatorDefinition } from "../types";
import { roundTo } from "../precision";

type Out={value:number;steps:readonly string[]};
const nonnegative=z.number().finite().nonnegative().max(1e12);
const positive=z.number().finite().positive().max(1e12);
const source={label:"CalcuMint Master Calculator Catalog 2026 — Food & Cooking scope",note:"Approved catalog scope only. Independent formula/source review remains required before certification or publication."};
const mk=<I>(id:string,slug:string,title:string,schema:z.ZodType<I>,calc:(x:I)=>number,expression:string,description:string,example:I,expected:number)=>({
 id,slug,title,category:"everyday",version:1,riskClass:"standard",reviewStatus:"draft",inputSchema:schema,
 calculate:(input:I)=>{const parsed=schema.safeParse(input);if(!parsed.success)throw new Error("Food cooking inputs are outside the supported domain");const value=roundTo(calc(parsed.data),6);if(!Number.isFinite(value))throw new Error("Calculated result is outside the supported finite range");return{value,steps:[title.replace(" Calculator","")+" = "+value]}},
 formulas:[{id:slug,expression,description}],sources:[source],
 examples:[{label:"Deterministic example",input:example,expected:{value:expected,steps:[title.replace(" Calculator","")+" = "+expected]}}],
 goldenTests:[{label:"Deterministic example",input:example,expected:{value:expected}}],
 jurisdictions:[{country:"GLOBAL"}]
}) satisfies CalculatorDefinition<I,Out>;

export const recipeScalingCalculator=mk("food.recipe-scaling","recipe-scaling-calculator","Recipe Scaling Calculator",
 z.object({originalServings:positive,targetServings:nonnegative,originalQuantity:nonnegative}),
 x=>x.originalQuantity*x.targetServings/x.originalServings,
 "scaled quantity = original quantity × target servings ÷ original servings",
 "Scale a supplied ingredient quantity in direct proportion to the requested serving count.",
 {originalServings:4,targetServings:10,originalQuantity:250},625);

export const servingSizeCalculator=mk("food.serving-size","serving-size-calculator","Serving Size Calculator",
 z.object({totalQuantity:nonnegative,servings:positive}),
 x=>x.totalQuantity/x.servings,
 "quantity per serving = total quantity ÷ servings",
 "Divide a supplied total quantity equally across the requested number of servings.",
 {totalQuantity:1200,servings:6},200);

export const nutritionScalingCalculator=mk("food.nutrition-scaling","nutrition-scaling-calculator","Nutrition Scaling Calculator",
 z.object({nutrientAmountPerServing:nonnegative,servings:nonnegative}),
 x=>x.nutrientAmountPerServing*x.servings,
 "scaled nutrient amount = nutrient amount per serving × servings",
 "Scale a user-supplied nutrient quantity by serving count without interpreting dietary suitability.",
 {nutrientAmountPerServing:12,servings:2.5},30);

export const coffeeRatioCalculator=mk("food.coffee-ratio","coffee-ratio-calculator","Coffee Ratio Calculator",
 z.object({waterGrams:nonnegative,waterToCoffeeRatio:positive}),
 x=>x.waterGrams/x.waterToCoffeeRatio,
 "coffee weight = water weight ÷ user-supplied water-to-coffee ratio",
 "Calculate coffee mass from water mass and a user-supplied ratio; no preferred brewing ratio is prescribed.",
 {waterGrams:600,waterToCoffeeRatio:16},37.5);

export const waterToRiceRatioCalculator=mk("food.water-to-rice-ratio","water-to-rice-ratio-calculator","Water-to-Rice Ratio Calculator",
 z.object({riceAmount:nonnegative,waterPerRiceUnit:nonnegative}),
 x=>x.riceAmount*x.waterPerRiceUnit,
 "water amount = rice amount × user-supplied water-per-rice ratio",
 "Calculate water quantity from rice quantity and a user-supplied ratio; no cooking or food-safety recommendation is inferred.",
 {riceAmount:2,waterPerRiceUnit:1.5},3);

export const foodCookingBatch2Definitions=[recipeScalingCalculator,servingSizeCalculator,nutritionScalingCalculator,coffeeRatioCalculator,waterToRiceRatioCalculator] as const;
