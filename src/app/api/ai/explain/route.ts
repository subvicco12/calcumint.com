import { aiErrorResponse, onceAiFinalizer, parseAiRequest } from "@/lib/ai/request-errors";
import { NextResponse } from "next/server";
import { z } from "zod";
import { consumeAiAccess, finishAiUsage } from "@/lib/ai/access";
import { explainDeterministicResult } from "@/lib/ai/service";

const requestSchema = z.object({
  calculatorName: z.string().min(1).max(160),
  formula: z.string().max(2000).optional(),
  assumptions: z.array(z.string().max(500)).max(12).optional(),
  values: z.record(z.string(), z.unknown()),
  result: z.record(z.string(), z.unknown()),
  scenarioQuestion: z.string().trim().max(800).optional()
});

export async function POST(request: Request) {
  let access: Awaited<ReturnType<typeof consumeAiAccess>> | null = null;
  const finalize = onceAiFinalizer<Parameters<typeof finishAiUsage>[1]>(async (usage, succeeded) => {
    if (access) await finishAiUsage(access, usage, succeeded);
  });
  try {
    const body = await parseAiRequest(request, requestSchema);
    const feature = body.scenarioQuestion ? "scenario" : "explain";
    access = await consumeAiAccess(feature);
    const explanation = await explainDeterministicResult(body);
    await finalize(explanation.usage, true);
    return NextResponse.json({ summary: explanation.summary, keyPoints: explanation.keyPoints, caveat: explanation.caveat });
  } catch (error) {
    try { if (access) await finalize(undefined, false); } catch { /* Keep accounting diagnostics private. */ }
    return aiErrorResponse(error);
  }
}
