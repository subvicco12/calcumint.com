import { periodCalculator } from "../physics/catalog-batch-2";
import type { StructuredCalculationResult } from "./types";
export function periodResult(output:{value:number}):StructuredCalculationResult{return{primaryResult:{id:"period",label:"Period",value:output.value},methodology:"The result is produced by the certified deterministic Period Calculator engine using T = 1 / f.",sources:periodCalculator.sources};}
