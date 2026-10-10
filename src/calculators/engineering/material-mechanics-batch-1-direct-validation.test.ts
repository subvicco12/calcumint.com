import{describe,expect,it}from"vitest";
import{normalStress,engineeringStrain,youngsModulus,poissonsRatio,shearStress}from"./material-mechanics-batch-1";

describe("material mechanics direct-call domain",()=>{
 it("rejects zero or invalid denominators",()=>{
  expect(()=>normalStress.calculate({forceN:10000,areaM2:0})).toThrow(/supported domain/);
  expect(()=>engineeringStrain.calculate({changeLengthM:0.002,originalLengthM:-1})).toThrow(/supported domain/);
  expect(()=>youngsModulus.calculate({stressPa:200000000,strain:0})).toThrow(/supported domain/);
  expect(()=>poissonsRatio.calculate({lateralStrain:-0.0003,axialStrain:0})).toThrow(/supported domain/);
  expect(()=>shearStress.calculate({shearForceN:5000,areaM2:Infinity})).toThrow(/supported domain/);
 });
 it("preserves valid worked examples",()=>{
  expect(normalStress.calculate({forceN:10000,areaM2:0.01}).value).toBe(1000000);
  expect(poissonsRatio.calculate({lateralStrain:-0.0003,axialStrain:0.001}).value).toBeCloseTo(0.3);
 });
});
