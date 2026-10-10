import { describe, expect, it } from "vitest";
import { physicsMechanicsBatch5Definitions, physicalPendulum, rollingKinetic, uniformRodInertia, angularKinematics, rollingSpeed } from "./catalog-batch-5";
describe("physics mechanics batch 5 direct-call regression", () => {
  it("preserves all five worked examples", () => {
    for (const calculator of physicsMechanicsBatch5Definitions) {
      const example=calculator.examples[0];
      expect(calculator.calculate(example.input as never).value).toBeCloseTo(example.expected.value,6);
    }
  });
  it("rejects malformed direct calls", () => {
    for (const calculator of physicsMechanicsBatch5Definitions)
      expect(() => calculator.calculate({} as never)).toThrow();
  });
  it("enforces positive pendulum denominators and finite bounds", () => {
    expect(() => physicalPendulum.calculate({momentOfInertiaKgM2:2,massKg:1,gravityMps2:9.8,pivotToComM:0})).toThrow();
    expect(() => rollingKinetic.calculate({massKg:1,linearSpeedMps:Number.POSITIVE_INFINITY,momentOfInertiaKgM2:1,angularSpeedRadS:2})).toThrow();
    expect(() => uniformRodInertia.calculate({massKg:-1,lengthM:2})).toThrow();
    expect(() => angularKinematics.calculate({initialAngularSpeedRadS:1,angularAccelerationRadS2:2,timeS:-1})).toThrow();
    expect(() => rollingSpeed.calculate({angularSpeedRadS:2,radiusM:-1})).toThrow();
  });
});
