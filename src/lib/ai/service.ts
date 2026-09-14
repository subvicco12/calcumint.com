import { z } from "zod";
import { customCalculatorSchema, runCustomCalculator } from "@/lib/builder/definition";
import { deterministicCalculatorSearch, publicCalculatorCatalog } from "./catalog";
import { AI_GROUNDING_RULES } from "./policy";
import { getAiProvider } from "./provider";

const finderResponseSchema = z.object({
  recommendations: z.array(z.object({ slug: z.string(), reason: z.string().min(1).max(400) })).max(5)
});

const explanationResponseSchema = z.object({
  summary: z.string().min(1).max(1600),
  keyPoints: z.array(z.string().min(1).max(500)).max(6),
  caveat: z.string().max(800).optional()
});

export async function findCalculatorWithAi(query: string) {
  const fallback = deterministicCalculatorSearch(query, 5);
  const provider = getAiProvider();
  if (!provider) return { recommendations: fallback.map((item) => ({ ...item, reason: item.description })), usedAi: false, usage: undefined };

  const catalog = publicCalculatorCatalog();
  const result = await provider.generateJson([
    { role: "system", content: `${AI_GROUNDING_RULES.join("\n")}\nYou are a calculator discovery router. Choose only slugs from the supplied catalog. Never answer the user's calculation. Return {"recommendations":[{"slug":"...","reason":"..."}]}.` },
    { role: "user", content: JSON.stringify({ query, catalog }) }
  ]);
  const parsed = finderResponseSchema.parse(result.data);
  const catalogBySlug = new Map(catalog.map((item) => [item.slug, item]));
  const recommendations = parsed.recommendations.flatMap((item) => {
    const match = catalogBySlug.get(item.slug);
    return match ? [{ ...match, score: 0, reason: item.reason }] : [];
  });
  return { recommendations: recommendations.length ? recommendations : fallback.map((item) => ({ ...item, reason: item.description })), usedAi: recommendations.length > 0, usage: result };
}

export async function explainDeterministicResult(input: {
  calculatorName: string;
  formula?: string;
  assumptions?: readonly string[];
  values: Record<string, unknown>;
  result: Record<string, unknown>;
  scenarioQuestion?: string;
}) {
  const provider = getAiProvider();
  if (!provider) throw new Error("AI provider is not configured");
  const response = await provider.generateJson([
    { role: "system", content: `${AI_GROUNDING_RULES.join("\n")}\nExplain the supplied deterministic result in plain language. The numeric result is immutable. If a scenario question is supplied, explain which inputs the user could vary and the qualitative direction of change; do not calculate a new result. Return {"summary":"...","keyPoints":["..."],"caveat":"..."}.` },
    { role: "user", content: JSON.stringify(input) }
  ]);
  return { ...explanationResponseSchema.parse(response.data), usage: response };
}

export async function proposeBuilderDefinition(prompt: string) {
  const provider = getAiProvider();
  if (!provider) throw new Error("AI provider is not configured");
  const response = await provider.generateJson([
    { role: "system", content: `${AI_GROUNDING_RULES.join("\n")}\nDesign a CalcuMint custom calculator definition. Allowed field types: number,currency,percentage. Allowed formula syntax: + - * / ^, comparisons, &&, ||, parentheses, IF, MIN, MAX, ABS, ROUND, FLOOR, CEIL. No JavaScript, strings, network calls, lookups or unsupported functions. Definition keys are name, description, visibility, branding, fields, outputs and charts. visibility must be private, workspace or share-link. branding has companyName, logoUrl and accentColor. charts is an array of {title,type,outputKeys}, where type is bar or comparison. Return exactly {"definition":{...},"notes":["..."]}.` },
    { role: "user", content: prompt.slice(0, 5000) }
  ]);
  const envelope = z.object({ definition: z.unknown(), notes: z.array(z.string().max(500)).max(8).default([]) }).parse(response.data);
  const definition = customCalculatorSchema.parse(envelope.definition);
  const sampleInput = Object.fromEntries(definition.fields.map((field) => [field.key, field.defaultValue ?? field.min ?? 1]));
  runCustomCalculator(definition, sampleInput);
  return { definition, notes: envelope.notes, usage: response };
}
