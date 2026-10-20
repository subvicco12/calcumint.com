import { z } from "zod";
import type { CalculatorDefinition } from "../types";
type Input = {dailyEnergyTargetKwh:number;peakSunHours:number;systemEfficiency:number;panelRatedWatts:number};
type Output = {requiredSystemKw:number;panelCount:number;estimatedDailyKwh:number};
const schema = z.object({dailyEnergyTargetKwh:z.number().finite().positive(),peakSunHours:z.number().finite().positive().max(24),systemEfficiency:z.number().finite().positive().max(1),panelRatedWatts:z.number().finite().positive()}).strict();
function finite(value:number):number { if (!Number.isFinite(value)) throw new Error("Calculated result is outside the supported finite range"); return value; }
function check(output:Output):Output { Object.values(output).forEach(finite); return output; }
/** Work245 proposal 481: owner-authorized unregistered DRAFT; no certification or publication. */
export const solarPanelSizingDraftCalculator: CalculatorDefinition<Input,Output> = {
 id:"energy.solar-panel-sizing", slug:"solar-panel-calculator",
 title:"Solar Panel Calculator", category:"everyday", version:1, riskClass:"standard", reviewStatus:"draft",
 inputSchema:schema,
 calculate:input=>{ const i=schema.parse(input); const requiredSystemKw = i.dailyEnergyTargetKwh / finite(i.peakSunHours * i.systemEfficiency); const panelCount = Math.ceil(finite(requiredSystemKw * 1000) / i.panelRatedWatts); if (requiredSystemKw <= 0 || !Number.isSafeInteger(panelCount) || panelCount < 1) throw new Error("Sizing is outside the supported positive numeric/integer range"); const estimatedDailyKwh = finite(finite(panelCount * i.panelRatedWatts) / 1000 * i.peakSunHours) * i.systemEfficiency; return check({requiredSystemKw,panelCount,estimatedDailyKwh}); },
 formulas:[{id:"work245-481",expression:"Required kW=target/(sunHours*efficiency); count=ceil(requiredKw*1000/panelWatts); energy=count*panelWatts/1000*sunHours*efficiency. Simplified constant PSH model, no irradiance/temperature/roof simulation.",description:"Ceiling at exact integer boundaries; site variability excluded; do not describe as PVWatts-equivalent."}],
 sources:[{"label": "Work245 proposal 481 primary bibliographic reference", "url": "https://pvwatts.nrel.gov/", "note": "Bibliographic pointer supplied by researched proposal; not fetched or independently verified in this implementation. Scalar identities independently checked by dimensional arithmetic; no certification claim."}],
 examples:[{label:"Independent arithmetic golden",input:{"dailyEnergyTargetKwh": 12, "peakSunHours": 4, "systemEfficiency": 0.75, "panelRatedWatts": 500},expected:{"requiredSystemKw": 4, "panelCount": 8, "estimatedDailyKwh": 12}}],
 goldenTests:[{label:"Independent arithmetic golden",input:{"dailyEnergyTargetKwh": 12, "peakSunHours": 4, "systemEfficiency": 0.75, "panelRatedWatts": 500},expected:{"requiredSystemKw": 4, "panelCount": 8, "estimatedDailyKwh": 12}}]
};
