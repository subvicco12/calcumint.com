import { z } from "zod";
import type { CalculatorDefinition } from "../types";

type Input={value:number;fromUnit:string;toUnit:string};type Output={result:number};type Unit={code:string;milliliters:number};
const units:readonly Unit[]=[
 {code:"ml",milliliters:1},{code:"l",milliliters:1000},{code:"tsp_us",milliliters:4.928922},
 {code:"tbsp_us",milliliters:14.78676},{code:"fl_oz_us",milliliters:29.57353},
 {code:"cup_us",milliliters:236.58824},{code:"pint_us",milliliters:473.1765},
 {code:"quart_us",milliliters:946.3529},{code:"gallon_us",milliliters:3785.412}
];
const codes=units.map(u=>u.code),map=new Map(units.map(u=>[u.code,u.milliliters]));
export const cookingMeasurementConverter:CalculatorDefinition<Input,Output>={
 id:"conversion.cooking-measurement",slug:"cooking-measurement-converter",title:"Cooking Measurement Converter",category:"unit-conversions",version:1,riskClass:"standard",reviewStatus:"draft",
 inputSchema:z.object({value:z.number().finite().nonnegative(),fromUnit:z.string().refine(v=>codes.includes(v),"Unsupported source unit"),toUnit:z.string().refine(v=>codes.includes(v),"Unsupported target unit")}),
 calculate:({value,fromUnit,toUnit})=>{if(!Number.isFinite(value)||value<0||!map.has(fromUnit)||!map.has(toUnit))throw new Error("Cooking conversion inputs must be finite and use supported units");if(fromUnit===toUnit)return{result:value};const result=value*(map.get(fromUnit)!/map.get(toUnit)!);if(!Number.isFinite(result))throw new Error("Converted result is outside the supported finite range");return{result};},
 formulas:[{id:"us-kitchen-volume",expression:"target = source × source milliliters / target milliliters",description:"Converts U.S. customary kitchen volume units and metric volume through milliliters. Ingredient mass-volume conversion is intentionally excluded because it depends on ingredient density."}],
 sources:[
  {label:"NIST Guide to the SI — conversion factors",url:"https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b9",note:"Reference factors for U.S. customary fluid ounce, gallon, tablespoon and teaspoon volume units."},
  {label:"NIST Metric Kitchen — Cooking Measurement Equivalencies",url:"https://www.nist.gov/pml/owm/metric-si/metric-kitchen/metric-kitchen-cooking-measurement-equivalencies",note:"Cooking-oriented metric and U.S. customary capacity equivalencies; values are approximate for household cooking."}
 ],
 examples:[{label:"Convert one U.S. cup to milliliters",input:{value:1,fromUnit:"cup_us",toUnit:"ml"},expected:{result:236.58824}}],
 goldenTests:[{label:"U.S. customary cup fixture",input:{value:1,fromUnit:"cup_us",toUnit:"fl_oz_us"},expected:{result:8}}],
 ui:{simpleInputKeys:["value","fromUnit","toUnit"]}
};
export const conversionBatch4Definitions=[cookingMeasurementConverter] as const;
