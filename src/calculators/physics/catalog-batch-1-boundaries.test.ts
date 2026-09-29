import { describe, expect, it } from "vitest";
import { distanceTimeCalculator, forceCalculator, workCalculator, kineticEnergyCalculator, potentialEnergyCalculator } from "./catalog-batch-1";

describe("physics finite result boundaries",()=>{
  const cases=[
    [distanceTimeCalculator,{speed:1e100,time:1e100}],
    [forceCalculator,{mass:1e100,acceleration:1e100}],
    [workCalculator,{force:1e100,distance:1e100,angleDegrees:0}],
    [kineticEnergyCalculator,{mass:1e100,velocity:1e100}],
    [potentialEnergyCalculator,{mass:1e100,gravity:1e100,height:1e100}],
  ] as const;
  for(const [calculator,input] of cases){it(`${calculator.slug} remains finite at schema bounds`,()=>{const parsed=calculator.inputSchema.parse(input);const result=calculator.calculate(parsed as never,{});expect(Number.isFinite(result.value)).toBe(true);});}
});
