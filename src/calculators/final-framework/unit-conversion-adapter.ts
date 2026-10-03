import { unitConversionCalculator } from "../core/unit-conversion";
import type { StructuredCalculationResult } from "./types";
export function unitConversionResult(input:{fromUnit:string;toUnit:string},output:{result:number}):StructuredCalculationResult{return {primaryResult:{id:"result",label:`${input.fromUnit} to ${input.toUnit}`,value:output.result,unit:input.toUnit},methodology:"The result is produced by the certified deterministic unit-conversion engine.",sources:unitConversionCalculator.sources};}
