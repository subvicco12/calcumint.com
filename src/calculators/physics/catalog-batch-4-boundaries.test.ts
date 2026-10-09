import{describe,expect,it}from"vitest";
import{restitutionCalculator,solidDiskInertiaCalculator,pendulumPeriodCalculator,rotatingFrameCentrifugalCalculator,radiusOfGyrationCalculator}from"./catalog-batch-4";

describe("draft mechanics batch four boundary contracts",()=>{
 it("preserves DRAFT lifecycle and standard risk for all five calculators",()=>{
  for(const calculator of [restitutionCalculator,solidDiskInertiaCalculator,pendulumPeriodCalculator,rotatingFrameCentrifugalCalculator,radiusOfGyrationCalculator]){
   expect(calculator.reviewStatus).toBe("draft");
   expect(calculator.riskClass).toBe("standard");
  }
 });
 it("rejects zero approach speed for restitution",()=>{
  expect(restitutionCalculator.inputSchema.safeParse({approachSpeed:0,recessionSpeed:3}).success).toBe(false);
 });
 it("preserves zero solid-disk inertia for zero radius",()=>{
  const input=solidDiskInertiaCalculator.inputSchema.parse({massKg:4,radiusM:0});
  expect(solidDiskInertiaCalculator.calculate(input).value).toBe(0);
 });
 it("rejects zero gravity in the pendulum period schema",()=>{
  expect(pendulumPeriodCalculator.inputSchema.safeParse({lengthM:1,gravityMps2:0}).success).toBe(false);
 });
 it("rejects non-finite angular speed for centrifugal force",()=>{
  expect(rotatingFrameCentrifugalCalculator.inputSchema.safeParse({massKg:2,angularSpeedRadS:Infinity,radiusM:4}).success).toBe(false);
 });
 it("rejects zero mass for radius of gyration",()=>{
  expect(radiusOfGyrationCalculator.inputSchema.safeParse({momentOfInertiaKgM2:8,massKg:0}).success).toBe(false);
 });
});
