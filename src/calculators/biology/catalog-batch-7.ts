import { z } from "zod";
import type { CalculatorDefinition } from "../types";
import { roundTo } from "../precision";
type In={initialCells:number;elapsedTimeMinutes:number;generationTimeMinutes:number};
type Out={cells:number;generations:number;steps:readonly string[]};
export const bacterialGrowthCalculator:CalculatorDefinition<In,Out>={
 id:"biology.bacterial-growth",slug:"bacterial-growth-calculator",title:"Bacterial Growth Calculator",category:"biology",version:1,riskClass:"standard",reviewStatus:"draft",
 inputSchema:z.object({initialCells:z.number().finite().positive().max(1e15),elapsedTimeMinutes:z.number().finite().min(0).max(1e9),generationTimeMinutes:z.number().finite().positive().max(1e9)}).refine(x=>Math.log(x.initialCells)+(x.elapsedTimeMinutes/x.generationTimeMinutes)*Math.log(2)<=Math.log(Number.MAX_VALUE)-Math.log(1e6),{message:"Result magnitude must remain finite after six-decimal rounding.",path:["elapsedTimeMinutes"]}),
 calculate:x=>{z.object({initialCells:z.number().finite().positive().max(1e15),elapsedTimeMinutes:z.number().finite().min(0).max(1e9),generationTimeMinutes:z.number().finite().positive().max(1e9)}).refine(x=>Math.log(x.initialCells)+(x.elapsedTimeMinutes/x.generationTimeMinutes)*Math.log(2)<=Math.log(Number.MAX_VALUE)-Math.log(1e6),{message:"Result magnitude must remain finite after six-decimal rounding.",path:["elapsedTimeMinutes"]}).parse(x);const generations=x.elapsedTimeMinutes/x.generationTimeMinutes;const cells=roundTo(x.initialCells*Math.pow(2,generations),6);return{cells,generations:roundTo(generations,6),steps:[`Generations = ${x.elapsedTimeMinutes} ÷ ${x.generationTimeMinutes} = ${roundTo(generations,6)}`,`Cells = ${x.initialCells} × 2^${roundTo(generations,6)} = ${cells}`]};},
 formulas:[{id:"binary-fission-growth",expression:"N = N0 × 2^(t/g)",description:"Ideal bacterial binary-fission growth at a constant generation time; t and g use the same time unit."}],
 sources:[{label:"OpenStax Microbiology — Mathematical Basics: Generation Time",url:"https://openstax.org/books/microbiology/pages/b-mathematical-basics",note:"Defines bacterial binary-fission growth N_i = N_0 × 2^j and generation count from elapsed time and generation time."}],
 examples:[{label:"4 cells, 90 minutes, 30-minute generation time",input:{initialCells:4,elapsedTimeMinutes:90,generationTimeMinutes:30},expected:{cells:32,generations:3,steps:["Generations = 90 ÷ 30 = 3","Cells = 4 × 2^3 = 32"]}}],
 goldenTests:[{label:"OpenStax generation-time example",input:{initialCells:4,elapsedTimeMinutes:90,generationTimeMinutes:30},expected:{cells:32,generations:3}}],
 ui:{simpleInputKeys:["initialCells","elapsedTimeMinutes","generationTimeMinutes"]}
};
export const biologyBatch7Definitions=[bacterialGrowthCalculator] as const;
