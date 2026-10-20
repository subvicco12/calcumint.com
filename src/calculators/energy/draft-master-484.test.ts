import {describe,it,expect} from "vitest";
import {evChargingEnergyDraftCalculator as calculator} from "./draft-master-484";
const input = {"batteryEnergyAddedKwh": 12, "chargingEfficiency": 0.75} as const;
describe("Work245 master 484 unregistered draft",()=>{
 it("uses an independently derived arithmetic golden",()=>{expect(calculator.calculate(input,{})).toEqual({"wallEnergyKwh": 16, "lossKwh": 4});});
 it("retains standard draft v1 metadata",()=>{expect([calculator.riskClass,calculator.reviewStatus,calculator.version]).toEqual(["standard","draft",1]);});
 it("rejects batteryEnergyAddedKwh NaN on direct calls",()=>{expect(()=>calculator.calculate({...input,batteryEnergyAddedKwh:NaN} as never,{})).toThrow();});
 it("rejects batteryEnergyAddedKwh positive infinity on direct calls",()=>{expect(()=>calculator.calculate({...input,batteryEnergyAddedKwh:Infinity} as never,{})).toThrow();});
 it("rejects batteryEnergyAddedKwh negative infinity on direct calls",()=>{expect(()=>calculator.calculate({...input,batteryEnergyAddedKwh:-Infinity} as never,{})).toThrow();});
 it("rejects batteryEnergyAddedKwh string on direct calls",()=>{expect(()=>calculator.calculate({...input,batteryEnergyAddedKwh:"1"} as never,{})).toThrow();});
 it("rejects batteryEnergyAddedKwh missing on direct calls",()=>{expect(()=>calculator.calculate({...input,batteryEnergyAddedKwh:undefined} as never,{})).toThrow();});
 it("rejects batteryEnergyAddedKwh negative on direct calls",()=>{expect(()=>calculator.calculate({...input,batteryEnergyAddedKwh:-1} as never,{})).toThrow();});
 it("rejects chargingEfficiency NaN on direct calls",()=>{expect(()=>calculator.calculate({...input,chargingEfficiency:NaN} as never,{})).toThrow();});
 it("rejects chargingEfficiency positive infinity on direct calls",()=>{expect(()=>calculator.calculate({...input,chargingEfficiency:Infinity} as never,{})).toThrow();});
 it("rejects chargingEfficiency negative infinity on direct calls",()=>{expect(()=>calculator.calculate({...input,chargingEfficiency:-Infinity} as never,{})).toThrow();});
 it("rejects chargingEfficiency string on direct calls",()=>{expect(()=>calculator.calculate({...input,chargingEfficiency:"1"} as never,{})).toThrow();});
 it("rejects chargingEfficiency missing on direct calls",()=>{expect(()=>calculator.calculate({...input,chargingEfficiency:undefined} as never,{})).toThrow();});
 it("rejects chargingEfficiency negative on direct calls",()=>{expect(()=>calculator.calculate({...input,chargingEfficiency:-1} as never,{})).toThrow();});
it("supports zero energy and unity efficiency",()=>{expect(calculator.calculate({...input,batteryEnergyAddedKwh:0},{})).toEqual({wallEnergyKwh:0,lossKwh:0});expect(calculator.calculate({...input,chargingEfficiency:1},{})).toEqual({wallEnergyKwh:12,lossKwh:0});});
it("rejects efficiency endpoints and overflow",()=>{for(const chargingEfficiency of [0,1.01])expect(()=>calculator.calculate({...input,chargingEfficiency},{})).toThrow();expect(()=>calculator.calculate({...input,batteryEnergyAddedKwh:Number.MAX_VALUE,chargingEfficiency:Number.MIN_VALUE},{})).toThrow();});
it("rejects incompatible unit properties",()=>{expect(()=>calculator.calculate({...input,unit:"unsupported"} as never,{})).toThrow();});
});

it("keeps examples, goldens and source metadata valid",()=>{for(const example of calculator.examples){expect(calculator.inputSchema.safeParse(example.input).success).toBe(true);expect(calculator.calculate(example.input,{})).toEqual(example.expected);}for(const golden of calculator.goldenTests ?? [])expect(calculator.calculate(golden.input,{})).toMatchObject(golden.expected);expect(calculator.sources.some(source=>source.url?.startsWith("https://"))).toBe(true);});
