import { NextResponse } from "next/server";
import { z } from "zod";
import { deterministicCalculatorSearch } from "@/lib/ai/catalog";
import { getAiProvider } from "@/lib/ai/provider";
import { consumeAiAccess, finishAiUsage, getAiSession } from "@/lib/ai/access";
import { findCalculatorWithAi } from "@/lib/ai/service";

const requestSchema = z.object({ query: z.string().trim().min(2).max(500) });

export async function POST(request: Request) {
  try {
    const { query } = requestSchema.parse(await request.json());
    if (!getAiProvider()) return NextResponse.json({ recommendations: deterministicCalculatorSearch(query), usedAi: false });
    const session = await getAiSession();
    if (!session) return NextResponse.json({ recommendations: deterministicCalculatorSearch(query), usedAi: false });

    const access = await consumeAiAccess("finder");
    try {
      const result = await findCalculatorWithAi(query);
      await finishAiUsage(access, result.usage, true);
      return NextResponse.json({ recommendations: result.recommendations, usedAi: result.usedAi });
    } catch (error) {
      await finishAiUsage(access, undefined, false);
      return NextResponse.json({ recommendations: deterministicCalculatorSearch(query), usedAi: false, warning: error instanceof Error ? error.message : "AI unavailable" });
    }
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid request" }, { status: 400 });
  }
}
