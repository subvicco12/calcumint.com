import{describe,expect,it}from"vitest";
import{hoursCalculator,timeCardCalculator}from"./catalog-batch-2";

const shift={startTime:"09:00",endTime:"17:00",overnight:false,breakMinutes:30};
describe("date-time direct-call domain guards",()=>{
 it("rejects negative and fractional break durations",()=>{
  for(const breakMinutes of [-1,0.5,Infinity])expect(()=>hoursCalculator.calculate({...shift,breakMinutes},{})).toThrow(/breakMinutes/);
 });
 it("rejects invalid shift break durations",()=>{
  for(const breakMinutes of [-1,0.5,Infinity])expect(()=>timeCardCalculator.calculate({shifts:[{...shift,breakMinutes}]},{})).toThrow(/breakMinutes/);
 });
 it("rejects empty and oversized shift lists",()=>{
  expect(()=>timeCardCalculator.calculate({shifts:[]},{})).toThrow(/between 1 and 31/);
  expect(()=>timeCardCalculator.calculate({shifts:Array.from({length:32},()=>({...shift}))},{})).toThrow(/between 1 and 31/);
 });
 it("preserves valid net hours and time cards",()=>{
  expect(hoursCalculator.calculate({...shift},{}).totalMinutes).toBe(450);
  expect(timeCardCalculator.calculate({shifts:[{...shift}]},{}).totalMinutes).toBe(450);
 });
});
