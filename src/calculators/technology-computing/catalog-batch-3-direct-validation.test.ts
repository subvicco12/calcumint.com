import{describe,expect,it}from"vitest";
import{videoFileSizeCalculator,audioFileSizeCalculator,videoBitrateCalculator,compressionRatioCalculator,databaseStorageCalculator,backupStorageCalculator}from"./catalog-batch-3";

describe("technology batch-three direct calculation domain",()=>{
 it("rejects negative duration and nonfinite bitrate",()=>{
  expect(()=>videoFileSizeCalculator.calculate({videoBitrateMbps:8,audioBitrateKbps:192,durationMinutes:-1},{})).toThrow(/supported domain/);
  expect(()=>audioFileSizeCalculator.calculate({bitrateKbps:Infinity,durationMinutes:5},{})).toThrow(/supported domain/);
 });
 it("rejects invalid target and compressed sizes",()=>{
  expect(()=>videoBitrateCalculator.calculate({targetFileSizeGb:0,durationMinutes:10,audioBitrateKbps:192},{})).toThrow(/supported domain/);
  expect(()=>compressionRatioCalculator.calculate({originalSize:1000,compressedSize:0},{})).toThrow(/supported domain/);
 });
 it("rejects invalid row counts and backup counts",()=>{
  expect(()=>databaseStorageCalculator.calculate({rowCount:0.5,averageRowBytes:1000,indexOverheadPercent:20},{})).toThrow(/supported domain/);
  expect(()=>backupStorageCalculator.calculate({sourceDataGb:500,fullBackups:-1,incrementalBackupGb:25,incrementalBackups:6},{})).toThrow(/supported domain/);
 });
 it("preserves valid deterministic examples",()=>{
  expect(audioFileSizeCalculator.calculate({bitrateKbps:320,durationMinutes:5},{}).value).toBe(12);
  expect(backupStorageCalculator.calculate({sourceDataGb:500,fullBackups:2,incrementalBackupGb:25,incrementalBackups:6},{}).value).toBe(1150);
 });
});
