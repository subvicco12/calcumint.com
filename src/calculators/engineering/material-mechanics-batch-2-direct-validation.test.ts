import{describe,expect,it}from"vitest";
import{bulkModulus,shearModulus,thermalStrain,factorOfSafety,axialDeformation}from"./material-mechanics-batch-2";
describe("material mechanics batch two direct-call validation",()=>{
 it("rejects invalid modulus denominators",()=>{
 expect(()=>bulkModulus.calculate({pressureChangePa:2000000,volumetricStrain:0})).toThrow(/supported domain/);
 expect(()=>shearModulus.calculate({shearStressPa:50000000,shearStrain:0})).toThrow(/supported domain/);
 });
 it("rejects invalid thermal, safety and deformation inputs",()=>{
 expect(()=>thermalStrain.calculate({thermalExpansionPerK:Infinity,temperatureChangeK:50})).toThrow(/supported domain/);
 expect(()=>factorOfSafety.calculate({strengthPa:250000000,workingStressPa:0})).toThrow(/supported domain/);
 expect(()=>axialDeformation.calculate({forceN:10000,lengthM:2,areaM2:0,youngsModulusPa:200000000000})).toThrow(/supported domain/);
 });
 it("preserves valid worked examples",()=>{
 expect(factorOfSafety.calculate({strengthPa:250000000,workingStressPa:100000000}).value).toBe(2.5);
 expect(thermalStrain.calculate({thermalExpansionPerK:0.000012,temperatureChangeK:50}).value).toBeCloseTo(0.0006);
 });
});
