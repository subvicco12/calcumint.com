import{describe,expect,it}from"vitest";
import{reynoldsNumberCalculator,hydrostaticPressureCalculator,buoyancyCalculator,specificGravityCalculator,dynamicPressureCalculator}from"./fluid-mechanics-batch-1";

describe("fluid mechanics direct-call domain",()=>{
 it("rejects invalid viscosity and velocity",()=>{
  expect(()=>reynoldsNumberCalculator.calculate({densityKgM3:1000,velocityMps:2,lengthM:0.05,dynamicViscosityPas:0})).toThrow(/supported domain/);
  expect(()=>dynamicPressureCalculator.calculate({densityKgM3:1.225,velocityMps:-20})).toThrow(/supported domain/);
 });
 it("rejects invalid depth, displaced volume and reference density",()=>{
  expect(()=>hydrostaticPressureCalculator.calculate({densityKgM3:1000,depthM:-1,gravityMps2:9.80665})).toThrow(/supported domain/);
  expect(()=>buoyancyCalculator.calculate({fluidDensityKgM3:1000,displacedVolumeM3:Infinity,gravityMps2:9.80665})).toThrow(/supported domain/);
  expect(()=>specificGravityCalculator.calculate({substanceDensityKgM3:850,referenceDensityKgM3:0})).toThrow(/supported domain/);
 });
 it("preserves valid worked examples",()=>{
  expect(hydrostaticPressureCalculator.calculate({densityKgM3:1000,depthM:10,gravityMps2:9.80665}).value).toBe(98066.5);
  expect(dynamicPressureCalculator.calculate({densityKgM3:1.225,velocityMps:20}).value).toBe(245);
 });
});
