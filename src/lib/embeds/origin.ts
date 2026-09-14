import { normalizeAllowedDomain } from "./schema";

export function hostFromUrl(value?: string | null): string | null {
  if (!value) return null;
  try { return new URL(value).hostname.replace(/^www\./, "").toLowerCase(); } catch { return null; }
}

export function isEmbedRequestAllowed(allowedDomains: string[], allowDirect: boolean, referer?: string | null): boolean {
  if (!referer) return allowDirect;
  const host = hostFromUrl(referer);
  if (!host) return allowDirect;
  if (allowedDomains.length === 0) return true;
  return allowedDomains.some((domain) => {
    const normalized = normalizeAllowedDomain(domain);
    return host === normalized || host.endsWith(`.${normalized}`);
  });
}
