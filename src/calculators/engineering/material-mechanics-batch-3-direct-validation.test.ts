import{describe,expect,it}from"vitest";
import{bendingStress,torsionalShear,cantileverDeflection,thermalExpansion,hookesLaw}from"./material-mechanics-batch-3";
describe("material mechanics batch three direct-call validation",()=>{
 it("rejects invalid bending, torsion and beam inputs",()=>{
 expect(()=>bendingStress.calculate({bendingMomentNm:1000,distanceFromNeutralAxisM:0.05,secondMomentAreaM4:0})).toThrow(/supported domain/);
 expect(()=>torsionalShear.calculate({torqueNm:500,radiusM:0.02,polarMomentM4:-1})).toThrow(/supported domain/);
 expect(()=>cantileverDeflection.calculate({endLoadN:1000,lengthM:1,youngsModulusPa:0,secondMomentAreaM4:0.000001})).toThrow(/supported domain/);
 });
 it("rejects invalid thermal expansion and spring inputs",()=>{
 expect(()=>thermalExpansion.calculate({originalLengthM:0,thermalExpansionPerK:0.000012,temperatureChangeK:50})).toThrow(/supported domain/);
 expect(()=>hookesLaw.calculate({springConstantNm:100,displacementM:Infinity})).toThrow(/supported domain/);
 });
 it("preserves valid worked examples",()=>{
 expect(hookesLaw.calculate({springConstantNm:100,displacementM:0.05}).value).toBe(-5);
 expect(thermalExpansion.calculate({originalLengthM:2,thermalExpansionPerK:0.000012,temperatureChangeK:50}).value).toBeCloseTo(0.0012);
 });
});
