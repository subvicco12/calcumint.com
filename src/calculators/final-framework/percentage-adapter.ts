import { percentageCalculator } from "../core/percentage";
import type { StructuredCalculationResult } from "./types";

export function percentageResult(output:{result:number}):StructuredCalculationResult{return {primaryResult:{id:"result",label:"Percentage result",value:output.result},methodology:"The result is produced by the certified percentage-of-value deterministic calculator engine.",sources:percentageCalculator.sources};}
