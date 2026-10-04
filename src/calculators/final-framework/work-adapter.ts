import {workCalculator} from "../physics/catalog-batch-1";
import type {StructuredCalculationResult} from "./types";
export function workResult(output:{value:number;steps:readonly string[]}):StructuredCalculationResult{return{primaryResult:{id:"result",label:"Work",value:output.value,unit:"J"},methodology:"Deterministic calculation using the displayed formula. "+output.steps.join(" "),sources:workCalculator.sources};}
