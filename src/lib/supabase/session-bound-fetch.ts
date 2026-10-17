import { combineChunks, isChunkLike, parseCookieHeader, stringFromBase64URL } from "@supabase/ssr";

// Only /user reads are bound: the SDK still owns mutations, refresh and errors.
export function createSessionBoundFetch(supabaseUrl: string, fetcher: typeof fetch): typeof fetch {
  const base = supabaseUrl.trim().replace(/\/?$/, "/");
  const userUrl = new URL("auth/v1/user", base);
  const storageKey = `sb-${userUrl.hostname.split(".")[0]}-auth-token`;
  function sessionCookies() {
    if (typeof document === "undefined") return null;
    return parseCookieHeader(document.cookie)
      .filter(({ name }) => isChunkLike(name, storageKey))
      .sort((a, b) => a.name.localeCompare(b.name));
  }
  return async (input, init) => {
    const url = new URL(typeof input === "string" ? input : "url" in input ? input.url : input.href);
    const method = init?.method ?? (typeof input !== "string" && "method" in input ? input.method : "GET");
    if (method.toUpperCase() !== "GET" || url.origin !== userUrl.origin || url.pathname !== userUrl.pathname) {
      return fetcher(input, init);
    }
    const cookiesAtDispatch = sessionCookies();
    const startedWith = JSON.stringify(cookiesAtDispatch);
    const assertCurrent = () => {
      if (JSON.stringify(sessionCookies()) !== startedWith) throw new DOMException("Authentication session changed. Retry.", "AbortError");
    };
    const headers = new Headers(init?.headers ?? (typeof input !== "string" && "headers" in input ? input.headers : undefined));
    const bearer = headers.get("authorization")?.match(/^Bearer (.+)$/i)?.[1];
    if (cookiesAtDispatch !== null && bearer !== undefined) {
      let cookieToken: unknown = null;
      try {
        const encoded = await combineChunks(storageKey, (name) => cookiesAtDispatch.find((cookie) => cookie.name === name)?.value);
        if (encoded) {
          const stored = JSON.parse(encoded.startsWith("base64-") ? stringFromBase64URL(encoded.slice("base64-".length)) : encoded);
          cookieToken = stored?.access_token;
        }
      } catch {
        // Unreadable storage cannot establish token continuity.
      }
      // Token equality rejects stale reads; it never authenticates cookie data.
      if (typeof cookieToken !== "string" || cookieToken !== bearer) throw new DOMException("Authentication session changed. Retry.", "AbortError");
      assertCurrent();
    }
    const response = await fetcher(input, init);
    try {
      assertCurrent();
      // Include a delayed body, not just arrival of the response headers.
      const body = response.body ? await response.arrayBuffer() : null;
      assertCurrent();
      return new Response(body, { status: response.status, statusText: response.statusText, headers: response.headers });
    } catch (error) {
      if (!response.bodyUsed) await response.body?.cancel().catch(() => {});
      throw error;
    }
  };
}
