import { z } from "zod";
import type { CalculatorDefinition } from "../types";
import { roundTo } from "../precision";

const source={label:"Iowa State University Extension — Corn Yield Estimates",url:"https://crops.extension.iastate.edu/encyclopedia/corn-yield-estimates",note:"Documents the corn yield-component method using ears per acre, kernel rows per ear, kernels per row, and an assumed kernels-per-bushel factor; 90,000 kernels/bushel is commonly used but varies with kernel weight."};
type In={earsPerAcre:number;kernelRowsPerEar:number;kernelsPerRow:number;kernelsPerBushel:number};
type Out={bushelsPerAcre:number;kernelsPerAcre:number;steps:readonly string[]};
const positive=z.number().finite().positive().max(1e12);
export const agriculturalYieldCalculator:CalculatorDefinition<In,Out>={
 id:"biology.agricultural-yield",slug:"agricultural-yield-calculator",title:"Agricultural Yield Calculator",category:"biology",version:1,riskClass:"standard",reviewStatus:"draft",
 inputSchema:z.object({earsPerAcre:positive,kernelRowsPerEar:positive.max(100),kernelsPerRow:positive.max(1000),kernelsPerBushel:positive.default(90000)}),
 calculate:({earsPerAcre,kernelRowsPerEar,kernelsPerRow,kernelsPerBushel})=>{z.object({earsPerAcre:positive,kernelRowsPerEar:positive.max(100),kernelsPerRow:positive.max(1000),kernelsPerBushel:positive.default(90000)}).parse({earsPerAcre,kernelRowsPerEar,kernelsPerRow,kernelsPerBushel});const kernelsPerAcre=earsPerAcre*kernelRowsPerEar*kernelsPerRow;const bushelsPerAcre=roundTo(kernelsPerAcre/kernelsPerBushel,2);return{bushelsPerAcre,kernelsPerAcre:roundTo(kernelsPerAcre,2),steps:[`Kernels/acre = ${earsPerAcre} × ${kernelRowsPerEar} × ${kernelsPerRow} = ${roundTo(kernelsPerAcre,2)}`,`Estimated yield = ${roundTo(kernelsPerAcre,2)} ÷ ${kernelsPerBushel} = ${bushelsPerAcre} bu/acre`]};},
 formulas:[{id:"corn-yield-components",expression:"bushels/acre = ears/acre × kernel rows/ear × kernels/row ÷ kernels/bushel",description:"Corn yield-component estimate. Kernels per bushel is an explicit assumption because kernel size and weight vary."}],
 sources:[source],
 examples:[{label:"Corn yield component estimate",input:{earsPerAcre:30000,kernelRowsPerEar:16,kernelsPerRow:35,kernelsPerBushel:90000},expected:{bushelsPerAcre:186.67,kernelsPerAcre:16800000,steps:["Kernels/acre = 30000 × 16 × 35 = 16800000","Estimated yield = 16800000 ÷ 90000 = 186.67 bu/acre"]}}],
 goldenTests:[{label:"30,000 ears per acre",input:{earsPerAcre:30000,kernelRowsPerEar:16,kernelsPerRow:35,kernelsPerBushel:90000},expected:{bushelsPerAcre:186.67,kernelsPerAcre:16800000}}],
 ui:{simpleInputKeys:["earsPerAcre","kernelRowsPerEar","kernelsPerRow","kernelsPerBushel"]}
};
export const biologyBatch5Definitions=[agriculturalYieldCalculator] as const;
