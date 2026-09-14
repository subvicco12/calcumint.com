import { serverEnv } from "@/lib/env";

export type AiMessage = { role: "system" | "user"; content: string };
export type AiJsonResult = { data: unknown; provider: string; model: string; inputTokens?: number; outputTokens?: number };

export interface AiProvider {
  readonly name: string;
  readonly model: string;
  generateJson(messages: readonly AiMessage[]): Promise<AiJsonResult>;
}

class OpenAiCompatibleProvider implements AiProvider {
  readonly name = serverEnv.AI_PROVIDER ?? "openai-compatible";
  readonly model = serverEnv.AI_MODEL ?? "";

  async generateJson(messages: readonly AiMessage[]): Promise<AiJsonResult> {
    if (!serverEnv.AI_API_KEY || !serverEnv.AI_BASE_URL || !this.model) throw new Error("AI provider is not configured");
    const response = await fetch(`${serverEnv.AI_BASE_URL.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${serverEnv.AI_API_KEY}` },
      body: JSON.stringify({ model: this.model, temperature: 0.2, response_format: { type: "json_object" }, messages }),
      signal: AbortSignal.timeout(20_000)
    });
    if (!response.ok) throw new Error(`AI provider request failed (${response.status})`);
    const payload = await response.json() as {
      choices?: Array<{ message?: { content?: string } }>;
      usage?: { prompt_tokens?: number; completion_tokens?: number };
    };
    const content = payload.choices?.[0]?.message?.content;
    if (!content) throw new Error("AI provider returned no content");
    let data: unknown;
    try { data = JSON.parse(content); } catch { throw new Error("AI provider returned invalid JSON"); }
    return { data, provider: this.name, model: this.model, inputTokens: payload.usage?.prompt_tokens, outputTokens: payload.usage?.completion_tokens };
  }
}

export function getAiProvider(): AiProvider | null {
  if (!serverEnv.AI_PROVIDER || !serverEnv.AI_API_KEY || !serverEnv.AI_BASE_URL || !serverEnv.AI_MODEL) return null;
  return new OpenAiCompatibleProvider();
}
