import{describe,expect,it}from"vitest";
import{hollowPolar,hollowTorsionalStress,hollowTwist,cantileverSlope,cantileverUdlDeflection}from"./material-mechanics-batch-5";
describe("material mechanics batch five direct-call validation",()=>{
 it("rejects invalid hollow shaft geometry",()=>{
 expect(()=>hollowPolar.calculate({outerDiameterM:0.1,innerDiameterM:0.1})).toThrow(/supported domain/);
 expect(()=>hollowTorsionalStress.calculate({outerDiameterM:0.1,innerDiameterM:0.11,torqueNm:1000})).toThrow(/supported domain/);
 expect(()=>hollowTwist.calculate({outerDiameterM:0.1,innerDiameterM:0.06,torqueNm:1000,lengthM:2,shearModulusPa:0})).toThrow(/supported domain/);
 });
 it("rejects invalid beam dimensions",()=>{
 expect(()=>cantileverSlope.calculate({endLoadN:1000,lengthM:1,youngsModulusPa:200000000000,secondMomentAreaM4:0})).toThrow(/supported domain/);
 expect(()=>cantileverUdlDeflection.calculate({loadPerLengthNm:1000,lengthM:0,youngsModulusPa:200000000000,secondMomentAreaM4:0.000001})).toThrow(/supported domain/);
 });
 it("preserves valid examples",()=>{
 expect(cantileverSlope.calculate({endLoadN:1000,lengthM:1,youngsModulusPa:200000000000,secondMomentAreaM4:0.000001}).value).toBe(0.0025);
 expect(cantileverUdlDeflection.calculate({loadPerLengthNm:1000,lengthM:2,youngsModulusPa:200000000000,secondMomentAreaM4:0.000001}).value).toBe(0.01);
 });
});
