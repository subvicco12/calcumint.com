import { NextResponse } from "next/server";
import { publicEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function redirectOrigin(request: Request): string {
  // Hostinger terminates TLS at a reverse proxy, so request.url can contain
  // the internal listener origin (for example http://0.0.0.0:3000). Prefer
  // the explicitly configured public site URL for production redirects.
  try {
    return new URL(publicEnv.NEXT_PUBLIC_SITE_URL).origin;
  } catch {
    const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
    const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
    if (forwardedProto && forwardedHost) return `${forwardedProto}://${forwardedHost}`;
    return new URL(request.url).origin;
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const origin = redirectOrigin(request);
  const code = url.searchParams.get("code");
  const nextParam = url.searchParams.get("next") ?? "/account";
  const next = nextParam.startsWith("/") && !nextParam.startsWith("//") ? nextParam : "/account";
  const supabase = await createSupabaseServerClient();

  if (!supabase || !code) {
    return NextResponse.redirect(new URL("/login?error=Authentication%20callback%20failed.", origin));
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error.message)}`, origin));
  }

  return NextResponse.redirect(new URL(next, origin));
}
