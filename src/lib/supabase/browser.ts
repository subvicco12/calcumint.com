"use client";

import { createBrowserClient, parseCookieHeader, serializeCookieHeader } from "@supabase/ssr";
import { readableSessionCookies } from "./session-cookies";

export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createBrowserClient(url, key, {
    cookies: {
      getAll() {
        const cookies = typeof document === "undefined" ? [] : parseCookieHeader(document.cookie).map(({ name, value }) => ({ name, value: value ?? "" }));
        return readableSessionCookies(cookies, url);
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          document.cookie = serializeCookieHeader(name, value, options);
        }
      }
    }
  });
}
