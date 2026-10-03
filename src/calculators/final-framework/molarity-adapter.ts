import { molarityCalculator } from "../chemistry/catalog-batch-1";
import type { StructuredCalculationResult } from "./types";

export function molarityResult(output:{value:number}):StructuredCalculationResult {
  return {
    primaryResult:{id:"molarity",label:"Molarity",value:output.value,unit:"mol/L"},
    methodology:"The result is produced by the certified deterministic Molarity Calculator engine using M = n / V with solution volume in liters.",
    sources:molarityCalculator.sources,
  };
}
