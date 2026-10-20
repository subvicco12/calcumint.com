import Decimal from "decimal.js";
import { z } from "zod";
import type { CalculatorDefinition } from "../types";

// Exponent range exceeds every bounded input/exponent combination so the explicit
// output guard rejects underflow instead of silently returning library zero.
// Versioned local context: never mutate Decimal's shared global configuration.
const D = Decimal.clone({ precision: 50, rounding: Decimal.ROUND_HALF_EVEN, maxE: 100000000, minE: -100000000 });
const operations = ["sin", "cos", "tan", "asin", "acos", "atan", "sqrt", "ln", "log10", "exp", "pow"] as const;
const angleOperations = new Set<string>(["sin", "cos", "tan", "asin", "acos", "atan"]);
const decimal = z.string().max(12050).refine(value => {
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(value)) return false;
  const significant = value.replace(/^[+-]/, "").replace(".", "").replace(/^0+/, "").replace(/0+$/, "");
  return significant.length <= 34;
}, "Use a plain decimal with at most 34 significant digits");
const inputSchema = z.object({ operation: z.enum(operations), x: decimal, y: decimal.optional(), angleMode: z.enum(["degrees", "radians"]).optional() }).superRefine((input, ctx) => {
  const fail = (path: string, message: string) => ctx.addIssue({ code: "custom", path: [path], message });
  // Field issues can coexist with refinements; never pass malformed syntax to Decimal.
  if (!decimal.safeParse(input.x).success || (input.y !== undefined && !decimal.safeParse(input.y).success)) return;
  const x = new D(input.x), y = input.y === undefined ? undefined : new D(input.y);
  if (x.abs().gt(1000000)) fail("x", "Absolute x must not exceed 1000000");
  if (angleOperations.has(input.operation) && !input.angleMode) fail("angleMode", "Select degrees or radians");
  if (input.operation === "pow") {
    if (!y) fail("y", "Power requires y");
    else {
      if (y.abs().gt(1000)) fail("y", "Absolute y must not exceed 1000");
      if (x.isZero() && y.lte(0)) fail("y", "Zero to a nonpositive power is undefined");
      if (x.isNegative() && !x.isZero() && !y.isInteger()) fail("y", "Negative bases require an integer exponent");
    }
  } else if (input.y !== undefined) fail("y", "y is only supported for pow");
  if (input.operation === "sqrt" && x.lt(0)) fail("x", "Square root requires x >= 0");
  if (["ln", "log10"].includes(input.operation) && x.lte(0)) fail("x", "Logarithms require x > 0");
  if (["asin", "acos"].includes(input.operation) && x.abs().gt(1)) fail("x", "Inverse sine/cosine require -1 <= x <= 1");
  if (input.operation === "exp" && x.abs().gt(1000)) fail("x", "Exponential requires absolute x <= 1000");
  if (input.operation === "tan" && input.angleMode === "degrees" && x.minus(90).mod(180).isZero()) fail("x", "Tangent is undefined at odd multiples of 90 degrees");
});
export type ScientificDraftInput = z.infer<typeof inputSchema>;
export type ScientificDraftOutput = { result: string };

/** Owner-authorized numerical DRAFT; not imported by registry or public discovery. */
export const scientificDraftCalculator: CalculatorDefinition<ScientificDraftInput, ScientificDraftOutput> = {
  id: "math.scientific", slug: "scientific-calculator", title: "Scientific Calculator", category: "math", version: 1,
  riskClass: "standard", reviewStatus: "draft", inputSchema,
  calculate(raw) {
    const { operation, x: rawX, y, angleMode } = inputSchema.parse(raw);
    const x = new D(rawX), pi = D.acos(-1);
    let result: Decimal;
    if (["sin", "cos", "tan"].includes(operation)) {
      // Reduce exact decimal degrees before introducing the finite pi approximation.
      const degrees = x.mod(360);
      const quarter = degrees.div(90);
      const eighth = degrees.div(45);
      if (angleMode === "degrees" && operation !== "tan" && quarter.isInteger()) {
        const index = quarter.mod(4).plus(4).mod(4).toNumber();
        result = new D((operation === "sin" ? [0, 1, 0, -1] : [1, 0, -1, 0])[index]);
      } else if (angleMode === "degrees" && operation === "tan" && eighth.isInteger()) {
        const index = eighth.mod(4).plus(4).mod(4).toNumber();
        result = new D([0, 1, 0, -1][index]); // Undefined indices are rejected by schema.
      } else {
        let sine: Decimal, cosine: Decimal;
        if (angleMode === "degrees") {
          // Exact quadrant/cofunction reduction avoids subtracting approximate pi
          // near a zero. Residual angles stay within 45 degrees; never snap them.
          const nearest = degrees.div(90).toNearest(1, D.ROUND_HALF_EVEN);
          const residual = degrees.minus(nearest.mul(90)).mul(pi).div(180);
          const index = nearest.mod(4).plus(4).mod(4).toNumber();
          const s = residual.sin(), c = residual.cos();
          sine = [s, c, s.neg(), c.neg()][index];
          cosine = [c, s.neg(), c.neg(), s][index];
          if (operation === "tan") {
            if (cosine.abs().lt("0.0000000000000000000000000000000000000001")) throw new RangeError("Tangent is too close to a pole");
            result = index % 2 === 0 ? residual.tan() : new D(-1).div(residual.tan());
          } else result = operation === "sin" ? sine : cosine;
        } else {
          if (operation === "tan" && x.cos().abs().lt("0.0000000000000000000000000000000000000001")) throw new RangeError("Tangent is too close to a pole");
          result = operation === "sin" ? x.sin() : operation === "cos" ? x.cos() : x.tan();
        }
      }
    } else if (["asin", "acos", "atan"].includes(operation)) {
      result = operation === "asin" ? x.asin() : operation === "acos" ? x.acos() : x.atan();
      if (angleMode === "degrees") result = result.mul(180).div(pi);
    } else if (operation === "sqrt") result = x.sqrt();
    else if (operation === "ln") result = x.ln();
    else if (operation === "log10") result = x.log(10);
    else if (operation === "exp") result = x.exp();
    else result = x.pow(new D(y!));
    if (!result.isFinite() || (!result.isZero() && (result.e < -10000 || result.e > 10000))) throw new RangeError("Result exceeds the supported exponent bounds");
    const rounded = result.toSignificantDigits(34, D.ROUND_HALF_EVEN);
    if (!rounded.isZero() && (rounded.e < -10000 || rounded.e > 10000)) throw new RangeError("Rounded result exceeds the supported exponent bounds");
    const serialized = rounded.isZero() ? "0" : rounded.toFixed();
    if (serialized.length > 12050) throw new RangeError("Result exceeds the supported serialization length");
    return { result: serialized };
  },
  formulas: [{ id: "bounded-scientific", expression: "sin cos tan asin acos atan sqrt ln log10 exp pow", description: "decimal.js 10.6.0 local precision 50 half-even; final 34 significant digits. Exact degree lattice identities; principal inverse angles. This deterministic numerical policy does not claim universal correct rounding." }],
  sources: [{ label: "decimal.js numerical API", url: "https://github.com/MikeMcl/decimal.js/blob/b1d1e311eb272b16f5b2ca0e0d1f4c4fa8558edf/doc/API.html", note: "Pinned draft numerical policy, not certification." }],
  examples: [{ label: "Square root", input: {operation:"sqrt",x:"4"}, expected: {result:"2"} }],
  goldenTests: [{ label: "Exact degree identity", input: {operation:"sin",x:"180",angleMode:"degrees"}, expected: {result:"0"} }],
  ui: { simpleInputKeys: ["operation", "x", "y", "angleMode"] }
};
