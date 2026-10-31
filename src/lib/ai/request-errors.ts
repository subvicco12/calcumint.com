import { NextResponse } from "next/server";
import type { ZodType } from "zod";

/** Only explicitly classified access failures may become public diagnostics. */
export class AiAccessError extends Error {
  constructor(message: string, readonly status: 403 | 429) { super(message); }
}

class InvalidAiRequestError extends Error {}

export async function parseAiRequest<T>(request: Request, schema: ZodType<T>): Promise<T> {
  try { return schema.parse(await request.json()); }
  catch { throw new InvalidAiRequestError(); }
}

export function aiErrorResponse(error: unknown) {
  if (error instanceof AiAccessError) return NextResponse.json({ error: error.message }, { status: error.status });
  if (error instanceof InvalidAiRequestError) return NextResponse.json({ error: "Invalid AI request." }, { status: 400 });
  return NextResponse.json({ error: "AI assistance is temporarily unavailable. Please try again." }, { status: 503 });
}

/** Claim the attempt before awaiting, including when the transport rejects. */
export function onceAiFinalizer<T>(finish: (usage: T | undefined, succeeded: boolean) => Promise<void>) {
  let attempted = false;
  return async (usage: T | undefined, succeeded: boolean) => {
    if (attempted) return;
    attempted = true;
    await finish(usage, succeeded);
  };
}
