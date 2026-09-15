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

export const customChartSchema = z.object({
  title: z.string().min(1).max(120),
  type: z.enum(["bar", "comparison"]),
  outputKeys: z.array(z.string().regex(/^[A-Za-z_][A-Za-z0-9_]*$/)).min(1).max(12)
});

export const customBrandingSchema = z.object({
  companyName: z.string().max(120).default(""),
  logoUrl: z.string().url().or(z.literal("")).default(""),
  accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default("#0b7a66")
});

export const customCalculatorSchema = z.object({
  name: z.string().min(2).max(120),
  description: z.string().max(1000).default(""),
  visibility: z.enum(["private", "workspace", "share-link"]).default("private"),
  branding: customBrandingSchema.default({ companyName: "", logoUrl: "", accentColor: "#0b7a66" }),
  fields: z.array(customFieldSchema).min(1).max(50),
  outputs: z.array(customOutputSchema).min(1).max(20),
  charts: z.array(customChartSchema).max(8).default([])
}).superRefine((definition, ctx) => {
  const keys = [...definition.fields.map((field) => field.key), ...definition.outputs.map((output) => output.key)];
  if (new Set(keys).size !== keys.length) ctx.addIssue({ code: "custom", message: "Field and output keys must be unique" });
  const outputKeys = new Set(definition.outputs.map((output) => output.key));
  definition.charts.forEach((chart, chartIndex) => chart.outputKeys.forEach((key) => {
    if (!outputKeys.has(key)) ctx.addIssue({ code: "custom", path: ["charts", chartIndex, "outputKeys"], message: `Chart references unknown output: ${key}` });
  }));
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
    const numericOutputs = Object.fromEntries(Object.entries(output).filter(([, value]) => typeof value === "number")) as Record<string, number>;
    output[item.key] = evaluateFormula(item.formula, { ...variables, ...numericOutputs });
  }
  return { input: variables, output };
}
