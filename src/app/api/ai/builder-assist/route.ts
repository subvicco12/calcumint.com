import { NextResponse } from "next/server";
import { z } from "zod";
import { consumeAiAccess, finishAiUsage } from "@/lib/ai/access";
import { proposeBuilderDefinition } from "@/lib/ai/service";

const requestSchema = z.object({ prompt: z.string().trim().min(10).max(5000) });

export async function POST(request: Request) {
  let access: Awaited<ReturnType<typeof consumeAiAccess>> | null = null;
  try {
    const { prompt } = requestSchema.parse(await request.json());
    access = await consumeAiAccess("builder");
    const proposal = await proposeBuilderDefinition(prompt);
    await finishAiUsage(access, proposal.usage, true);
    return NextResponse.json({ definition: proposal.definition, notes: proposal.notes });
  } catch (error) {
    if (access) await finishAiUsage(access, undefined, false);
    const message = error instanceof Error ? error.message : "Builder assistance failed";
    const status = /Business plan required|Sign in|limit/i.test(message) ? 403 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
