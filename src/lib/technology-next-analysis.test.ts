import {it,expect} from 'vitest';
import {analyzeTechnologyNext,solveTechnologyNext,technologyNextDefinition} from './technology-next-analysis';
const cases=[
 ['technology.storage-conversion',{value:2,fromUnit:'GiB',toUnit:'MiB'},[1024,2048,4096],4096,4],
 ['technology.aspect-ratio',{width:16,height:9},[8/9,16/9,32/9],2,18],
 ['technology.resolution',{widthPixels:1920,heightPixels:1080},[1036800,2073600,4147200],2160,2],
 ['technology.dpi',{pixels:3000,lengthInches:10},[150,300,600],600,6000],
 ['technology.power-supply',{systemLoadWatts:500,headroomPercent:20},[300,600,1200],1200,1000],
 ['technology.website-bandwidth',{pageSizeMb:2,monthlyPageViews:100000},[100,200,400],400,200000],
 ['technology.cloud-storage-cost',{storageGb:1000,pricePerGbMonth:0.02},[10,20,40],40,2000],
 ['technology.cloud-data-transfer-cost',{transferGb:500,pricePerGb:0.09},[22.5,45,90],90,1000],
] as const;
for(const[id,input,expected,target,solved]of cases)it(id+' reuses original samples and independently checked inverse',()=>{const before=JSON.stringify(input);const a=analyzeTechnologyNext(id,input);expect(a.points.map(p=>p.result)).toEqual(expected);const s=solveTechnologyNext(id,input,target);expect(s.value).toBe(solved);expect(s.forwardValue).toBeCloseTo(target,12);expect(JSON.stringify(input)).toBe(before);});
it('uses registered website v2 and refuses unsupported identities',()=>{expect(technologyNextDefinition('technology.website-bandwidth').version).toBe(2);expect(()=>technologyNextDefinition('toString')).toThrow();});
it('preserves zero cases without manufacturing a unique inverse',()=>{const x={storageGb:0,pricePerGbMonth:0};expect(analyzeTechnologyNext('technology.cloud-storage-cost',x).points.map(p=>p.result)).toEqual([0,0,0]);expect(solveTechnologyNext('technology.cloud-storage-cost',x,0).interval).toEqual([0,1e100]);expect(()=>solveTechnologyNext('technology.cloud-storage-cost',x,1)).toThrow(/No supported/);expect(solveTechnologyNext('technology.website-bandwidth',{pageSizeMb:2,monthlyPageViews:0},0).value).toBe(0);});
it('refuses overflow, subnormal, invalid targets and records projected boundary refusals',()=>{for(const n of [NaN,Infinity,-1,1e101,Number.MIN_VALUE])expect(()=>solveTechnologyNext('technology.dpi',{pixels:3000,lengthInches:10},n)).toThrow();expect(()=>analyzeTechnologyNext('technology.resolution',{widthPixels:1e-200,heightPixels:1e-200})).toThrow();const a=analyzeTechnologyNext('technology.dpi',{pixels:1e100,lengthInches:1});expect(a.points.at(-1)?.error).toBeTruthy();});
it('solves a normal website target without an underflowing unit-basis intermediate',()=>{expect(solveTechnologyNext('technology.website-bandwidth',{pageSizeMb:2**-1022,monthlyPageViews:2000},2**-1022).value).toBe(1000);});
