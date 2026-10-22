import { z } from "zod";
import type { CalculatorDefinition } from "../types";
import { formatRational, parseDecimal } from "./draft-exact-decimal";

const decimal = z.string().refine((value) => {
  try { parseDecimal(value); return true; } catch { return false; }
}, "Use a plain decimal with at most 100 significant and fractional digits");
const inputSchema = z.object({ left: decimal, right: decimal, operation: z.enum(["add", "subtract", "multiply", "divide"]) }).superRefine((value, ctx) => {
  if (value.operation === "divide") {
    try { if (parseDecimal(value.right).numerator === 0n) ctx.addIssue({ code: "custom", path: ["right"], message: "Division by zero is undefined" }); } catch { /* Field validation owns invalid decimals. */ }
  }
});
export type BasicDraftInput = z.infer<typeof inputSchema>;
export type BasicDraftOutput = { result: string };

/** Master 205: owner-authorized implementation only; never imported by public registry/discovery. */
export const basicDraftCalculator: CalculatorDefinition<BasicDraftInput, BasicDraftOutput> = {
  id: "math.basic", slug: "basic-calculator", title: "Basic Calculator", category: "math", version: 1,
  riskClass: "standard", reviewStatus: "draft", inputSchema,
  calculate(input) {
    const { left, right, operation } = inputSchema.parse(input);
    const a = parseDecimal(left), b = parseDecimal(right);
    let n: bigint, d: bigint;
    if (operation === "multiply") { n = a.numerator * b.numerator; d = a.denominator * b.denominator; }
    else if (operation === "divide") { n = a.numerator * b.denominator; d = a.denominator * b.numerator; }
    else { n = a.numerator * b.denominator + (operation === "add" ? 1n : -1n) * b.numerator * a.denominator; d = a.denominator * b.denominator; }
    return { result: formatRational(n, d) };
  },
  formulas: [{ id: "exact-four-operations", expression: "a+b; a-b; a*b; a/b", description: "Exact rational intermediates; one final 34-significant-digit half-even rounding. No expression parser." }],
  sources: [{ label: "Python decimal: precision and ROUND_HALF_EVEN reference policy", url: "https://github.com/python/cpython/blob/0815fe3afc001e4cedc44cc8007ce8597eba7c51/Doc/library/decimal.rst", note: "Draft numerical policy; not certification or a historical version replacement." }],
  examples: [{ label: "Exact decimal addition", input: { left: "0.1", right: "0.2", operation: "add" }, expected: { result: "0.3" } }],
  goldenTests: [{ label: "Exact one eighth", input: { left: "1", right: "8", operation: "divide" }, expected: { result: "0.125" } }],
  ui: { simpleInputKeys: ["left", "operation", "right"] }
};
