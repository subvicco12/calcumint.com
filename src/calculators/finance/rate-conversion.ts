import { z } from "zod";
import { roundTo } from "../precision";
import type { CalculatorDefinition } from "../types";

const inputSchema=z.discriminatedUnion("mode",[
  z.object({mode:z.literal("nominal-to-effective"),annualNominalPercent:z.number().finite().min(-99.999999).max(100000),compoundsPerYear:z.number().int().min(1).max(100000)}),
  z.object({mode:z.literal("effective-to-nominal"),annualEffectivePercent:z.number().finite().min(-99.999999).max(100000),compoundsPerYear:z.number().int().min(1).max(100000)}),
]);
type Input=z.infer<typeof inputSchema>;
type Output={annualNominalPercent:number;annualEffectivePercent:number;compoundsPerYear:number};

function finite(value:number,label:string){if(!Number.isFinite(value))throw new Error(`${label} exceeds supported numeric range`);return value;}

export function nominalToEffectivePercent(nominalPercent:number,compoundsPerYear:number):number{
  if(!Number.isFinite(nominalPercent)||!Number.isInteger(compoundsPerYear)||compoundsPerYear<1)throw new Error("Rate conversion inputs must be finite with a positive integer compounding frequency");
  const periodic=nominalPercent/100/compoundsPerYear;
  if(periodic<=-1)throw new Error("Periodic rate must be greater than -100%");
  return finite((Math.pow(1+periodic,compoundsPerYear)-1)*100,"Effective annual rate");
}
export function effectiveToNominalPercent(effectivePercent:number,compoundsPerYear:number):number{
  if(!Number.isFinite(effectivePercent)||!Number.isInteger(compoundsPerYear)||compoundsPerYear<1)throw new Error("Rate conversion inputs must be finite with a positive integer compounding frequency");
  const effective=effectivePercent/100;
  if(effective<=-1)throw new Error("Effective annual rate must be greater than -100%");
  return finite(compoundsPerYear*(Math.pow(1+effective,1/compoundsPerYear)-1)*100,"Nominal annual rate");
}
export function convertAnnualRate(input:Input):Output{
  if(input.mode==="nominal-to-effective")return{annualNominalPercent:roundTo(input.annualNominalPercent,8),annualEffectivePercent:roundTo(nominalToEffectivePercent(input.annualNominalPercent,input.compoundsPerYear),8),compoundsPerYear:input.compoundsPerYear};
  return{annualNominalPercent:roundTo(effectiveToNominalPercent(input.annualEffectivePercent,input.compoundsPerYear),8),annualEffectivePercent:roundTo(input.annualEffectivePercent,8),compoundsPerYear:input.compoundsPerYear};
}
export const rateConversionCalculator:CalculatorDefinition<Input,Output>={
  id:"finance.rate-conversion",slug:"effective-interest-rate-calculator",title:"Nominal & Effective Interest Rate Calculator",category:"finance-investment",version:1,riskClass:"financial",reviewStatus:"draft",inputSchema,calculate:(input)=>convertAnnualRate(input),
  formulas:[{id:"effective",expression:"EAR=(1+r_nominal/m)^m-1",description:"Converts a nominal annual rate compounded m times per year to its effective annual rate."},{id:"nominal",expression:"r_nominal=m((1+EAR)^(1/m)-1)",description:"Converts an effective annual rate to the equivalent nominal annual rate for m compounding periods."}],
  sources:[],examples:[],jurisdictions:[{country:"GLOBAL"}],ui:{simpleInputKeys:["mode","compoundsPerYear"],advancedInputKeys:["annualNominalPercent","annualEffectivePercent"]},relatedCalculators:["compound-interest-calculator","term-deposit-calculator","sip-calculator"],journeyMemberships:["invest-for-a-goal"]
};
