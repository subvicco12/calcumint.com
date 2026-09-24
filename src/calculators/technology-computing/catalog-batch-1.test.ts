import {describe,expect,it} from "vitest";
import {runCalculator} from "../engine";
import {ipSubnetCalculator,cidrCalculator,bandwidthCalculator,downloadTimeCalculator,uploadTimeCalculator,dataTransferCalculator,storageConversionCalculator,raidCapacityCalculator,screenPpiCalculator,aspectRatioCalculator} from "./catalog-batch-1";
describe("Technology & Computing 368-377",()=>{
 it("matches verified examples",()=>{
  expect(runCalculator(ipSubnetCalculator,{address:"192.168.1.10",prefixLength:24}).output.value).toBe(256);
  expect(runCalculator(cidrCalculator,{prefixLength:24}).output.value).toBe(256);
  expect(runCalculator(bandwidthCalculator,{dataMegabytes:100,timeSeconds:10}).output.value).toBe(80);
  expect(runCalculator(downloadTimeCalculator,{dataMegabytes:100,bandwidthMbps:80}).output.value).toBe(10);
  expect(runCalculator(uploadTimeCalculator,{dataMegabytes:100,bandwidthMbps:80}).output.value).toBe(10);
  expect(runCalculator(dataTransferCalculator,{bandwidthMbps:80,timeSeconds:10}).output.value).toBe(100);
  expect(runCalculator(storageConversionCalculator,{value:1,fromUnit:"GiB",toUnit:"MiB"}).output.value).toBe(1024);
  expect(runCalculator(raidCapacityCalculator,{diskCount:4,diskSizeGb:1000,raidLevel:"10"}).output.value).toBe(2000);
  expect(runCalculator(raidCapacityCalculator,{diskCount:4,diskSizeGb:1000,raidLevel:"1"}).output.value).toBe(1000);
  expect(runCalculator(screenPpiCalculator,{widthPixels:1920,heightPixels:1080,diagonalInches:15.6}).output.value).toBeCloseTo(141.21199808219862,10);
  expect(runCalculator(aspectRatioCalculator,{width:1920,height:1080}).output.value).toBeCloseTo(1.7777777777777777,12);
 });
 it("rejects invalid required inputs",()=>{
  expect(()=>runCalculator(ipSubnetCalculator,{address:"999.1.1.1",prefixLength:24})).toThrow();
  expect(()=>runCalculator(ipSubnetCalculator,{address:"192.168.1.1",prefixLength:33})).toThrow();
  expect(()=>runCalculator(bandwidthCalculator,{dataMegabytes:100,timeSeconds:0})).toThrow();
  expect(()=>runCalculator(downloadTimeCalculator,{dataMegabytes:0,bandwidthMbps:80})).toThrow();
  expect(()=>runCalculator(storageConversionCalculator,{value:1,fromUnit:"GiB",toUnit:"INVALID"})).toThrow();
  expect(()=>runCalculator(raidCapacityCalculator,{diskCount:1,diskSizeGb:1000,raidLevel:"0"})).toThrow();
  expect(()=>runCalculator(raidCapacityCalculator,{diskCount:2,diskSizeGb:1000,raidLevel:"5"})).toThrow();
  expect(()=>runCalculator(raidCapacityCalculator,{diskCount:3,diskSizeGb:1000,raidLevel:"6"})).toThrow();
  expect(()=>runCalculator(raidCapacityCalculator,{diskCount:3,diskSizeGb:1000,raidLevel:"10"})).toThrow();
 });
 it("covers boundary and identity behavior",()=>{
  expect(runCalculator(cidrCalculator,{prefixLength:0}).output.value).toBe(4294967296);
  expect(runCalculator(cidrCalculator,{prefixLength:32}).output.value).toBe(1);
  expect(runCalculator(ipSubnetCalculator,{address:"0.0.0.0",prefixLength:0}).output.value).toBe(4294967296);
  expect(runCalculator(ipSubnetCalculator,{address:"255.255.255.255",prefixLength:32}).output.value).toBe(1);
  expect(runCalculator(storageConversionCalculator,{value:7,fromUnit:"GiB",toUnit:"GiB"}).output.value).toBe(7);
  expect(()=>runCalculator(screenPpiCalculator,{widthPixels:0,heightPixels:1080,diagonalInches:15.6})).toThrow();
  expect(()=>runCalculator(aspectRatioCalculator,{width:1920,height:0})).toThrow();
  expect(()=>runCalculator(dataTransferCalculator,{bandwidthMbps:1e100,timeSeconds:1e100})).toThrow();
 });

});
