import { describe, expect, it } from "vitest";
import { goalSeek } from "./reverse";
describe("goalSeek",()=>{
 it("solves an increasing monotonic function",()=>{const r=goalSeek(100,x=>x*x,{min:0,max:20,tolerance:1e-10});expect(r.converged).toBe(true);expect(r.value).toBeCloseTo(10,8);});
 it("solves a decreasing monotonic function",()=>{const r=goalSeek(20,x=>100-x,{min:0,max:100,direction:"decreasing"});expect(r.converged).toBe(true);expect(r.value).toBeCloseTo(80,6);});
 it("returns exact lower and upper boundaries without iterations",()=>{const low=goalSeek(0,x=>x,{min:0,max:10});const high=goalSeek(10,x=>x,{min:0,max:10});expect(low).toMatchObject({value:0,iterations:0,converged:true});expect(high).toMatchObject({value:10,iterations:0,converged:true});});
 it("rejects a direction inconsistent with endpoint outputs",()=>{expect(()=>goalSeek(5,x=>10-x,{min:0,max:10,direction:"increasing"})).toThrow(/direction/);expect(()=>goalSeek(5,x=>x,{min:0,max:10,direction:"decreasing"})).toThrow(/direction/);});
 it("rejects targets outside modeled bounds",()=>{expect(()=>goalSeek(101,x=>x,{min:0,max:100})).toThrow(/outside/);});
 it("rejects non-finite calculator output",()=>{expect(()=>goalSeek(5,()=>Number.POSITIVE_INFINITY,{min:0,max:10})).toThrow(/finite/);});
 it("reports nonconvergence when the iteration budget is exhausted",()=>{const r=goalSeek(1.23456789,x=>x,{min:0,max:10,tolerance:1e-15,maxIterations:1});expect(r.converged).toBe(false);expect(r.iterations).toBe(1);});
 it("validates bounds and solver controls",()=>{expect(()=>goalSeek(1,x=>x,{min:2,max:1})).toThrow(/exceed/);expect(()=>goalSeek(1,x=>x,{min:0,max:2,tolerance:0})).toThrow(/Tolerance/);expect(()=>goalSeek(1,x=>x,{min:0,max:2,maxIterations:0})).toThrow(/maxIterations/);expect(()=>goalSeek(1,x=>x,{min:0,max:2,direction:"sideways" as "increasing"})).toThrow(/Direction/);});
});
