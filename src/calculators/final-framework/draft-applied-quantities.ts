import { solarPanelSizingDraftCalculator } from "../energy/draft-master-481";
import { evChargingEnergyDraftCalculator } from "../energy/draft-master-484";
import { rainwaterHarvestingDraftCalculator } from "../energy/draft-master-487";
import { ingredientWeightVolumeDraftCalculator } from "../food/draft-master-498";
import { powerWeightRatioDraftCalculator } from "../sports/draft-master-529";
import { createCalculationSnapshot } from "@/lib/calculation-snapshot";
import type { CalculatorDefinition, CalculatorContext } from "../types";
import type { PresentationDefinition, ResultMetric, StructuredCalculationResult } from "./types";
export type DraftAppliedQuantitiesMasterId = 481 | 484 | 487 | 498 | 529;
export const draftAppliedQuantitiesPresentation = {
  id:"draft.applied-quantities", domain:"everyday-life", family:"simple-scalar", level:"essential",
  supportedVisualizations:[],supportsSchedule:false,supportsGoalSolver:false,supportsScenarios:false,supportsSensitivity:false
} as const satisfies PresentationDefinition;
const metric = (id:string,label:string,value:number,unit:string):ResultMetric => ({id,label,value:Number(value.toPrecision(6)).toString(),unit});
function capture<I extends Record<string,unknown>, O extends Record<string,unknown>>(definition:CalculatorDefinition<I,O>,input:unknown,context:CalculatorContext,present:(output:O,parsed:I)=>ResultMetric[]) {
  const parsed=definition.inputSchema.parse(input);
  const output=definition.calculate(parsed,context);
  const snapshot=createCalculationSnapshot({calculatorSlug:definition.slug,calculatorVersion:definition.version,input:{...parsed},output:{...output}});
  const [primaryResult,...metrics]=present(output,parsed);
  const result:StructuredCalculationResult={primaryResult,metrics,methodology:definition.formulas.map(f=>`${f.expression} ${f.description}`).join(" "),sources:definition.sources,warnings:["DRAFT — unregistered, uncertified and unpublished. Not authorized for release.",`Technical version: ${definition.version}. Display uses six significant digits; exports preserve raw engine precision.`]};
  return {snapshot,result};
}
/** Private draft harness; no route, registry or persistence writer. */
export function calculateDraftAppliedQuantities(masterId:DraftAppliedQuantitiesMasterId,input:unknown,context:CalculatorContext={}) {
 switch(masterId) {
  case 481:return capture(solarPanelSizingDraftCalculator,input,context,o=>[metric("requiredSystemKw","Required system size",o.requiredSystemKw,"kW"),{id:"panelCount",label:"Panel count",value:String(o.panelCount),unit:"panels"},metric("estimatedDailyKwh","Estimated daily generation",o.estimatedDailyKwh,"kWh/day")]);
  case 484:return capture(evChargingEnergyDraftCalculator,input,context,o=>[metric("wallEnergyKwh","Wall energy",o.wallEnergyKwh,"kWh"),metric("lossKwh","Charging loss",o.lossKwh,"kWh")]);
  case 487:return capture(rainwaterHarvestingDraftCalculator,input,context,o=>[metric("collectedVolumeM3","Collected volume",o.collectedVolumeM3,"m³"),metric("theoreticalVolumeM3","Theoretical volume",o.theoreticalVolumeM3,"m³"),metric("collectedLiters","Collected volume",o.collectedLiters,"L")]);
  case 498:return capture(ingredientWeightVolumeDraftCalculator,input,context,(o,i)=>[metric("convertedValue","Converted ingredient quantity",o.convertedValue,i.direction==="massToVolume"?"mL":"g")]);
  case 529:return capture(powerWeightRatioDraftCalculator,input,context,o=>[metric("wattsPerKg","Power per supplied mass",o.wattsPerKg,"W/kg")]);
  default:throw new Error("Unsupported unpublished draft master identity");
 }
}
