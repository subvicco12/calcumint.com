import{describe,expect,it}from"vitest";
import{volumetricFlowRateCalculator,massFlowRateCalculator,pipeVelocityCalculator,kinematicViscosityCalculator,bernoulliPressureCalculator}from"./fluid-mechanics-batch-2";
describe("fluid mechanics batch two direct-call validation",()=>{
 it("rejects invalid flow and viscosity inputs",()=>{
 expect(()=>volumetricFlowRateCalculator.calculate({areaM2:0,velocityMps:2})).toThrow(/supported domain/);
 expect(()=>massFlowRateCalculator.calculate({densityKgM3:1000,areaM2:0.01,velocityMps:-2})).toThrow(/supported domain/);
 expect(()=>pipeVelocityCalculator.calculate({flowRateM3s:0.01,diameterM:0})).toThrow(/supported domain/);
 expect(()=>kinematicViscosityCalculator.calculate({dynamicViscosityPas:0.001,densityKgM3:Infinity})).toThrow(/supported domain/);
 });
 it("rejects invalid Bernoulli pressure and preserves valid example",()=>{
 expect(()=>bernoulliPressureCalculator.calculate({pressure1Pa:100000,densityKgM3:1000,velocity1Mps:1,velocity2Mps:2,height1M:0,height2M:0,gravityMps2:0})).toThrow(/supported domain/);
 expect(volumetricFlowRateCalculator.calculate({areaM2:0.05,velocityMps:2}).value).toBe(0.1);
 });
});
