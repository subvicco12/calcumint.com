import { z } from "zod";
import type { CalculatorDefinition } from "../types";
import { roundTo } from "../precision";

const positive=z.number().finite().positive().max(1e12);
const source={label:"Iowa State University Extension — Stand Assessments for Corn",url:"https://crops.extension.iastate.edu/encyclopedia/stand-assessments-corn",note:"Describes estimating plants per acre by counting plants in a measured row length that represents a known fraction of an acre and scaling the count to one acre."};

type In={plantCount:number;sampleRowLengthFeet:number;rowSpacingInches:number};
type Out={plantsPerAcre:number;sampleAreaSquareFeet:number;steps:readonly string[]};
export const plantPopulationCalculator:CalculatorDefinition<In,Out>={
 id:"biology.plant-population",slug:"plant-population-calculator",title:"Plant Population Calculator",category:"biology",version:1,riskClass:"standard",reviewStatus:"draft",
 inputSchema:z.object({plantCount:z.number().int().positive().max(1e9),sampleRowLengthFeet:positive,rowSpacingInches:positive.max(1000)}),
 calculate:({plantCount,sampleRowLengthFeet,rowSpacingInches})=>{z.object({plantCount:z.number().int().positive().max(1e9),sampleRowLengthFeet:positive,rowSpacingInches:positive.max(1000)}).parse({plantCount,sampleRowLengthFeet,rowSpacingInches});const sampleAreaSquareFeet=sampleRowLengthFeet*(rowSpacingInches/12);const plantsPerAcre=roundTo(plantCount*43560/sampleAreaSquareFeet,2);return{plantsPerAcre,sampleAreaSquareFeet:roundTo(sampleAreaSquareFeet,6),steps:[`Sample area = ${sampleRowLengthFeet} ft × (${rowSpacingInches} in ÷ 12) = ${roundTo(sampleAreaSquareFeet,6)} ft²`,`Plants/acre = ${plantCount} × 43,560 ÷ ${roundTo(sampleAreaSquareFeet,6)} = ${plantsPerAcre}`]};},
 formulas:[{id:"row-sample-plant-population",expression:"plants/acre = plant count × 43,560 / (row length ft × row spacing ft)",description:"Scales a plant count from the sampled row area to one acre (43,560 square feet)."}],
 sources:[source],
 examples:[{label:"30-inch rows, 17.424-foot sample",input:{plantCount:30,sampleRowLengthFeet:17.424,rowSpacingInches:30},expected:{plantsPerAcre:30000,sampleAreaSquareFeet:43.56,steps:["Sample area = 17.424 ft × (30 in ÷ 12) = 43.56 ft²","Plants/acre = 30 × 43,560 ÷ 43.56 = 30000"]}}],
 goldenTests:[{label:"One-thousandth-acre sample",input:{plantCount:30,sampleRowLengthFeet:17.424,rowSpacingInches:30},expected:{plantsPerAcre:30000,sampleAreaSquareFeet:43.56}}],
 ui:{simpleInputKeys:["plantCount","sampleRowLengthFeet","rowSpacingInches"]}
};
export const biologyBatch4Definitions=[plantPopulationCalculator] as const;
