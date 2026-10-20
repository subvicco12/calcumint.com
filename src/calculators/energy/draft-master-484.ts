import { z } from "zod";
import type { CalculatorDefinition } from "../types";
type Input = {batteryEnergyAddedKwh:number;chargingEfficiency:number};
type Output = {wallEnergyKwh:number;lossKwh:number};
const schema = z.object({batteryEnergyAddedKwh:z.number().finite().nonnegative(),chargingEfficiency:z.number().finite().positive().max(1)}).strict();
function finite(value:number):number { if (!Number.isFinite(value)) throw new Error("Calculated result is outside the supported finite range"); return value; }
function check(output:Output):Output { Object.values(output).forEach(finite); return output; }
/** Work245 proposal 484: owner-authorized unregistered DRAFT; no certification or publication. */
export const evChargingEnergyDraftCalculator: CalculatorDefinition<Input,Output> = {
 id:"energy.ev-charging-energy", slug:"ev-charging-energy-calculator",
 title:"EV Charging Energy Calculator", category:"everyday", version:1, riskClass:"standard", reviewStatus:"draft",
 inputSchema:schema,
 calculate:input=>{ const i=schema.parse(input); const wallEnergyKwh = i.batteryEnergyAddedKwh / i.chargingEfficiency; return check({wallEnergyKwh, lossKwh: wallEnergyKwh-i.batteryEnergyAddedKwh}); },
 formulas:[{id:"work245-484",expression:"wallEnergy=batteryEnergy/eta; loss=wallEnergy-batteryEnergy. Distinct output contract from existing EV charging cost/traction trip energy.",description:"Eta0 invalid; eta1 loss0; user supplied average efficiency excludes session-dependent charger curves."}],
 sources:[{"label": "Work245 proposal 484 primary bibliographic reference", "url": "https://afdc.energy.gov/vehicles/electric.html", "note": "Bibliographic pointer supplied by researched proposal; not fetched or independently verified in this implementation. Scalar identities independently checked by dimensional arithmetic; no certification claim."}],
 examples:[{label:"Independent arithmetic golden",input:{"batteryEnergyAddedKwh": 12, "chargingEfficiency": 0.75},expected:{"wallEnergyKwh": 16, "lossKwh": 4}}],
 goldenTests:[{label:"Independent arithmetic golden",input:{"batteryEnergyAddedKwh": 12, "chargingEfficiency": 0.75},expected:{"wallEnergyKwh": 16, "lossKwh": 4}}]
};
