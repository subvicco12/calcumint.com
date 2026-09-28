import { z } from "zod";
import type { CalculatorDefinition } from "../types";
import { addDays, isoDateString } from "./gregorian";
const source={label:"ISO 8601 date representation",url:"https://www.iso.org/iso-8601-date-and-time-format.html",note:"Date-only inputs use ISO YYYY-MM-DD. CalcuMint contract: these calculators add an exact number of elapsed Gregorian calendar days, not calendar months, without timezone or current-clock dependencies."};
const base={category:"date-time",version:1,riskClass:"standard" as const,reviewStatus:"draft" as const,sources:[source]};
type In={date:string};type Out={date:string};
function make(id:string,slug:string,title:string,days:number):CalculatorDefinition<In,Out>{return{...base,id,slug,title,inputSchema:z.object({date:isoDateString}),calculate:({date})=>({date:addDays(date,days)}),formulas:[{id:"exact-day-offset",expression:`target date = input date + ${days} elapsed calendar days`,description:`Adds exactly ${days} Gregorian calendar days; it does not substitute calendar months.`}],examples:[{label:`${days}-day offset`,input:{date:"2024-02-01"},expected:{date:addDays("2024-02-01",days)}}],goldenTests:[{label:`${days}-day offset`,input:{date:"2024-02-01"},expected:{date:addDays("2024-02-01",days)}}],ui:{simpleInputKeys:["date"]}}}
export const thirtyDayCalculator=make("date-time.30-day","30-day-calculator","30 Day Calculator",30);
export const sixtyDayCalculator=make("date-time.60-day","60-day-calculator","60 Day Calculator",60);
export const ninetyDayCalculator=make("date-time.90-day","90-day-calculator","90 Day Calculator",90);
export const dateTimeBatch3Definitions=[ninetyDayCalculator,thirtyDayCalculator,sixtyDayCalculator] as const;
