import {describe,it,expect} from "vitest";
import {planetaryWeightCalculator,planetaryGravityReferences,GRAVITY_REFERENCE_VERSION} from "./draft-master-531";
import goldens from "../verification/fixtures/draft-master-531-goldens.json";
describe("531 versioned reference-model planetary weight",()=>{
 for(const row of goldens.rows)it(`independent80digit reference: ${row.body}`,()=>{
  const o=planetaryWeightCalculator.calculate({bodyMass:70,massUnit:"kg",body:row.body as never,referenceVersion:GRAVITY_REFERENCE_VERSION},{});
  expect(o.referenceGravityMps2).toBeCloseTo(Number(row.gravity),12);
  expect(o.weightNewtons).toBeCloseTo(Number(row.weight70N),10);
  expect(o.earthEquivalentKg).toBeCloseTo(Number(row.equivalent70Kg),10);
  expect(o.bodyMassKg).toBe(70);
 });
 it("standard Earth gravity is distinct from the NASA spherical Earth model",()=>{
  const o=planetaryWeightCalculator.calculate({bodyMass:70,massUnit:"kg",body:"standard-earth",referenceVersion:GRAVITY_REFERENCE_VERSION},{});
  expect(o.earthEquivalentKg).toBeCloseTo(70,12);expect(o.weightNewtons).toBe(70*9.80665);
  expect(planetaryGravityReferences.earth.gravity).not.toBe(9.80665);
 });
 it("converts international pounds without changing physical mass",()=>{
  const a=planetaryWeightCalculator.calculate({bodyMass:100,massUnit:"lb",body:"moon",referenceVersion:GRAVITY_REFERENCE_VERSION},{});
  expect(a.bodyMassKg).toBe(45.359237);
 });
 it.each([0,-0])("supports genuine zero mass",bodyMass=>expect(planetaryWeightCalculator.calculate({bodyMass,massUnit:"kg",body:"mars",referenceVersion:GRAVITY_REFERENCE_VERSION},{}).weightNewtons).toBe(0));
 it.each([{bodyMass:-1},{bodyMass:Infinity},{body:"saturn"},{referenceVersion:"latest"},{massUnit:"stone"}])("rejects invalid version/body/units %j",patch=>{
  const x={bodyMass:70,massUnit:"kg",body:"earth",referenceVersion:GRAVITY_REFERENCE_VERSION,...patch};expect(planetaryWeightCalculator.inputSchema.safeParse(x).success).toBe(false);expect(()=>planetaryWeightCalculator.calculate(x as never,{})).toThrow();
 });
 it("fails closed on force overflow",()=>expect(()=>planetaryWeightCalculator.calculate({bodyMass:1e308,massUnit:"kg",body:"jupiter",referenceVersion:GRAVITY_REFERENCE_VERSION},{})).toThrow());
 it("fails closed on positive unit-conversion underflow",()=>expect(()=>planetaryWeightCalculator.calculate({bodyMass:Number.MIN_VALUE,massUnit:"lb",body:"moon",referenceVersion:GRAVITY_REFERENCE_VERSION},{})).toThrow());
});
