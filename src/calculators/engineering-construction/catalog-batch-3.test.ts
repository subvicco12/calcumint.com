import {describe,expect,it} from "vitest";
import {runCalculator} from "../engine";
import {poolVolumeCalculator,waterTankCalculator,pipeVolumeCalculator,electricalLoadCalculator,voltageDropCalculator,resistorCalculator,hvacBtuCalculator,solarPanelRequirementCalculator,batteryStorageCalculator} from "./catalog-batch-3";

describe("Engineering & Construction batch 3",()=>{
 it("matches verified examples",()=>{
  expect(runCalculator(poolVolumeCalculator,{lengthMeters:10,widthMeters:5,averageDepthMeters:1.5}).output.value).toBe(75);
  expect(runCalculator(waterTankCalculator,{lengthMeters:2,widthMeters:1.5,heightMeters:2}).output.value).toBe(6);
  expect(runCalculator(pipeVolumeCalculator,{lengthMeters:10,internalDiameterMeters:.1}).output.value).toBeCloseTo(0.07853981633974483,14);
  expect(runCalculator(electricalLoadCalculator,{voltageVolts:230,currentAmps:10}).output.value).toBe(2300);
  expect(runCalculator(voltageDropCalculator,{currentAmps:10,oneWayLengthMeters:20,resistanceOhmsPerMeter:.001,conductors:2}).output.value).toBe(.4);
  expect(runCalculator(resistorCalculator,{voltageVolts:12,currentAmps:.5}).output.value).toBe(24);
  expect(runCalculator(hvacBtuCalculator,{floorAreaSquareMeters:50,ceilingHeightMeters:2.5,btuPerCubicMeter:12}).output.value).toBe(1500);
  expect(runCalculator(solarPanelRequirementCalculator,{dailyEnergyKwh:10,panelWatts:400,peakSunHours:5,systemEfficiencyPercent:80}).output.value).toBe(7);
  expect(runCalculator(batteryStorageCalculator,{dailyEnergyKwh:10,backupDays:1,depthOfDischargePercent:80,systemEfficiencyPercent:90}).output.value).toBeCloseTo(13.88888888888889,12);
 });
 it("rejects invalid physical inputs",()=>{
  expect(()=>runCalculator(poolVolumeCalculator,{lengthMeters:10,widthMeters:5,averageDepthMeters:0})).toThrow();
  expect(()=>runCalculator(waterTankCalculator,{lengthMeters:2,widthMeters:1.5,heightMeters:0})).toThrow();
  expect(()=>runCalculator(pipeVolumeCalculator,{lengthMeters:10,internalDiameterMeters:0})).toThrow();
  expect(()=>runCalculator(electricalLoadCalculator,{voltageVolts:230,currentAmps:0})).toThrow();
  expect(()=>runCalculator(voltageDropCalculator,{currentAmps:10,oneWayLengthMeters:20,resistanceOhmsPerMeter:0,conductors:2})).toThrow();
  expect(()=>runCalculator(resistorCalculator,{voltageVolts:12,currentAmps:0})).toThrow();
  expect(()=>runCalculator(hvacBtuCalculator,{floorAreaSquareMeters:50,ceilingHeightMeters:2.5,btuPerCubicMeter:0})).toThrow();
 });
 it("validates bounded efficiency percentages",()=>{
  expect(()=>runCalculator(solarPanelRequirementCalculator,{dailyEnergyKwh:10,panelWatts:400,peakSunHours:5,systemEfficiencyPercent:0})).toThrow();
  expect(()=>runCalculator(solarPanelRequirementCalculator,{dailyEnergyKwh:10,panelWatts:400,peakSunHours:5,systemEfficiencyPercent:101})).toThrow();
  expect(()=>runCalculator(batteryStorageCalculator,{dailyEnergyKwh:10,backupDays:1,depthOfDischargePercent:0,systemEfficiencyPercent:90})).toThrow();
  expect(()=>runCalculator(batteryStorageCalculator,{dailyEnergyKwh:10,backupDays:1,depthOfDischargePercent:80,systemEfficiencyPercent:0})).toThrow();
 });
 it("guards overflow",()=>{
  expect(()=>runCalculator(pipeVolumeCalculator,{lengthMeters:1e100,internalDiameterMeters:1e100})).toThrow("supported finite range");
  expect(()=>runCalculator(electricalLoadCalculator,{voltageVolts:1e100,currentAmps:1e100})).toThrow("supported finite range");
 });
});
