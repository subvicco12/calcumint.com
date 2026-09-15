import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(
    {
      ok: true,
      service: "calcumint-web",
      environment: process.env.NODE_ENV ?? "unknown",
      timestamp: new Date().toISOString()
    },
    {
      status: 200,
      headers: {
        "cache-control": "no-store",
        "x-robots-tag": "noindex, nofollow"
      }
    }
  );
}
