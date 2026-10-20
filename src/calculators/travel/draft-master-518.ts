import { z } from 'zod';
import type { CalculatorDefinition } from '../types';
export type SleepDurationInput = { sleepStart: string; wakeEnd: string; awakeMinutes: number };
export type SleepDurationOutput = {elapsedMinutes:number; estimatedSleepMinutes:number; awakeMinutes:number; steps:string[]};
/** ISO dates 0001..9999, minute precision, explicit Z or numeric offset. -00:00 means unknown and is rejected. */
function instant(s:string):number {
  const m=/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(Z|([+-])(\d{2}):(\d{2}))$/.exec(s);
  if(!m)throw new Error('Require YYYY-MM-DDTHH:mm with explicit Z or ±HH:mm offset');
  const [year,month,day,hour,minute]=m.slice(1,6).map(Number);
  const oh=Number(m[8]??0),om=Number(m[9]??0);
  const leap=year%4===0&&(year%100!==0||year%400===0);
  const days=[31,leap?29:28,31,30,31,30,31,31,30,31,30,31];
  if(year<1||month<1||month>12||day<1||day>days[month-1]||hour>23||minute>59||oh>23||om>59||m[6]==='-00:00')throw new Error('Invalid calendar date, time or offset');
  const d=new Date(0);d.setUTCFullYear(year,month-1,day);d.setUTCHours(hour,minute,0,0);
  const value=d.getTime()-(m[7]==='-'?-1:1)*(oh*60+om)*60000;
  if(!Number.isSafeInteger(value))throw new Error('Instant outside supported range');
  return value;
}
const timestamp=z.string().superRefine((s,ctx)=>{try{instant(s);}catch{ctx.addIssue({code:'custom',message:'Invalid explicit-offset minute timestamp'});}});
const inputSchema:z.ZodType<SleepDurationInput>=z.object({sleepStart:timestamp,wakeEnd:timestamp,awakeMinutes:z.number().finite().int().nonnegative()}).strict().superRefine((i,ctx)=>{
  try {const elapsed=(instant(i.wakeEnd)-instant(i.sleepStart))/60000;if(elapsed<0||i.awakeMinutes>elapsed)ctx.addIssue({code:'custom',message:'End must follow start and awake minutes cannot exceed elapsed minutes'});}catch{/* Timestamp issues above. */}
});
export const sleepDurationCalculator:CalculatorDefinition<SleepDurationInput,SleepDurationOutput>={
 id:'travel.sleep-duration',slug:'sleep-duration-calculator',title:'Sleep Duration Calculator',category:'everyday',version:1,riskClass:'standard',reviewStatus:'draft',inputSchema,
 calculate(raw){const i=inputSchema.parse(raw);const elapsedMinutes=(instant(i.wakeEnd)-instant(i.sleepStart))/60000;
 return {elapsedMinutes,estimatedSleepMinutes:elapsedMinutes-i.awakeMinutes,awakeMinutes:i.awakeMinutes,steps:[`Elapsed UTC instant minutes = ${elapsedMinutes}`,`Estimated sleep minutes = ${elapsedMinutes} − ${i.awakeMinutes} = ${elapsedMinutes-i.awakeMinutes}`,'Offsets are caller-supplied; no local timezone or DST validity is inferred. This is an elapsed-time estimate.']};},
 formulas:[{id:'elapsed-sleep',expression:'elapsed = (wakeInstant − sleepInstant) / 60000; estimatedSleep = elapsed − awakeMinutes',description:'Integer minute arithmetic on explicit instants; no rounding, cycle planning or clinical guidance.'}],
 sources:[{label:'ECMAScript Date Objects — time values and UTC calendar arithmetic',url:'https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date-objects',note:'Primary language specification reference for the Date arithmetic used here.'},{label:'Gregorian calendar and explicit ISO offset instant arithmetic',note:'DRAFT, unregistered. Caller is responsible for offsets; named timezone rules are not inferred.'}],examples:[],goldenTests:[{label:'Overnight elapsed interval',input:{sleepStart:'2026-01-01T23:00Z',wakeEnd:'2026-01-02T07:00Z',awakeMinutes:30},expected:{elapsedMinutes:480,estimatedSleepMinutes:450}}],
};
