import {workCalculator} from "../physics/catalog-batch-1";
import type {StructuredCalculationResult} from "./types";
export function workResult(output:{value:number;steps:readonly string[]}):StructuredCalculationResult{return{primaryResult:{id:"primary",label:"Result",value:output.value},methodology:"Deterministic calculation using the displayed physics formula and supplied compatible units.",sources:workCalculator.sources};}
