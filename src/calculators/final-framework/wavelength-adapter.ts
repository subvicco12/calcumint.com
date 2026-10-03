import { wavelengthCalculator } from "../physics/catalog-batch-2";
import type { StructuredCalculationResult } from "./types";

export function wavelengthResult(output:{value:number}):StructuredCalculationResult {
  return {primaryResult:{id:"wavelength",label:"Wavelength",value:output.value},methodology:"The result is produced by the certified deterministic Wavelength Calculator engine using λ = v / f.",sources:wavelengthCalculator.sources};
}
