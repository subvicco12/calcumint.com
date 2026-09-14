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
  try {
    const body = requestSchema.parse(await request.json());
    const feature = body.scenarioQuestion ? "scenario" : "explain";
    access = await consumeAiAccess(feature);
    const explanation = await explainDeterministicResult(body);
    await finishAiUsage(access, explanation.usage, true);
    return NextResponse.json({ summary: explanation.summary, keyPoints: explanation.keyPoints, caveat: explanation.caveat });
  } catch (error) {
    if (access) await finishAiUsage(access, undefined, false);
    const message = error instanceof Error ? error.message : "AI explanation failed";
    const status = /plan required|Sign in|limit/i.test(message) ? 403 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
