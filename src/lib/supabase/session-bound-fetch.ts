import { isChunkLike, parseCookieHeader } from "@supabase/ssr";

// Only /user reads are bound: the SDK still owns mutations, refresh and errors.
export function createSessionBoundFetch(supabaseUrl: string, fetcher: typeof fetch): typeof fetch {
  const base = supabaseUrl.trim().replace(/\/?$/, "/");
  const userUrl = new URL("auth/v1/user", base);
  const storageKey = `sb-${userUrl.hostname.split(".")[0]}-auth-token`;
  function sessionState() {
    if (typeof document === "undefined") return null;
    return JSON.stringify(parseCookieHeader(document.cookie)
      .filter(({ name }) => isChunkLike(name, storageKey))
      .sort((a, b) => a.name.localeCompare(b.name)));
  }
  return async (input, init) => {
    const url = new URL(typeof input === "string" ? input : "url" in input ? input.url : input.href);
    const method = init?.method ?? (typeof input !== "string" && "method" in input ? input.method : "GET");
    if (method.toUpperCase() !== "GET" || url.origin !== userUrl.origin || url.pathname !== userUrl.pathname) {
      return fetcher(input, init);
    }
    const startedWith = sessionState();
    const assertCurrent = () => {
      if (sessionState() !== startedWith) throw new DOMException("Authentication session changed. Retry.", "AbortError");
    };
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
