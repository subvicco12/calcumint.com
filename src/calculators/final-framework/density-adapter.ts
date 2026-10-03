import { densityCalculator } from "../physics/catalog-batch-2";
import type { StructuredCalculationResult } from "./types";

export function densityResult(output:{value:number}):StructuredCalculationResult {
  return {
    primaryResult:{id:"density",label:"Density",value:output.value},
    methodology:"The result is produced by the certified deterministic Density Calculator engine using ρ = m / V.",
    sources:densityCalculator.sources,
  };
}
