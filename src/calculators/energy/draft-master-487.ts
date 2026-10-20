import { z } from "zod";
import type { CalculatorDefinition } from "../types";
type Input = {rainfallMm:number;catchmentAreaM2:number;collectionEfficiency:number};
type Output = {theoreticalVolumeM3:number;collectedVolumeM3:number;collectedLiters:number};
const schema = z.object({rainfallMm:z.number().finite().nonnegative(),catchmentAreaM2:z.number().finite().nonnegative(),collectionEfficiency:z.number().finite().min(0).max(1)}).strict();
function finite(value:number):number { if (!Number.isFinite(value)) throw new Error("Calculated result is outside the supported finite range"); return value; }
function check(output:Output):Output { Object.values(output).forEach(finite); return output; }
/** Work245 proposal 487: owner-authorized unregistered DRAFT; no certification or publication. */
export const rainwaterHarvestingDraftCalculator: CalculatorDefinition<Input,Output> = {
 id:"energy.rainwater-harvesting", slug:"rainwater-harvesting-calculator",
 title:"Rainwater Harvesting Calculator", category:"everyday", version:1, riskClass:"standard", reviewStatus:"draft",
 inputSchema:schema,
 calculate:input=>{ const i=schema.parse(input); const theoreticalVolumeM3 = finite(i.rainfallMm / 1000 * i.catchmentAreaM2); const collectedVolumeM3 = finite(theoreticalVolumeM3 * i.collectionEfficiency); if ((i.rainfallMm > 0 && i.catchmentAreaM2 > 0 && theoreticalVolumeM3 === 0) || (theoreticalVolumeM3 > 0 && i.collectionEfficiency > 0 && collectedVolumeM3 === 0)) throw new Error("Positive volume is below the supported numeric range"); return check({theoreticalVolumeM3,collectedVolumeM3,collectedLiters:collectedVolumeM3*1000}); },
 formulas:[{id:"work245-487",expression:"Vtheory=rainfallMm/1000*area; collected=Vtheory*efficiency; liters=1000*collected. No tank or rainfall time-series simulation.",description:"Eta0 zero yield; constant runoff/loss coefficient explicit; not potable-water suitability."}],
 sources:[{"label": "Work245 proposal 487 primary bibliographic reference", "url": "https://www.weather.gov/epz/wxcalc_formulas", "note": "Bibliographic pointer supplied by researched proposal; not fetched or independently verified in this implementation. Scalar identities independently checked by dimensional arithmetic; no certification claim."}],
 examples:[{label:"Independent arithmetic golden",input:{"rainfallMm": 40, "catchmentAreaM2": 250, "collectionEfficiency": 0.6},expected:{"theoreticalVolumeM3": 10, "collectedVolumeM3": 6, "collectedLiters": 6000}}],
 goldenTests:[{label:"Independent arithmetic golden",input:{"rainfallMm": 40, "catchmentAreaM2": 250, "collectionEfficiency": 0.6},expected:{"theoreticalVolumeM3": 10, "collectedVolumeM3": 6, "collectedLiters": 6000}}]
};
