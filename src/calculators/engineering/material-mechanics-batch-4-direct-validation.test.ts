import{describe,expect,it}from"vitest";
import{polarMomentSolidShaft,angleOfTwist,torsionalStiffness,shaftPower,helicalSpringDeflection}from"./material-mechanics-batch-4";
describe("material mechanics batch four direct-call validation",()=>{
 it("rejects invalid shaft and spring inputs",()=>{
 expect(()=>polarMomentSolidShaft.calculate({diameterM:-1})).toThrow(/supported domain/);
 expect(()=>angleOfTwist.calculate({torqueNm:1000,lengthM:2,shearModulusPa:0,polarMomentM4:0.000001})).toThrow(/supported domain/);
 expect(()=>torsionalStiffness.calculate({shearModulusPa:80000000000,polarMomentM4:0.000001,lengthM:0})).toThrow(/supported domain/);
 expect(()=>shaftPower.calculate({torqueNm:200,angularSpeedRadS:Infinity})).toThrow(/supported domain/);
 expect(()=>helicalSpringDeflection.calculate({forceN:100,meanCoilDiameterM:0.05,activeCoils:10,wireDiameterM:0,shearModulusPa:80000000000})).toThrow(/supported domain/);
 });
 it("preserves valid examples",()=>{
 expect(angleOfTwist.calculate({torqueNm:1000,lengthM:2,shearModulusPa:80000000000,polarMomentM4:0.000001}).value).toBe(0.025);
 expect(shaftPower.calculate({torqueNm:200,angularSpeedRadS:100}).value).toBe(20000);
 });
});
