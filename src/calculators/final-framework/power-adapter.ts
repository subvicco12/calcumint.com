import {powerCalculator} from "../physics/catalog-batch-1";
import type {StructuredCalculationResult} from "./types";
export function powerResult(output:{value:number;steps:readonly string[]}):StructuredCalculationResult{return{primaryResult:{id:"result",label:"Power",value:output.value,unit:"W"},methodology:"Deterministic calculation using the displayed formula. "+output.steps.join(" "),sources:powerCalculator.sources};}
