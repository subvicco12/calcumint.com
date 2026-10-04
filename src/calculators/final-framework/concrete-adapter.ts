import {concreteCalculator} from "../engineering-construction/catalog-batch-1";
import type {StructuredCalculationResult} from "./types";
export function concreteResult(output:{value:number;steps:readonly string[]}):StructuredCalculationResult{return{primaryResult:{id:"result",label:"Concrete volume",value:output.value,unit:"m³"},methodology:"Deterministic calculation using the displayed Engineering & Construction formula. "+output.steps.join(" "),sources:concreteCalculator.sources};}
