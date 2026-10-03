import { distanceTimeCalculator } from "../physics/catalog-batch-1";
import type { StructuredCalculationResult } from "./types";

export function distanceTimeResult(output:{value:number}):StructuredCalculationResult {
  return {primaryResult:{id:"distance",label:"Distance",value:output.value},methodology:"The result is produced by the certified deterministic Distance-Time Calculator engine using d = v × t.",sources:distanceTimeCalculator.sources};
}
