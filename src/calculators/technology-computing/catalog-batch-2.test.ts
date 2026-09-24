import { describe,expect,it } from "vitest";
import { runCalculator } from "../engine";
import { technologyBatch2Definitions,batteryRuntimeCalculator,base64SizeCalculator,passwordEntropyCalculator } from "./catalog-batch-2";

describe("Technology & Computing catalog #378-387",()=>{
  it("passes every golden fixture through the authoritative engine",()=>{
    for(const definition of technologyBatch2Definitions){
      for(const golden of definition.goldenTests??[]){
        expect(runCalculator(definition,golden.input)).toEqual(golden.expected);
      }
    }
  });
  it("rejects impossible battery efficiency",()=>{expect(()=>runCalculator(batteryRuntimeCalculator,{capacityWh:1000,loadWatts:200,efficiencyPercent:101})).toThrow()});
  it("handles zero-byte Base64 payload exactly",()=>{expect(runCalculator(base64SizeCalculator,{inputBytes:0}).value).toBe(0)});
  it("rejects invalid password character pools",()=>{expect(()=>runCalculator(passwordEntropyCalculator,{length:16,characterPoolSize:1})).toThrow()});
});
