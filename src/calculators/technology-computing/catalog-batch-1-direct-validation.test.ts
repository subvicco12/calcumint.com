import{describe,expect,it}from"vitest";
import{ipSubnetCalculator,cidrCalculator,bandwidthCalculator,downloadTimeCalculator,uploadTimeCalculator,dataTransferCalculator,storageConversionCalculator,raidCapacityCalculator,screenPpiCalculator,aspectRatioCalculator}from"./catalog-batch-1";

describe("technology batch-one direct-call input validation",()=>{
 it("rejects invalid IPv4 and prefix inputs",()=>{
  expect(()=>ipSubnetCalculator.calculate({address:"256.1.1.1",prefixLength:24},{})).toThrow(/Invalid IPv4/);
  expect(()=>cidrCalculator.calculate({prefixLength:33},{})).toThrow(/supported domain/);
 });
 it("rejects invalid transfer and unit domains",()=>{
  expect(()=>bandwidthCalculator.calculate({dataMegabytes:-1,timeSeconds:10},{})).toThrow(/supported domain/);
  expect(()=>downloadTimeCalculator.calculate({dataMegabytes:100,bandwidthMbps:0},{})).toThrow(/supported domain/);
  expect(()=>uploadTimeCalculator.calculate({dataMegabytes:100,bandwidthMbps:Infinity},{})).toThrow(/supported domain/);
  expect(()=>dataTransferCalculator.calculate({bandwidthMbps:80,timeSeconds:-1},{})).toThrow(/supported domain/);
  expect(()=>storageConversionCalculator.calculate({value:1,fromUnit:"GiB",toUnit:"unknown" as "MiB"},{})).toThrow(/supported domain/);
 });
 it("rejects invalid RAID and screen geometry",()=>{
  expect(()=>raidCapacityCalculator.calculate({diskCount:2.5,diskSizeGb:1000,raidLevel:"0"},{})).toThrow(/supported domain/);
  expect(()=>screenPpiCalculator.calculate({widthPixels:1920,heightPixels:1080,diagonalInches:0},{})).toThrow(/supported domain/);
  expect(()=>aspectRatioCalculator.calculate({width:1920,height:-1080},{})).toThrow(/supported domain/);
 });
 it("preserves verified CIDR and binary conversion",()=>{
  expect(cidrCalculator.calculate({prefixLength:24},{}).value).toBe(256);
  expect(storageConversionCalculator.calculate({value:1,fromUnit:"GiB",toUnit:"MiB"},{}).value).toBe(1024);
 });
});
