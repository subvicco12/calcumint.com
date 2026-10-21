import {describe,it,expect} from "vitest";
import {rainwaterHarvestingDraftCalculator as calculator} from "./draft-master-487";
const input = {"rainfallMm": 40, "catchmentAreaM2": 250, "collectionEfficiency": 0.6} as const;
describe("Work245 master 487 unregistered draft",()=>{
 it("uses an independently derived arithmetic golden",()=>{expect(calculator.calculate(input,{})).toEqual({"theoreticalVolumeM3": 10, "collectedVolumeM3": 6, "collectedLiters": 6000});});
 it("retains standard draft v1 metadata",()=>{expect([calculator.riskClass,calculator.reviewStatus,calculator.version]).toEqual(["standard","draft",1]);});
 it("rejects rainfallMm NaN on direct calls",()=>{expect(()=>calculator.calculate({...input,rainfallMm:NaN} as never,{})).toThrow();});
 it("rejects rainfallMm positive infinity on direct calls",()=>{expect(()=>calculator.calculate({...input,rainfallMm:Infinity} as never,{})).toThrow();});
 it("rejects rainfallMm negative infinity on direct calls",()=>{expect(()=>calculator.calculate({...input,rainfallMm:-Infinity} as never,{})).toThrow();});
 it("rejects rainfallMm string on direct calls",()=>{expect(()=>calculator.calculate({...input,rainfallMm:"1"} as never,{})).toThrow();});
 it("rejects rainfallMm missing on direct calls",()=>{expect(()=>calculator.calculate({...input,rainfallMm:undefined} as never,{})).toThrow();});
 it("rejects rainfallMm negative on direct calls",()=>{expect(()=>calculator.calculate({...input,rainfallMm:-1} as never,{})).toThrow();});
 it("rejects catchmentAreaM2 NaN on direct calls",()=>{expect(()=>calculator.calculate({...input,catchmentAreaM2:NaN} as never,{})).toThrow();});
 it("rejects catchmentAreaM2 positive infinity on direct calls",()=>{expect(()=>calculator.calculate({...input,catchmentAreaM2:Infinity} as never,{})).toThrow();});
 it("rejects catchmentAreaM2 negative infinity on direct calls",()=>{expect(()=>calculator.calculate({...input,catchmentAreaM2:-Infinity} as never,{})).toThrow();});
 it("rejects catchmentAreaM2 string on direct calls",()=>{expect(()=>calculator.calculate({...input,catchmentAreaM2:"1"} as never,{})).toThrow();});
 it("rejects catchmentAreaM2 missing on direct calls",()=>{expect(()=>calculator.calculate({...input,catchmentAreaM2:undefined} as never,{})).toThrow();});
 it("rejects catchmentAreaM2 negative on direct calls",()=>{expect(()=>calculator.calculate({...input,catchmentAreaM2:-1} as never,{})).toThrow();});
 it("rejects collectionEfficiency NaN on direct calls",()=>{expect(()=>calculator.calculate({...input,collectionEfficiency:NaN} as never,{})).toThrow();});
 it("rejects collectionEfficiency positive infinity on direct calls",()=>{expect(()=>calculator.calculate({...input,collectionEfficiency:Infinity} as never,{})).toThrow();});
 it("rejects collectionEfficiency negative infinity on direct calls",()=>{expect(()=>calculator.calculate({...input,collectionEfficiency:-Infinity} as never,{})).toThrow();});
 it("rejects collectionEfficiency string on direct calls",()=>{expect(()=>calculator.calculate({...input,collectionEfficiency:"1"} as never,{})).toThrow();});
 it("rejects collectionEfficiency missing on direct calls",()=>{expect(()=>calculator.calculate({...input,collectionEfficiency:undefined} as never,{})).toThrow();});
 it("rejects collectionEfficiency negative on direct calls",()=>{expect(()=>calculator.calculate({...input,collectionEfficiency:-1} as never,{})).toThrow();});
it("supports zero rainfall, zero area and efficiency endpoints",()=>{for(const patch of [{rainfallMm:0},{catchmentAreaM2:0},{collectionEfficiency:0}])expect(calculator.calculate({...input,...patch},{}).collectedLiters).toBe(0);expect(calculator.calculate({...input,collectionEfficiency:1},{}).collectedLiters).toBe(10000);expect(()=>calculator.calculate({...input,collectionEfficiency:1.01},{})).toThrow();});
it("rejects multiplication overflow",()=>{expect(()=>calculator.calculate({...input,rainfallMm:Number.MAX_VALUE,catchmentAreaM2:Number.MAX_VALUE},{})).toThrow();});
it("rejects incompatible unit properties",()=>{expect(()=>calculator.calculate({...input,unit:"unsupported"} as never,{})).toThrow();});
});

it("rejects unsupported positive underflow",()=>{expect(()=>calculator.calculate({...input,rainfallMm:Number.MIN_VALUE,catchmentAreaM2:1,collectionEfficiency:1},{})).toThrow();});

it("keeps examples, goldens and source metadata valid",()=>{for(const example of calculator.examples){expect(calculator.inputSchema.safeParse(example.input).success).toBe(true);expect(calculator.calculate(example.input,{})).toEqual(example.expected);}for(const golden of calculator.goldenTests ?? [])expect(calculator.calculate(golden.input,{})).toMatchObject(golden.expected);expect(calculator.sources.some(source=>source.url?.startsWith("https://"))).toBe(true);});
