import { z } from "zod";
import type { CalculatorDefinition } from "../types";
import { parseDecimal, formatRational } from "../core/draft-exact-decimal";

// Owner-authorized draft only. Deliberately absent from the registry.
const valueSchema = z.string().max(160).superRefine((value, ctx) => {
 if (!/^\+?(?:\d+(?:\.\d*)?|\.\d+)$/.test(value)) {ctx.addIssue({code:"custom",message:"Use a nonnegative plain decimal string"});return;}
 const unsigned=value.replace(/^\+/, "");
 const [integer, fraction=""]=unsigned.split(".");
 const digits=(integer+fraction).replace(/^0+/, "");
 if (!digits) {ctx.addIssue({code:"custom",message:"Fuel economy must be strictly positive"});return;}
 const adjustedExponent=integer.replace(/^0+/, "").length > 0 ? integer.replace(/^0+/, "").length-1 : -fraction.search(/[1-9]/)-1;
 if (digits.length>34 || adjustedExponent < -20 || adjustedExponent > 20) ctx.addIssue({code:"custom",message:"At most 34 significant digits and adjusted exponent -20..20 required"});
});
const units = ["km_per_l", "l_per_100km", "mpg_us", "mpg_imp"] as const;
const inputSchema=z.object({value:valueSchema,fromUnit:z.enum(units),toUnit:z.enum(units)});
type Input=z.infer<typeof inputSchema>;
type Output={result:string};
export const draftMaster435Calculator:CalculatorDefinition<Input,Output>={
 id:"conversion.fuel-economy",slug:"fuel-economy-converter",title:"Fuel Economy Converter",category:"unit-conversions",version:1,riskClass:"standard",reviewStatus:"draft",
 inputSchema,
 calculate:(input)=>{
  const {value,fromUnit,toUnit}=inputSchema.parse(input);
  const {numerator,denominator}=parseDecimal(value,34,100);
  if(fromUnit===toUnit)return {result:formatRational(numerator,denominator,34)};
  // Normalize to km/L as an exact rational, then convert without intermediate rounding.
  let n=numerator,d=denominator;
  if (fromUnit==="l_per_100km") {n=100n*denominator;d=numerator;}
  else if (fromUnit==="mpg_us") {n*=1609344n*1000000000n;d*=1000000n*3785411784n;}
  else if (fromUnit==="mpg_imp") {n*=1609344n*100000n;d*=1000000n*454609n;}
  if (toUnit==="l_per_100km") return {result:formatRational(100n*d,n,34)};
  if (toUnit==="mpg_us") {n*=1000000n*3785411784n;d*=1609344n*1000000000n;}
  else if (toUnit==="mpg_imp") {n*=1000000n*454609n;d*=1609344n*100000n;}
  return {result:formatRational(n,d,34)};
 },
 formulas:[{id:"exact-conversion",expression:"Normalize to km/L: km_per_l=x; l_per_100km=100/x; mpg_us=x*1.609344/3.785411784; mpg_imp=x*1.609344/4.54609. Reverse exactly, round once to 34 significant digits, half-even.",description:"Exact international mile and US/imperial gallon constants. Positive economy/consumption only; excludes distance/fuel measurement, trip costs, and master 459."}],
 sources:[{label:"NIST exact conversion factors",url:"https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b9",note:"Exact international mile and US/imperial gallon constants. Positive economy/consumption only; excludes distance/fuel measurement, trip costs, and master 459."}],
 examples:[],ui:{simpleInputKeys:["value","fromUnit","toUnit"]}
};
