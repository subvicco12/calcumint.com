import { z } from "zod";
import { evaluateFormula } from "./formula";

export const customFieldSchema = z.object({
  key: z.string().regex(/^[A-Za-z_][A-Za-z0-9_]*$/).max(64),
  label: z.string().min(1).max(120),
  type: z.enum(["number", "currency", "percentage"]),
  required: z.boolean().default(true),
  min: z.number().finite().nullable().optional(),
  max: z.number().finite().nullable().optional(),
  step: z.number().positive().finite().nullable().optional(),
  defaultValue: z.number().finite().nullable().optional(),
  helpText: z.string().max(300).nullable().optional()
});

export const customOutputSchema = z.object({
  key: z.string().regex(/^[A-Za-z_][A-Za-z0-9_]*$/).max(64),
  label: z.string().min(1).max(120),
  formula: z.string().min(1).max(2000),
  format: z.enum(["number", "currency", "percentage"]).default("number"),
  decimals: z.number().int().min(0).max(12).default(2)
});

export const customCalculatorSchema = z.object({
  name: z.string().min(2).max(120),
  description: z.string().max(1000).default(""),
  fields: z.array(customFieldSchema).min(1).max(50),
  outputs: z.array(customOutputSchema).min(1).max(20)
}).superRefine((definition, ctx) => {
  const keys = [...definition.fields.map((field) => field.key), ...definition.outputs.map((output) => output.key)];
  if (new Set(keys).size !== keys.length) ctx.addIssue({ code: "custom", message: "Field and output keys must be unique" });
});

export type CustomCalculatorDefinition = z.infer<typeof customCalculatorSchema>;

export function validateCustomInput(definition: CustomCalculatorDefinition, raw: Record<string, unknown>): Record<string, number> {
  const result: Record<string, number> = {};
  for (const field of definition.fields) {
    const rawValue = raw[field.key];
    if ((rawValue === undefined || rawValue === null || rawValue === "") && !field.required) continue;
    const value = Number(rawValue ?? field.defaultValue);
    if (!Number.isFinite(value)) throw new Error(`${field.label} must be a valid number`);
    if (field.min != null && value < field.min) throw new Error(`${field.label} must be at least ${field.min}`);
    if (field.max != null && value > field.max) throw new Error(`${field.label} must be at most ${field.max}`);
    result[field.key] = value;
  }
  return result;
}

export function runCustomCalculator(definition: CustomCalculatorDefinition, raw: Record<string, unknown>) {
  const parsed = customCalculatorSchema.parse(definition);
  const variables = validateCustomInput(parsed, raw);
  const output: Record<string, number | boolean> = {};
  for (const item of parsed.outputs) {
    const value = evaluateFormula(item.formula, { ...variables, ...Object.fromEntries(Object.entries(output).filter(([, value]) => typeof value === "number")) as Record<string, number> });
    output[item.key] = value;
  }
  return { input: variables, output };
}
