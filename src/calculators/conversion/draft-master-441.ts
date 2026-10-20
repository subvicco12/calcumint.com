import { z } from "zod";
import type { CalculatorDefinition } from "../types";
import { parseDecimal, formatRational } from "../core/draft-exact-decimal";

// Owner-authorized draft only. Deliberately absent from the registry.
const valueSchema = z.string().max(160).superRefine((value, ctx) => {
 if (!/^\+?(?:\d+(?:\.\d*)?|\.\d+)$/.test(value)) {ctx.addIssue({code:"custom",message:"Use a nonnegative plain decimal string"});return;}
 const unsigned=value.replace(/^\+/, "");
 const [integer, fraction=""]=unsigned.split(".");
 const digits=(integer+fraction).replace(/^0+/, "");
 if (!digits) {return;}
 const adjustedExponent=integer.replace(/^0+/, "").length > 0 ? integer.replace(/^0+/, "").length-1 : -fraction.search(/[1-9]/)-1;
 if (digits.length>34 || adjustedExponent < -20 || adjustedExponent > 20) ctx.addIssue({code:"custom",message:"At most 34 significant digits and adjusted exponent -20..20 required"});
});
const units = ["dpi", "dpcm", "dppx"] as const;
const inputSchema=z.object({value:valueSchema,fromUnit:z.enum(units),toUnit:z.enum(units)});
type Input=z.infer<typeof inputSchema>;
type Output={result:string};
export const draftMaster441Calculator:CalculatorDefinition<Input,Output>={
 id:"conversion.digital-resolution",slug:"digital-resolution-converter",title:"Digital Resolution Converter",category:"unit-conversions",version:1,riskClass:"standard",reviewStatus:"draft",
 inputSchema,
 calculate:(input)=>{
  const {value,fromUnit,toUnit}=inputSchema.parse(input);
  const {numerator,denominator}=parseDecimal(value,34,100);
  if(fromUnit===toUnit)return {result:formatRational(numerator,denominator,34)};
  const factors={dpi:[1n,1n],dpcm:[254n,100n],dppx:[96n,1n]} as const;
  const [fn,fd]=factors[fromUnit], [tn,td]=factors[toUnit];
  return {result:formatRational(numerator*fn*td,denominator*fd*tn,34)};
 },
 formulas:[{id:"exact-conversion",expression:"result = value * factor(from) / factor(to); dpi=1, dpcm=2.54, dppx=96. Exact rational intermediates, final 34 significant digits, half-even.",description:"CSS resolution density only: one reference pixel is 1/96 inch. Does not estimate device physical pixel dimensions, image dimensions, megapixels, or print size."}],
 sources:[{label:"W3C CSS Values and Units — resolution units",url:"https://www.w3.org/TR/css-values-4/#resolution",note:"CSS resolution density only: one reference pixel is 1/96 inch. Does not estimate device physical pixel dimensions, image dimensions, megapixels, or print size."}],
 examples:[],ui:{simpleInputKeys:["value","fromUnit","toUnit"]}
};
