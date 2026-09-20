import { z } from "zod";
import type { CalculatorDefinition } from "../types";
import { roundTo } from "../precision";
const inputSchema=z.object({weightKg:z.number().finite().positive().max(1000),heightCm:z.number().finite().positive().max(300)});
type Input=z.infer<typeof inputSchema>; type Output={bmi:number;classification:string};
function classify(bmi:number){if(bmi<18.5)return "Below reference range";if(bmi<25)return "Within reference range";if(bmi<30)return "Above reference range";return "Well above reference range";}
export const bmiCalculator:CalculatorDefinition<Input,Output>={
 id:"health.bmi",slug:"bmi-calculator",title:"BMI Calculator",category:"health",version:1,riskClass:"health",reviewStatus:"draft",inputSchema,
 calculate:({weightKg,heightCm})=>{const m=heightCm/100;const bmi=roundTo(weightKg/(m*m),1);return {bmi,classification:classify(bmi)}},
 formulas:[{id:"bmi",expression:"BMI = weight(kg) / height(m)^2",description:"Body mass index from metric height and weight."}],
 sources:[{label:"World Health Organization — BMI classification",url:"https://www.who.int/data/gho/data/themes/topics/topic-details/GHO/body-mass-index"}],
 examples:[{label:"70 kg at 175 cm",input:{weightKg:70,heightCm:175},expected:{bmi:22.9,classification:"Within reference range"}}],
 jurisdictions:[{country:"GLOBAL"}]
};