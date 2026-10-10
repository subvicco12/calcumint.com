import{describe,expect,it}from"vitest";
import{frictionFactorCalculator,darcyWeisbachCalculator,orificeFlowCalculator,machNumberCalculator,speedOfSoundCalculator}from"./fluid-mechanics-batch-3";
describe("fluid mechanics batch three direct-call validation",()=>{
 it("rejects invalid friction and head-loss inputs",()=>{
 expect(()=>frictionFactorCalculator.calculate({reynoldsNumber:0,relativeRoughness:0})).toThrow(/supported domain/);
 expect(()=>darcyWeisbachCalculator.calculate({frictionFactor:0.02,lengthM:100,diameterM:0,velocityMps:2,gravityMps2:9.80665})).toThrow(/supported domain/);
 });
 it("rejects invalid orifice, Mach and gas inputs",()=>{
 expect(()=>orificeFlowCalculator.calculate({dischargeCoefficient:1.1,diameterM:0.05,pressureDifferencePa:10000,densityKgM3:1000})).toThrow(/supported domain/);
 expect(()=>machNumberCalculator.calculate({speedMps:340,speedOfSoundMps:0})).toThrow(/supported domain/);
 expect(()=>speedOfSoundCalculator.calculate({temperatureC:-101,gamma:1.4,specificGasConstantJkgK:287.05})).toThrow(/supported domain/);
 });
 it("preserves valid Mach and laminar friction examples",()=>{
 expect(machNumberCalculator.calculate({speedMps:340,speedOfSoundMps:340}).value).toBe(1);
 expect(frictionFactorCalculator.calculate({reynoldsNumber:1000,relativeRoughness:0}).value).toBe(0.064);
 });
});
