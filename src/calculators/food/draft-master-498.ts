import { z } from "zod";
import type { CalculatorDefinition } from "../types";
type Input = {value:number;direction:"massToVolume"|"volumeToMass";densityGPerMl:number};
type Output = {convertedValue:number};
const schema = z.object({value:z.number().finite().nonnegative(),direction:z.enum(["massToVolume","volumeToMass"]),densityGPerMl:z.number().finite().positive()}).strict();
function finite(value:number):number { if (!Number.isFinite(value)) throw new Error("Calculated result is outside the supported finite range"); return value; }
function check(output:Output):Output { Object.values(output).forEach(finite); return output; }
/** Work245 proposal 498: owner-authorized unregistered DRAFT; no certification or publication. */
export const ingredientWeightVolumeDraftCalculator: CalculatorDefinition<Input,Output> = {
 id:"food.ingredient-mass-volume", slug:"ingredient-weight-volume-converter",
 title:"Ingredient Weight/Volume Converter", category:"everyday", version:1, riskClass:"standard", reviewStatus:"draft",
 inputSchema:schema,
 calculate:input=>{ const i=schema.parse(input); const convertedValue = i.direction === "massToVolume" ? i.value / i.densityGPerMl : i.value * i.densityGPerMl; if (i.value > 0 && convertedValue === 0) throw new Error("Positive conversion is below the supported numeric range"); return check({convertedValue}); },
 formulas:[{id:"work245-498",expression:"Mass=rho*volume; volume=mass/rho. Density must be explicit user-supplied, with ingredient preparation/temperature context; no universal cup-to-gram table.",description:"Packing/aeration change density; cooking-volume engine explicitly excludes mass-volume and cannot be silently reused."}],
 sources:[{"label": "Work245 proposal 498 primary bibliographic reference", "url": "https://www.nist.gov/pml/owm/metric-si/metric-kitchen", "note": "Bibliographic pointer supplied by researched proposal; not fetched or independently verified in this implementation. Scalar identities independently checked by dimensional arithmetic; no certification claim."}],
 examples:[{label:"Independent arithmetic golden",input:{"value": 90, "direction": "massToVolume", "densityGPerMl": 0.75},expected:{"convertedValue": 120}}],
 goldenTests:[{label:"Independent arithmetic golden",input:{"value": 90, "direction": "massToVolume", "densityGPerMl": 0.75},expected:{"convertedValue": 120}}]
};
