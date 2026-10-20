import {describe,it,expect} from "vitest";
import {solarPanelSizingDraftCalculator as calculator} from "./draft-master-481";
const input = {"dailyEnergyTargetKwh": 12, "peakSunHours": 4, "systemEfficiency": 0.75, "panelRatedWatts": 500} as const;
describe("Work245 master 481 unregistered draft",()=>{
 it("uses an independently derived arithmetic golden",()=>{expect(calculator.calculate(input,{})).toEqual({"requiredSystemKw": 4, "panelCount": 8, "estimatedDailyKwh": 12});});
 it("retains standard draft v1 metadata",()=>{expect([calculator.riskClass,calculator.reviewStatus,calculator.version]).toEqual(["standard","draft",1]);});
 it("rejects dailyEnergyTargetKwh NaN on direct calls",()=>{expect(()=>calculator.calculate({...input,dailyEnergyTargetKwh:NaN} as never,{})).toThrow();});
 it("rejects dailyEnergyTargetKwh positive infinity on direct calls",()=>{expect(()=>calculator.calculate({...input,dailyEnergyTargetKwh:Infinity} as never,{})).toThrow();});
 it("rejects dailyEnergyTargetKwh negative infinity on direct calls",()=>{expect(()=>calculator.calculate({...input,dailyEnergyTargetKwh:-Infinity} as never,{})).toThrow();});
 it("rejects dailyEnergyTargetKwh string on direct calls",()=>{expect(()=>calculator.calculate({...input,dailyEnergyTargetKwh:"1"} as never,{})).toThrow();});
 it("rejects dailyEnergyTargetKwh missing on direct calls",()=>{expect(()=>calculator.calculate({...input,dailyEnergyTargetKwh:undefined} as never,{})).toThrow();});
 it("rejects dailyEnergyTargetKwh negative on direct calls",()=>{expect(()=>calculator.calculate({...input,dailyEnergyTargetKwh:-1} as never,{})).toThrow();});
 it("rejects peakSunHours NaN on direct calls",()=>{expect(()=>calculator.calculate({...input,peakSunHours:NaN} as never,{})).toThrow();});
 it("rejects peakSunHours positive infinity on direct calls",()=>{expect(()=>calculator.calculate({...input,peakSunHours:Infinity} as never,{})).toThrow();});
 it("rejects peakSunHours negative infinity on direct calls",()=>{expect(()=>calculator.calculate({...input,peakSunHours:-Infinity} as never,{})).toThrow();});
 it("rejects peakSunHours string on direct calls",()=>{expect(()=>calculator.calculate({...input,peakSunHours:"1"} as never,{})).toThrow();});
 it("rejects peakSunHours missing on direct calls",()=>{expect(()=>calculator.calculate({...input,peakSunHours:undefined} as never,{})).toThrow();});
 it("rejects peakSunHours negative on direct calls",()=>{expect(()=>calculator.calculate({...input,peakSunHours:-1} as never,{})).toThrow();});
 it("rejects systemEfficiency NaN on direct calls",()=>{expect(()=>calculator.calculate({...input,systemEfficiency:NaN} as never,{})).toThrow();});
 it("rejects systemEfficiency positive infinity on direct calls",()=>{expect(()=>calculator.calculate({...input,systemEfficiency:Infinity} as never,{})).toThrow();});
 it("rejects systemEfficiency negative infinity on direct calls",()=>{expect(()=>calculator.calculate({...input,systemEfficiency:-Infinity} as never,{})).toThrow();});
 it("rejects systemEfficiency string on direct calls",()=>{expect(()=>calculator.calculate({...input,systemEfficiency:"1"} as never,{})).toThrow();});
 it("rejects systemEfficiency missing on direct calls",()=>{expect(()=>calculator.calculate({...input,systemEfficiency:undefined} as never,{})).toThrow();});
 it("rejects systemEfficiency negative on direct calls",()=>{expect(()=>calculator.calculate({...input,systemEfficiency:-1} as never,{})).toThrow();});
 it("rejects panelRatedWatts NaN on direct calls",()=>{expect(()=>calculator.calculate({...input,panelRatedWatts:NaN} as never,{})).toThrow();});
 it("rejects panelRatedWatts positive infinity on direct calls",()=>{expect(()=>calculator.calculate({...input,panelRatedWatts:Infinity} as never,{})).toThrow();});
 it("rejects panelRatedWatts negative infinity on direct calls",()=>{expect(()=>calculator.calculate({...input,panelRatedWatts:-Infinity} as never,{})).toThrow();});
 it("rejects panelRatedWatts string on direct calls",()=>{expect(()=>calculator.calculate({...input,panelRatedWatts:"1"} as never,{})).toThrow();});
 it("rejects panelRatedWatts missing on direct calls",()=>{expect(()=>calculator.calculate({...input,panelRatedWatts:undefined} as never,{})).toThrow();});
 it("rejects panelRatedWatts negative on direct calls",()=>{expect(()=>calculator.calculate({...input,panelRatedWatts:-1} as never,{})).toThrow();});
it("checks sun-hour and efficiency endpoints",()=>{for(const patch of [{peakSunHours:0},{peakSunHours:24.1},{systemEfficiency:0},{systemEfficiency:1.01},{panelRatedWatts:0},{dailyEnergyTargetKwh:0}])expect(()=>calculator.calculate({...input,...patch},{})).toThrow();expect(calculator.calculate({...input,peakSunHours:24,systemEfficiency:1},{}).requiredSystemKw).toBe(.5);});
it("ceilings exact panel boundaries without rounding",()=>{expect(calculator.calculate({...input,dailyEnergyTargetKwh:12.00000001},{}).panelCount).toBe(9);});
it("rejects arithmetic overflow",()=>{expect(()=>calculator.calculate({...input,dailyEnergyTargetKwh:Number.MAX_VALUE,peakSunHours:Number.MIN_VALUE},{})).toThrow();});
it("rejects incompatible unit properties",()=>{expect(()=>calculator.calculate({...input,unit:"unsupported"} as never,{})).toThrow();});
});

it("rejects unsupported positive underflow",()=>{expect(()=>calculator.calculate({...input,dailyEnergyTargetKwh:Number.MIN_VALUE,peakSunHours:24,systemEfficiency:1},{})).toThrow();});

it("rejects unsafe integer panel counts",()=>{expect(()=>calculator.calculate({...input,dailyEnergyTargetKwh:9007199254740992,peakSunHours:1,systemEfficiency:1,panelRatedWatts:1000},{})).toThrow();});

it("keeps examples, goldens and source metadata valid",()=>{for(const example of calculator.examples){expect(calculator.inputSchema.safeParse(example.input).success).toBe(true);expect(calculator.calculate(example.input,{})).toEqual(example.expected);}for(const golden of calculator.goldenTests ?? [])expect(calculator.calculate(golden.input,{})).toMatchObject(golden.expected);expect(calculator.sources.some(source=>source.url?.startsWith("https://"))).toBe(true);});
