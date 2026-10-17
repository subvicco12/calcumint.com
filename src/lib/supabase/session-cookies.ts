import { combineChunks, isChunkLike, stringFromBase64URL } from "@supabase/ssr";

type SessionCookie = { name: string; value: string };

// Match the installed SDK's default project storage key and transport decoder.
// This does not parse, authenticate, repair or assign an identity to a session.
export async function readableSessionCookies(cookies: SessionCookie[], supabaseUrl: string): Promise<SessionCookie[]> {
  const storageKey = `sb-${new URL(supabaseUrl).hostname.split(".")[0]}-auth-token`;
  const values = new Map(cookies.map(({ name, value }) => [name, value]));
  const encoded = await combineChunks(storageKey, (name) => values.get(name));
  if (!encoded?.startsWith("base64-")) return cookies;

  try {
    stringFromBase64URL(encoded.slice("base64-".length));
    return cookies;
  } catch {
    // Keep names visible so the SDK can remove stale chunks on a fresh sign-in.
    // PKCE, other projects and application cookies are outside this namespace.
    return cookies.map((cookie) => isChunkLike(cookie.name, storageKey) ? { ...cookie, value: "" } : cookie);
  }
}
