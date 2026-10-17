import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { publicEnv } from "@/lib/env";
import { readableSessionCookies } from "./session-cookies";

export async function createSupabaseServerClient({requireCookieWrites=false}:{requireCookieWrites?:boolean}={}) {
  const url = publicEnv.NEXT_PUBLIC_SUPABASE_URL;
  const key = publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  const cookieStore = await cookies();

  const client = createServerClient(url, key, {
    cookies: {
      getAll() {
        return readableSessionCookies(cookieStore.getAll(), url);
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch (error) {
          // Mutating auth callers must not report success when response cookies fail.
          if(requireCookieWrites)throw error;
          // Server Component readers retain best-effort refresh behavior.
        }
      }
    }
  });

  // Let SDK initialization finish invalid-session cleanup before auth mutations.
  if (requireCookieWrites) await client.auth.initialize();
  return client;
}
