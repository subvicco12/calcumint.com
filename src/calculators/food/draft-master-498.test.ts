import {describe,it,expect} from "vitest";
import {ingredientWeightVolumeDraftCalculator as calculator} from "./draft-master-498";
const input = {"value": 90, "direction": "massToVolume", "densityGPerMl": 0.75} as const;
describe("Work245 master 498 unregistered draft",()=>{
 it("uses an independently derived arithmetic golden",()=>{expect(calculator.calculate(input,{})).toEqual({"convertedValue": 120});});
 it("retains standard draft v1 metadata",()=>{expect([calculator.riskClass,calculator.reviewStatus,calculator.version]).toEqual(["standard","draft",1]);});
 it("rejects value NaN on direct calls",()=>{expect(()=>calculator.calculate({...input,value:NaN} as never,{})).toThrow();});
 it("rejects value positive infinity on direct calls",()=>{expect(()=>calculator.calculate({...input,value:Infinity} as never,{})).toThrow();});
 it("rejects value negative infinity on direct calls",()=>{expect(()=>calculator.calculate({...input,value:-Infinity} as never,{})).toThrow();});
 it("rejects value string on direct calls",()=>{expect(()=>calculator.calculate({...input,value:"1"} as never,{})).toThrow();});
 it("rejects value missing on direct calls",()=>{expect(()=>calculator.calculate({...input,value:undefined} as never,{})).toThrow();});
 it("rejects value negative on direct calls",()=>{expect(()=>calculator.calculate({...input,value:-1} as never,{})).toThrow();});
 it("rejects densityGPerMl NaN on direct calls",()=>{expect(()=>calculator.calculate({...input,densityGPerMl:NaN} as never,{})).toThrow();});
 it("rejects densityGPerMl positive infinity on direct calls",()=>{expect(()=>calculator.calculate({...input,densityGPerMl:Infinity} as never,{})).toThrow();});
 it("rejects densityGPerMl negative infinity on direct calls",()=>{expect(()=>calculator.calculate({...input,densityGPerMl:-Infinity} as never,{})).toThrow();});
 it("rejects densityGPerMl string on direct calls",()=>{expect(()=>calculator.calculate({...input,densityGPerMl:"1"} as never,{})).toThrow();});
 it("rejects densityGPerMl missing on direct calls",()=>{expect(()=>calculator.calculate({...input,densityGPerMl:undefined} as never,{})).toThrow();});
 it("rejects densityGPerMl negative on direct calls",()=>{expect(()=>calculator.calculate({...input,densityGPerMl:-1} as never,{})).toThrow();});
it("converts both directions with independent density",()=>{expect(calculator.calculate({value:120,direction:"volumeToMass",densityGPerMl:.75},{})).toEqual({convertedValue:90});expect(calculator.calculate({...input,value:0},{})).toEqual({convertedValue:0});});
it("rejects invalid direction, zero density and overflow",()=>{expect(()=>calculator.calculate({...input,direction:"cups"} as never,{})).toThrow();expect(()=>calculator.calculate({...input,densityGPerMl:0},{})).toThrow();expect(()=>calculator.calculate({...input,value:Number.MAX_VALUE,densityGPerMl:Number.MIN_VALUE},{})).toThrow();expect(()=>calculator.calculate({...input,direction:"volumeToMass",value:Number.MAX_VALUE,densityGPerMl:2},{})).toThrow();});
it("rejects incompatible unit properties",()=>{expect(()=>calculator.calculate({...input,unit:"unsupported"} as never,{})).toThrow();});
});

it("rejects unsupported positive underflow",()=>{expect(()=>calculator.calculate({...input,value:Number.MIN_VALUE,direction:"volumeToMass",densityGPerMl:.5},{})).toThrow();});

it("keeps examples, goldens and source metadata valid",()=>{for(const example of calculator.examples){expect(calculator.inputSchema.safeParse(example.input).success).toBe(true);expect(calculator.calculate(example.input,{})).toEqual(example.expected);}for(const golden of calculator.goldenTests ?? [])expect(calculator.calculate(golden.input,{})).toMatchObject(golden.expected);expect(calculator.sources.some(source=>source.url?.startsWith("https://"))).toBe(true);});
