import { z } from "zod";
import type { CalculatorDefinition } from "../types";
type Input = {powerWatts:number;massKg:number};
type Output = {wattsPerKg:number};
const schema = z.object({powerWatts:z.number().finite().nonnegative(),massKg:z.number().finite().positive()}).strict();
function finite(value:number):number { if (!Number.isFinite(value)) throw new Error("Calculated result is outside the supported finite range"); return value; }
function check(output:Output):Output { Object.values(output).forEach(finite); return output; }
/** Work245 proposal 529: owner-authorized unregistered DRAFT; no certification or publication. */
export const powerWeightRatioDraftCalculator: CalculatorDefinition<Input,Output> = {
 id:"sports.power-weight-ratio", slug:"power-to-weight-ratio-calculator",
 title:"Power-to-Weight Ratio Calculator", category:"everyday", version:1, riskClass:"standard", reviewStatus:"draft",
 inputSchema:schema,
 calculate:input=>{ const i=schema.parse(input); const wattsPerKg = i.powerWatts/i.massKg; if (i.powerWatts > 0 && wattsPerKg === 0) throw new Error("Positive ratio is below the supported numeric range"); return check({wattsPerKg}); },
 formulas:[{id:"work245-529",expression:"P/m; measured or assumed power supplied explicitly; no FTP/VO2 inference.",description:"Body versus total bike/vehicle mass choice is displayed input context; reject zero mass."}],
 sources:[{"label": "Work245 proposal 529 primary bibliographic reference", "url": "https://www.bipm.org/en/publications/si-brochure", "note": "Bibliographic pointer supplied by researched proposal; not fetched or independently verified in this implementation. Scalar identities independently checked by dimensional arithmetic; no certification claim."}],
 examples:[{label:"Independent arithmetic golden",input:{"powerWatts": 240, "massKg": 80},expected:{"wattsPerKg": 3}}],
 goldenTests:[{label:"Independent arithmetic golden",input:{"powerWatts": 240, "massKg": 80},expected:{"wattsPerKg": 3}}]
};
