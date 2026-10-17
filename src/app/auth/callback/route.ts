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
  let destination = new URL("/account", origin);
  if (nextParam.startsWith("/") && !nextParam.startsWith("//")) {
    try {
      const candidate = new URL(nextParam, origin);
      // URL parsing normalizes backslashes and removes tabs/newlines. Check
      // the resolved origin, not just the unparsed path prefix.
      if (candidate.origin === destination.origin) destination = candidate;
    } catch {
      // Malformed return paths retain the safe account destination.
    }
  }
  const failed = () => NextResponse.redirect(new URL("/login?error=Authentication%20callback%20failed.", origin));
  if (!code) return failed();
  try {
    const supabase = await createSupabaseServerClient({requireCookieWrites:true});
    if (!supabase) return failed();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return failed();
    }
  } catch {
    return failed();
  }
  return NextResponse.redirect(destination);
}
