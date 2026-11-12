import { describe, expect, it } from "vitest";
import { launchDefinitions } from "../../../calculators/launch-portfolio";
import { basicMathContracts, calculateBasicMath } from "./basic-math";

// Hand specified witnesses, never computed from engine metadata or example outputs.
const witnesses = [
  { id: 208, input: { old: -80, next: -60 }, expected: 25 },
  { id: 209, input: { value: 240, percent: 12.5 }, expected: 270 },
  { id: 210, input: { value: 240, percent: 125 }, expected: -60 },
  { id: 211, input: { a: -7, b: 4 }, expected: -1.75 },
  { id: 212, input: { a: 3, b: 8 }, expected: 0.375 },
  { id: 215, input: { numerator: -7, denominator: 8 }, expected: -0.875 },
  { id: 216, input: { a: -10, b: 16 }, expected: 3 },
  { id: 218, input: { x: -12 }, expected: 144 },
  { id: 219, input: { x: -3 }, expected: -27 },
  { id: 220, input: { x: 225 }, expected: 15 },
] as const;

describe("private basic math factory delivery", () => {
  it("binds only the ten explicit catalog identities and actual engines", () => {
    expect(basicMathContracts.map(row => row.catalogId)).toEqual([208,209,210,211,212,215,216,218,219,220]);
    for (const row of basicMathContracts) {
      const engine = launchDefinitions.find(engine => engine.id === row.engineId)!;
      expect(engine).toBeDefined();
      expect([engine.slug, engine.version, engine.title]).toEqual([row.slug,row.version,row.title]);
      expect(engine.inputSchema.parse(Object.fromEntries(row.fields.map(field => [field.key,field.defaultValue])))).toBeDefined();
    }
  });
  for (const witness of witnesses) {
    it(`independent actual-engine witness and immutable capture ${witness.id}`, () => {
      const contract = basicMathContracts.find(row => row.catalogId === witness.id)!;
      const engine = launchDefinitions.find(row => row.id === contract.engineId)!;
      expect(engine.calculate(engine.inputSchema.parse(witness.input), {}).result).toBe(witness.expected);
      const input = { ...witness.input, ignored: 42 };
      const delivered = calculateBasicMath(witness.id,input);
      expect(delivered.result.primaryResult.value).toBe(witness.expected);
      expect(delivered.snapshot.input).toEqual(witness.input);
      expect(delivered.snapshot.output).toEqual({ result: witness.expected });
      expect(delivered.snapshot.calculatorSlug).toBe(contract.slug);
      expect(delivered.snapshot.calculatorVersion).toBe(1);
      expect(Object.isFrozen(delivered.snapshot.input)).toBe(true);
      expect(Object.isFrozen(delivered.snapshot.output)).toBe(true);
      input.ignored = 99;
      expect(delivered.snapshot.input).not.toHaveProperty("ignored");
    });
  }
  it("preserves percentage units and bounded two-number mean semantics", () => {
    expect(calculateBasicMath(208,{old:80,next:100}).result.primaryResult.unit).toBe("%");
    expect(calculateBasicMath(216,{a:Number.MAX_VALUE,b:Number.MAX_VALUE}).snapshot.output.result).toBe(Number.MAX_VALUE);
    expect(calculateBasicMath(220,{x:0}).snapshot.output.result).toBe(0);
  });
  it("rejects invalid domains through actual schemas and rejects non-finite outputs", () => {
    const rejected = [
      [208,{old:0,next:10}], [209,{value:100,percent:-1}], [210,{value:100,percent:-1}],
      [211,{a:2,b:0}], [212,{a:2,b:0}], [215,{numerator:2,denominator:0}],
      [216,{a:Infinity,b:1}], [218,{x:NaN}], [219,{x:"3"}], [220,{x:-1}],
      [218,{x:Number.MAX_VALUE}], [219,{x:Number.MAX_VALUE}],
    ] as const;
    for (const [id,input] of rejected) expect(() => calculateBasicMath(id,input)).toThrow();
  });
});

// Literal boundary proofs: all inputs are normal binary64 values; the exact
// nonzero mathematical result is smaller than binary64 can represent.
const lostNonzero = [
  [218,{x:1e-200}], [219,{x:1e-120}],
  [211,{a:1e-200,b:1e200}], [212,{a:1e-200,b:1e200}],
  [215,{numerator:1e-200,denominator:1e200}],
] as const;
it.each(lostNonzero)('refuses lost nonzero capture without changing engine %s', (id,input) => {
  const contract = basicMathContracts.find(row => row.catalogId === id)!;
  const engine = launchDefinitions.find(row => row.id === contract.engineId)!;
  expect(engine.calculate(engine.inputSchema.parse(input),{}).result).toBe(0);
  expect(() => calculateBasicMath(id,input)).toThrow('normal range');
});
it('refuses nonzero subnormal output at the capture boundary', () => {
  for (const [id,input] of [[218,{x:1e-160}],[219,{x:1e-105}],[211,{a:1e-200,b:1e110}],[212,{a:1e-200,b:1e110}],[215,{numerator:1e-200,denominator:1e110}]] as const)
    expect(() => calculateBasicMath(id,input)).toThrow('normal range');
});
it('retains mathematically zero output for every calculator-specific zero case', () => {
  for (const [id,input] of [
    [208,{old:80,next:80}],[209,{value:0,percent:20}],
    [210,{value:0,percent:20}],[210,{value:80,percent:100}],
    [211,{a:0,b:4}],[212,{a:0,b:4}],[215,{numerator:0,denominator:4}],
    [216,{a:8,b:-8}],[218,{x:0}],[219,{x:0}],[220,{x:0}],
  ] as const) expect(calculateBasicMath(id,input).snapshot.output.result).toBe(0);
});
