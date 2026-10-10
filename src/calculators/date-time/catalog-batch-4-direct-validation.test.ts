import{describe,expect,it}from"vitest";
import{timeZoneCalculator}from"./catalog-batch-4";

const base={localDateTime:"2026-09-29T12:00",sourceOffsetMinutes:330,targetOffsetMinutes:0};
describe("timezone direct-call offset validation",()=>{
 it("rejects noninteger source and target offsets",()=>{
  expect(()=>timeZoneCalculator.calculate({...base,sourceOffsetMinutes:330.5},{})).toThrow(/integer minutes/);
  expect(()=>timeZoneCalculator.calculate({...base,targetOffsetMinutes:0.5},{})).toThrow(/integer minutes/);
 });
 it("rejects out-of-range UTC offsets",()=>{
  expect(()=>timeZoneCalculator.calculate({...base,sourceOffsetMinutes:-841},{})).toThrow(/integer minutes/);
  expect(()=>timeZoneCalculator.calculate({...base,targetOffsetMinutes:841},{})).toThrow(/integer minutes/);
 });
 it("rejects nonfinite offsets",()=>{
  expect(()=>timeZoneCalculator.calculate({...base,sourceOffsetMinutes:Infinity},{})).toThrow(/integer minutes/);
 });
 it("preserves valid fixed-offset conversion",()=>{
  expect(timeZoneCalculator.calculate(base,{})).toEqual({localDateTime:"2026-09-29T06:30",utcOffsetMinutes:0});
 });
});
