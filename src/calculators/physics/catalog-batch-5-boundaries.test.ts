import{describe,expect,it}from"vitest";
import{physicalPendulum,rollingKinetic,uniformRodInertia,angularKinematics,rollingSpeed}from"./catalog-batch-5";

describe("draft mechanics calculators boundary contracts",()=>{
 it("keeps all new mechanics definitions draft and standard risk",()=>{
  for(const calculator of [physicalPendulum,rollingKinetic,uniformRodInertia,angularKinematics,rollingSpeed]){
   expect(calculator.reviewStatus).toBe("draft");
   expect(calculator.riskClass).toBe("standard");
  }
 });
 it("rejects zero pendulum gravity rather than calculating an infinite period",()=>{
  expect(physicalPendulum.inputSchema.safeParse({momentOfInertiaKgM2:2,massKg:1,gravityMps2:0,pivotToComM:0.5}).success).toBe(false);
 });
 it("rejects non-finite angular velocity inputs",()=>{
  expect(rollingKinetic.inputSchema.safeParse({massKg:2,linearSpeedMps:Infinity,momentOfInertiaKgM2:1,angularSpeedRadS:4}).success).toBe(false);
 });
 it("returns zero inertia for a zero-length rod",()=>{
  const input=uniformRodInertia.inputSchema.parse({massKg:3,lengthM:0});
  expect(uniformRodInertia.calculate(input,{}).value).toBe(0);
 });
 it("returns zero angular displacement at zero elapsed time",()=>{
  const input=angularKinematics.inputSchema.parse({initialAngularSpeedRadS:3,angularAccelerationRadS2:4,timeS:0});
  expect(angularKinematics.calculate(input,{}).value).toBe(0);
 });
 it("rejects negative rolling radius and preserves zero radius",()=>{
  expect(rollingSpeed.inputSchema.safeParse({angularSpeedRadS:5,radiusM:-1}).success).toBe(false);
  const input=rollingSpeed.inputSchema.parse({angularSpeedRadS:5,radiusM:0});
  expect(rollingSpeed.calculate(input,{}).value).toBe(0);
 });
});
