import { NextResponse } from "next/server";
import { z } from "zod";
import { deterministicCalculatorSearch } from "@/lib/ai/catalog";
import { getAiProvider } from "@/lib/ai/provider";
import { consumeAiAccess, finishAiUsage, getAiSession } from "@/lib/ai/access";
import { findCalculatorWithAi } from "@/lib/ai/service";
import { getPublicationSnapshot } from "@/lib/publication-manifest";
import { aiErrorResponse, onceAiFinalizer, parseAiRequest } from "@/lib/ai/request-errors";

const requestSchema = z.object({ query: z.string().trim().min(2).max(500) });

export async function POST(request: Request) {
  try {
    const { query } = await parseAiRequest(request, requestSchema);
    const authority = await getPublicationSnapshot();
    if (authority.state !== "available") return NextResponse.json({ error: "Calculator availability is temporarily unavailable. Please try again." }, { status: 503 });
    const fallback = (warning?: string) => NextResponse.json({ recommendations: deterministicCalculatorSearch(query, authority.slugs), usedAi: false, ...(warning ? { warning } : {}) });
    if (!getAiProvider()) return fallback();
    const session = await getAiSession();
    if (!session) return fallback();

    const access = await consumeAiAccess("finder");
    const finalize = onceAiFinalizer<Parameters<typeof finishAiUsage>[1]>((usage, succeeded) => finishAiUsage(access, usage, succeeded));
    try {
      const result = await findCalculatorWithAi(query);
      await finalize(result.usage, true);
      return NextResponse.json({ recommendations: result.recommendations, usedAi: result.usedAi });
    } catch {
      try { await finalize(undefined, false); } catch { /* Keep accounting diagnostics private. */ }
      return fallback("AI ranking is temporarily unavailable. Showing verified catalog matches.");
    }
  } catch (error) {
    return aiErrorResponse(error);
  }
}
