import { aiErrorResponse, onceAiFinalizer, parseAiRequest } from "@/lib/ai/request-errors";
import { NextResponse } from "next/server";
import { z } from "zod";
import { consumeAiAccess, finishAiUsage } from "@/lib/ai/access";
import { proposeBuilderDefinition } from "@/lib/ai/service";

const requestSchema = z.object({ prompt: z.string().trim().min(10).max(5000) });

export async function POST(request: Request) {
  let access: Awaited<ReturnType<typeof consumeAiAccess>> | null = null;
  const finalize = onceAiFinalizer<Parameters<typeof finishAiUsage>[1]>(async (usage, succeeded) => {
    if (access) await finishAiUsage(access, usage, succeeded);
  });
  try {
    const { prompt } = await parseAiRequest(request, requestSchema);
    access = await consumeAiAccess("builder");
    const proposal = await proposeBuilderDefinition(prompt);
    await finalize(proposal.usage, true);
    return NextResponse.json({ definition: proposal.definition, notes: proposal.notes });
  } catch (error) {
    try { if (access) await finalize(undefined, false); } catch { /* Keep accounting diagnostics private. */ }
    return aiErrorResponse(error);
  }
}
