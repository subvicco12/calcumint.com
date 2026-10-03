import {squareFootageCalculator} from "../engineering-construction/catalog-batch-1";
import type {StructuredCalculationResult} from "./types";
export function squareFootageResult(output:{value:number;steps:readonly string[]}):StructuredCalculationResult{return{primaryResult:{id:"result",label:"Total area",value:output.value,unit:"ft²"},methodology:"Deterministic calculation using the displayed Engineering & Construction formula. "+output.steps.join(" "),sources:squareFootageCalculator.sources};}
