import { pressureCalculator } from "../physics/catalog-batch-2";
import type { StructuredCalculationResult } from "./types";

export function pressureResult(output:{value:number}):StructuredCalculationResult {
  return {
    primaryResult:{id:"pressure",label:"Pressure",value:output.value},
    methodology:"The result is produced by the certified deterministic Pressure Calculator engine using P = F / A.",
    sources:pressureCalculator.sources,
  };
}
