import{describe,expect,it}from"vitest";
import{timeDurationCalculator,hoursCalculator,timeCardCalculator}from"./catalog-batch-2";

describe("direct duration overnight flag validation",()=>{
 it("rejects truthy nonboolean overnight flags in duration and hours",()=>{
  expect(()=>timeDurationCalculator.calculate({startTime:"22:00",endTime:"01:00",overnight:"yes" as unknown as boolean},{})).toThrow(/overnight must be a boolean/);
  expect(()=>hoursCalculator.calculate({startTime:"22:00",endTime:"01:00",overnight:1 as unknown as boolean,breakMinutes:0},{})).toThrow(/overnight must be a boolean/);
 });
 it("rejects nonboolean overnight flag in time-card shifts",()=>{
  expect(()=>timeCardCalculator.calculate({shifts:[{startTime:"22:00",endTime:"01:00",overnight:"true" as unknown as boolean,breakMinutes:0}]},{})).toThrow(/overnight must be a boolean/);
 });
 it("preserves valid overnight and same-day durations",()=>{
  expect(timeDurationCalculator.calculate({startTime:"22:30",endTime:"01:15",overnight:true},{}).totalMinutes).toBe(165);
  expect(timeDurationCalculator.calculate({startTime:"09:00",endTime:"17:00",overnight:false},{}).totalMinutes).toBe(480);
 });
});
