import { describe,expect,it } from "vitest";
import { runCalculator } from "../engine";
import { technologyBatch2Definitions,resolutionCalculator,dpiCalculator,batteryRuntimeCalculator,upsRuntimeCalculator,powerSupplyCalculator,websiteBandwidthCalculator,cloudStorageCostCalculator,cloudDataTransferCostCalculator,base64SizeCalculator,passwordEntropyCalculator } from "./catalog-batch-2";

describe("Technology & Computing catalog #378-387",()=>{
  // Boundary coverage is part of the batch certification evidence.
  it("passes every golden fixture through the authoritative engine",()=>{
    for(const definition of technologyBatch2Definitions){
      for(const golden of definition.goldenTests??[]){
        expect(runCalculator(definition as never,golden.input).output).toEqual(golden.expected);
      }
    }
  });
  it("rejects impossible battery efficiency",()=>{expect(()=>runCalculator(batteryRuntimeCalculator,{capacityWh:1000,loadWatts:200,efficiencyPercent:101})).toThrow()});
  it("handles zero-byte Base64 payload exactly",()=>{expect(runCalculator(base64SizeCalculator,{inputBytes:0}).output.value).toBe(0)});
  it("rejects invalid password character pools",()=>{expect(()=>runCalculator(passwordEntropyCalculator,{length:16,characterPoolSize:1})).toThrow()});
  it("rejects non-positive resolution dimensions",()=>{expect(()=>runCalculator(resolutionCalculator,{widthPixels:0,heightPixels:1080})).toThrow()});
  it("rejects zero physical length for DPI",()=>{expect(()=>runCalculator(dpiCalculator,{pixels:3000,lengthInches:0})).toThrow()});
  it("rejects zero loads for runtime calculators",()=>{expect(()=>runCalculator(batteryRuntimeCalculator,{capacityWh:1000,loadWatts:0,efficiencyPercent:90})).toThrow();expect(()=>runCalculator(upsRuntimeCalculator,{batteryWh:600,loadWatts:0,efficiencyPercent:90})).toThrow()});
  it("accepts zero PSU headroom and rejects negative headroom",()=>{expect(runCalculator(powerSupplyCalculator,{systemLoadWatts:500,headroomPercent:0}).output.value).toBe(500);expect(()=>runCalculator(powerSupplyCalculator,{systemLoadWatts:500,headroomPercent:-1})).toThrow()});
  it("returns zero for zero website traffic and cloud usage",()=>{expect(runCalculator(websiteBandwidthCalculator,{pageSizeMb:2,monthlyPageViews:0}).output.value).toBe(0);expect(runCalculator(cloudStorageCostCalculator,{storageGb:0,pricePerGbMonth:0.02}).output.value).toBe(0);expect(runCalculator(cloudDataTransferCostCalculator,{transferGb:0,pricePerGb:0.09}).output.value).toBe(0)});
  it("validates Base64 integer byte counts",()=>{expect(()=>runCalculator(base64SizeCalculator,{inputBytes:1.5})).toThrow();expect(runCalculator(base64SizeCalculator,{inputBytes:1}).output.value).toBe(4);expect(runCalculator(base64SizeCalculator,{inputBytes:2}).output.value).toBe(4);expect(runCalculator(base64SizeCalculator,{inputBytes:3}).output.value).toBe(4);expect(runCalculator(base64SizeCalculator,{inputBytes:4}).output.value).toBe(8)});
  it("validates password length and computes binary-pool entropy",()=>{expect(()=>runCalculator(passwordEntropyCalculator,{length:0,characterPoolSize:94})).toThrow();expect(runCalculator(passwordEntropyCalculator,{length:8,characterPoolSize:2}).output.value).toBe(8)});
});
