import {powerCalculator} from "../physics/catalog-batch-1";
import type {StructuredCalculationResult} from "./types";
export function powerResult(output:{value:number;steps:readonly string[]}):StructuredCalculationResult{return{primaryResult:{id:"result",label:"Result",value:output.value},methodology:"Deterministic calculation using the displayed physics formula and supplied compatible units. "+output.steps.join(" "),sources:powerCalculator.sources};}
