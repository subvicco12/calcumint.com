import { describe, expect, it } from "vitest";
import numericalReceipt from "../../../docs/first20-publication/wave1-numerical.json";
import { wave1Bindings, wave1Witnesses, evaluateWave1Witnesses, evaluateWave1IeeeProbes, getWave1Definition } from "./wave1-witnesses";

describe("first20 new actual-engine evidence", () => {
  it("pins the exact supplied wave1 and version bindings", () => {
    expect(wave1Bindings.map(row => row.masterId)).toEqual([209,210,218,219,220,221,225,255,256,259,260,261,262,265,266,267,273,278,279,280]);
    for (const row of wave1Bindings) {
      const definition = getWave1Definition(row.masterId);
      expect([definition.id, definition.slug, definition.version]).toEqual([row.engineId,row.slug,1]);
      expect(wave1Witnesses.filter(w => w.masterId === row.masterId).map(w => w.kind)).toEqual(["numerical","boundary","rejection"]);
    }
    expect(() => getWave1Definition(268)).toThrow();
  });
  it("checks new independent arithmetic, schema rejection, frozen input and exact JSON replay", () => {
    const results = evaluateWave1Witnesses();
    for (const result of results) {
      expect(result.immutable, result.id).toBe(true);
      if (result.accepted) {
        expect(result.numericalPass, result.id).toBe(true);
        expect(result.replayParity, result.id).toBe(true);
        expect(result.planComputeParity, result.id).toBe(true);
      } else expect(result.rejectionPass, result.id).toBe(true);
    }
    expect(results.filter(row => row.accepted)).toHaveLength(40);
  });
  it("records IEEE underflow and overflow without narrowing the engine domain", () => {
    const probes = evaluateWave1IeeeProbes();
    expect(probes.slice(0,3).every(row => row.accepted && 'underflowToZero' in row && row.underflowToZero)).toBe(true);
    expect(probes.slice(3).every(row => !row.accepted)).toBe(true);
  });
  it("replays the committed JSON receipt exactly", () => {
    expect(JSON.parse(JSON.stringify(evaluateWave1Witnesses()))).toEqual(numericalReceipt.evaluations);
    expect(JSON.parse(JSON.stringify(evaluateWave1IeeeProbes()))).toEqual(numericalReceipt.ieeeProbes);
    expect(wave1Bindings).toEqual(numericalReceipt.bindings);
    expect(wave1Witnesses).toEqual(numericalReceipt.witnesses);
    expect(numericalReceipt.releaseHold).toBe(true);
  });
});
