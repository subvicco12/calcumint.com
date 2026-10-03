import { frequencyCalculator } from "../physics/catalog-batch-2";
import type { StructuredCalculationResult } from "./types";

export function frequencyResult(output:{value:number}):StructuredCalculationResult {
  return {primaryResult:{id:"frequency",label:"Frequency",value:output.value},methodology:"The result is produced by the certified deterministic Frequency Calculator engine using f = N / t.",sources:frequencyCalculator.sources};
}
