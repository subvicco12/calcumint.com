import { describe,expect,it } from "vitest";
import { runCalculator } from "../engine";
import { audioFileSizeCalculator,backupStorageCalculator,compressionRatioCalculator,databaseStorageCalculator,technologyBatch3Definitions,videoBitrateCalculator,videoFileSizeCalculator } from "./catalog-batch-3";
describe("Technology computing batch 3",()=>{
 it("matches deterministic examples",()=>{
  expect(runCalculator(videoFileSizeCalculator,{videoBitrateMbps:8,audioBitrateKbps:192,durationMinutes:10}).output.value).toBe(0.6144);
  expect(runCalculator(audioFileSizeCalculator,{bitrateKbps:320,durationMinutes:5}).output.value).toBe(12);
  expect(runCalculator(videoBitrateCalculator,{targetFileSizeGb:1,durationMinutes:10,audioBitrateKbps:192}).output.value).toBe(13.141333);
  expect(runCalculator(compressionRatioCalculator,{originalSize:1000,compressedSize:250}).output.value).toBe(4);
  expect(runCalculator(databaseStorageCalculator,{rowCount:1000000,averageRowBytes:1000,indexOverheadPercent:20}).output.value).toBe(1.2);
  expect(runCalculator(backupStorageCalculator,{sourceDataGb:500,fullBackups:2,incrementalBackupGb:25,incrementalBackups:6}).output.value).toBe(1150);
 });
 it("is standard-risk draft with evidence metadata",()=>{for(const c of technologyBatch3Definitions){expect(c.riskClass).toBe("standard");expect(c.reviewStatus).toBe("draft");expect(c.sources.length).toBeGreaterThan(0);}});
 it("rejects invalid denominators",()=>{
  expect(()=>runCalculator(audioFileSizeCalculator,{bitrateKbps:0,durationMinutes:5})).toThrow();
  expect(()=>runCalculator(compressionRatioCalculator,{originalSize:1000,compressedSize:0})).toThrow();
  expect(()=>runCalculator(videoBitrateCalculator,{targetFileSizeGb:1,durationMinutes:0,audioBitrateKbps:192})).toThrow();
 });
});
