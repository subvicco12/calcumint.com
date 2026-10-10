import{describe,expect,it}from"vitest";
import{resolutionCalculator,dpiCalculator,batteryRuntimeCalculator,upsRuntimeCalculator,powerSupplyCalculator,websiteBandwidthCalculator,cloudStorageCostCalculator,cloudDataTransferCostCalculator,base64SizeCalculator,passwordEntropyCalculator}from"./catalog-batch-2";

describe("technology batch-two direct-call validation",()=>{
 it("rejects invalid resolution, density and runtime inputs",()=>{
  expect(()=>resolutionCalculator.calculate({widthPixels:-1,heightPixels:1080},{})).toThrow(/supported domain/);
  expect(()=>dpiCalculator.calculate({pixels:3000,lengthInches:0},{})).toThrow(/supported domain/);
  expect(()=>batteryRuntimeCalculator.calculate({capacityWh:1000,loadWatts:200,efficiencyPercent:101},{})).toThrow(/supported domain/);
  expect(()=>upsRuntimeCalculator.calculate({batteryWh:600,loadWatts:0,efficiencyPercent:90},{})).toThrow(/supported domain/);
 });
 it("rejects negative headroom, traffic and cloud pricing",()=>{
  expect(()=>powerSupplyCalculator.calculate({systemLoadWatts:500,headroomPercent:-1},{})).toThrow(/supported domain/);
  expect(()=>websiteBandwidthCalculator.calculate({pageSizeMb:2,monthlyPageViews:-1},{})).toThrow(/supported domain/);
  expect(()=>cloudStorageCostCalculator.calculate({storageGb:1000,pricePerGbMonth:-1},{})).toThrow(/supported domain/);
  expect(()=>cloudDataTransferCostCalculator.calculate({transferGb:500,pricePerGb:Infinity},{})).toThrow(/supported domain/);
 });
 it("rejects fractional byte lengths and invalid entropy pool",()=>{
  expect(()=>base64SizeCalculator.calculate({inputBytes:1.5},{})).toThrow(/supported domain/);
  expect(()=>passwordEntropyCalculator.calculate({length:16,characterPoolSize:1},{})).toThrow(/supported domain/);
 });
 it("preserves valid calculations",()=>{
  expect(base64SizeCalculator.calculate({inputBytes:1000},{}).value).toBe(1336);
  expect(cloudStorageCostCalculator.calculate({storageGb:1000,pricePerGbMonth:0.02},{}).value).toBe(20);
 });
});
