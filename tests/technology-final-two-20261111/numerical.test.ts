import {describe,it,expect} from 'vitest';
import {ipSubnetCalculator,screenPpiCalculator} from '../../src/calculators/technology-computing/catalog-batch-1';
import {runCalculator} from '../../src/calculators/engine';
// Independent literal table for prefixes0..32; not the implementation expression.
const addressCounts=[4294967296,2147483648,1073741824,536870912,268435456,134217728,67108864,33554432,16777216,8388608,4194304,2097152,1048576,524288,262144,131072,65536,32768,16384,8192,4096,2048,1024,512,256,128,64,32,16,8,4,2,1];
describe('368 immutable v1 IPv4 total-count mathematics',()=>{
 it('retains exact identity/version and governing RFC scope',()=>{expect(ipSubnetCalculator.id).toBe('technology.ip-subnet');expect(ipSubnetCalculator.slug).toBe('ip-subnet-calculator');expect(ipSubnetCalculator.version).toBe(1);expect(ipSubnetCalculator.sources?.[0].url).toBe('https://www.rfc-editor.org/rfc/rfc4632');});
 for(const [prefixLength,expected] of addressCounts.entries())it('prefix '+prefixLength+' has the independently tabulated total '+expected,()=>{for(const address of ['0.0.0.0','255.255.255.255','001.002.003.004']){const input={address,prefixLength},before=structuredClone(input);expect(runCalculator(ipSubnetCalculator,input).output.value).toBe(expected);expect(input).toEqual(before);}});
 for(const address of ['','256.1.1.1','1.2.3.-1','1.2.3','1.2.3.4.5','::1',' 1.2.3.4','1e1.2.3.4'])it('rejects original out-of-domain IPv4 '+JSON.stringify(address),()=>expect(()=>runCalculator(ipSubnetCalculator,{address,prefixLength:24})).toThrow());
 for(const prefixLength of [-1,33,0.5,NaN,Infinity])it('rejects original prefix boundary '+prefixLength,()=>expect(()=>runCalculator(ipSubnetCalculator,{address:'192.168.1.10',prefixLength})).toThrow());
});
describe('376 immutable v1 pixels-per-inch mathematics',()=>{
 it('retains exact identity/version and image-resolution source',()=>{expect(screenPpiCalculator.id).toBe('technology.screen-ppi');expect(screenPpiCalculator.slug).toBe('screen-ppi-calculator');expect(screenPpiCalculator.version).toBe(1);expect(screenPpiCalculator.sources?.[0].url).toBe('https://www.nist.gov/glossary-term/28116');});
 for(const [input,expected]of [
  [{widthPixels:3,heightPixels:4,diagonalInches:1},5],
  [{widthPixels:6,heightPixels:8,diagonalInches:2},5],
  [{widthPixels:0.3,heightPixels:0.4,diagonalInches:0.1},5],
  [{widthPixels:1920,heightPixels:1080,diagonalInches:15.6},141.21199808219862],
  [{widthPixels:1920,heightPixels:1080,diagonalInches:31.2},70.60599904109931],
 ]as const)it('matches independent literal PPI '+expected+' for '+JSON.stringify(input),()=>{const before=structuredClone(input);expect(runCalculator(screenPpiCalculator,input).output.value).toBe(expected);expect(input).toEqual(before);});
 it('accepts the original maximum dimensions without changing the square/sqrt formula',()=>{expect(runCalculator(screenPpiCalculator,{widthPixels:1e100,heightPixels:1e100,diagonalInches:1e100}).output.value).toBeCloseTo(1.4142135623730951,14);});
 for(const field of ['widthPixels','heightPixels','diagonalInches'])for(const value of [0,-1,NaN,Infinity,1e101])it('rejects original '+field+' domain '+value,()=>expect(()=>runCalculator(screenPpiCalculator,{widthPixels:3,heightPixels:4,diagonalInches:1,[field]:value})).toThrow());
 it('rejects original nonfinite result rather than replacing historical mathematics',()=>expect(()=>runCalculator(screenPpiCalculator,{widthPixels:1e100,heightPixels:1e100,diagonalInches:1e-300})).toThrow());
});
