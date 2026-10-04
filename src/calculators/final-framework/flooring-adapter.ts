import {flooringCalculator} from "../engineering-construction/catalog-batch-1";
import type {StructuredCalculationResult} from "./types";
export function flooringResult(output:{value:number;steps:readonly string[]}):StructuredCalculationResult{return{primaryResult:{id:"result",label:"Flooring purchase area",value:output.value,unit:"m²"},methodology:"Deterministic calculation using the displayed Engineering & Construction formula. "+output.steps.join(" "),sources:flooringCalculator.sources};}
