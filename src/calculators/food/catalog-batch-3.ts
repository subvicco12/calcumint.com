import { z } from "zod";
import type { CalculatorDefinition } from "../types";
import { roundTo } from "../precision";

type Out={value:number;steps:readonly string[]};
const positive=z.number().finite().positive().max(1e12);
const source={label:"CalcuMint Master Calculator Catalog 2026 — Food & Cooking scope",note:"Approved catalog scope only. Independent formula/source review remains required before certification or publication."};

export const cakePanConversionCalculator=({
 id:"food.cake-pan-conversion",
 slug:"cake-pan-conversion-calculator",
 title:"Cake Pan Conversion Calculator",
 category:"everyday",
 version:1,
 riskClass:"standard",
 reviewStatus:"draft",
 inputSchema:z.object({originalPanArea:positive,targetPanArea:positive,originalIngredientQuantity:z.number().finite().nonnegative().max(1e12)}),
 calculate:(input)=>{
  z.object({originalPanArea:positive,targetPanArea:positive,originalIngredientQuantity:z.number().finite().nonnegative().max(1e12)}).parse(input);
  const value=roundTo(input.originalIngredientQuantity*input.targetPanArea/input.originalPanArea,6);
  if(!Number.isFinite(value))throw new Error("Calculated result is outside the supported finite range");
  return{value,steps:["Scaled ingredient quantity = "+value]};
 },
 formulas:[{id:"cake-pan-conversion-calculator",expression:"scaled ingredient quantity = original ingredient quantity × target pan area ÷ original pan area",description:"Scale a supplied ingredient quantity in direct proportion to the ratio of target pan area to original pan area. Pan areas are user-supplied; this calculator does not determine baking time, temperature, doneness, or food safety."}],
 sources:[source],
 examples:[{label:"Deterministic area-ratio example",input:{originalPanArea:64,targetPanArea:100,originalIngredientQuantity:200},expected:{value:312.5,steps:["Scaled ingredient quantity = 312.5"]}}],
 goldenTests:[{label:"Deterministic area-ratio example",input:{originalPanArea:64,targetPanArea:100,originalIngredientQuantity:200},expected:{value:312.5}}],
 jurisdictions:[{country:"GLOBAL"}]
}) satisfies CalculatorDefinition<{originalPanArea:number;targetPanArea:number;originalIngredientQuantity:number},Out>;

export const foodCookingBatch3Definitions=[cakePanConversionCalculator] as const;
