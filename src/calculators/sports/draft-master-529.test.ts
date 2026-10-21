import {describe,it,expect} from "vitest";
import {powerWeightRatioDraftCalculator as calculator} from "./draft-master-529";
const input = {"powerWatts": 240, "massKg": 80} as const;
describe("Work245 master 529 unregistered draft",()=>{
 it("uses an independently derived arithmetic golden",()=>{expect(calculator.calculate(input,{})).toEqual({"wattsPerKg": 3});});
 it("retains standard draft v1 metadata",()=>{expect([calculator.riskClass,calculator.reviewStatus,calculator.version]).toEqual(["standard","draft",1]);});
 it("rejects powerWatts NaN on direct calls",()=>{expect(()=>calculator.calculate({...input,powerWatts:NaN} as never,{})).toThrow();});
 it("rejects powerWatts positive infinity on direct calls",()=>{expect(()=>calculator.calculate({...input,powerWatts:Infinity} as never,{})).toThrow();});
 it("rejects powerWatts negative infinity on direct calls",()=>{expect(()=>calculator.calculate({...input,powerWatts:-Infinity} as never,{})).toThrow();});
 it("rejects powerWatts string on direct calls",()=>{expect(()=>calculator.calculate({...input,powerWatts:"1"} as never,{})).toThrow();});
 it("rejects powerWatts missing on direct calls",()=>{expect(()=>calculator.calculate({...input,powerWatts:undefined} as never,{})).toThrow();});
 it("rejects powerWatts negative on direct calls",()=>{expect(()=>calculator.calculate({...input,powerWatts:-1} as never,{})).toThrow();});
 it("rejects massKg NaN on direct calls",()=>{expect(()=>calculator.calculate({...input,massKg:NaN} as never,{})).toThrow();});
 it("rejects massKg positive infinity on direct calls",()=>{expect(()=>calculator.calculate({...input,massKg:Infinity} as never,{})).toThrow();});
 it("rejects massKg negative infinity on direct calls",()=>{expect(()=>calculator.calculate({...input,massKg:-Infinity} as never,{})).toThrow();});
 it("rejects massKg string on direct calls",()=>{expect(()=>calculator.calculate({...input,massKg:"1"} as never,{})).toThrow();});
 it("rejects massKg missing on direct calls",()=>{expect(()=>calculator.calculate({...input,massKg:undefined} as never,{})).toThrow();});
 it("rejects massKg negative on direct calls",()=>{expect(()=>calculator.calculate({...input,massKg:-1} as never,{})).toThrow();});
it("supports zero power and rejects zero mass",()=>{expect(calculator.calculate({...input,powerWatts:0},{})).toEqual({wattsPerKg:0});expect(()=>calculator.calculate({...input,massKg:0},{})).toThrow();});
it("rejects division overflow",()=>{expect(()=>calculator.calculate({...input,powerWatts:Number.MAX_VALUE,massKg:Number.MIN_VALUE},{})).toThrow();});
it("rejects incompatible unit properties",()=>{expect(()=>calculator.calculate({...input,unit:"unsupported"} as never,{})).toThrow();});
});

it("rejects unsupported positive underflow",()=>{expect(()=>calculator.calculate({...input,powerWatts:Number.MIN_VALUE,massKg:2},{})).toThrow();});

it("keeps examples, goldens and source metadata valid",()=>{for(const example of calculator.examples){expect(calculator.inputSchema.safeParse(example.input).success).toBe(true);expect(calculator.calculate(example.input,{})).toEqual(example.expected);}for(const golden of calculator.goldenTests ?? [])expect(calculator.calculate(golden.input,{})).toMatchObject(golden.expected);expect(calculator.sources.some(source=>source.url?.startsWith("https://"))).toBe(true);});
