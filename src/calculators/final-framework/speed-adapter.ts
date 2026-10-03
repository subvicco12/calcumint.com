import { speedCalculator } from "../physics/catalog-batch-1";
import type { StructuredCalculationResult } from "./types";

export function speedResult(output:{value:number}):StructuredCalculationResult {
  return {
    primaryResult:{id:"speed",label:"Speed",value:output.value},
    methodology:"The result is produced by the certified deterministic Speed Calculator engine using average speed = distance / elapsed time.",
    sources:speedCalculator.sources,
  };
}
