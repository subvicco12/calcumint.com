import { normalizeAllowedDomain } from "./schema";

export function hostFromUrl(value?: string | null): string | null {
  if (!value) return null;
  try { return new URL(value).hostname.replace(/^www\./, "").toLowerCase(); } catch { return null; }
}

function isOriginlessRequestAllowed(allowedDomains: string[], allowDirect: boolean, destination?: string | null): boolean {
  if (allowedDomains.length === 0) return destination === "iframe" || allowDirect;
  return allowDirect && destination === "document";
}

export function isEmbedRequestAllowed(
  allowedDomains: string[],
  allowDirect: boolean,
  referer?: string | null,
  destination?: string | null
): boolean {
  if (!referer) return isOriginlessRequestAllowed(allowedDomains, allowDirect, destination);
  const host = hostFromUrl(referer);
  if (!host) return isOriginlessRequestAllowed(allowedDomains, allowDirect, destination);
  if (allowedDomains.length === 0) return true;
  return allowedDomains.some((domain) => {
    const normalized = normalizeAllowedDomain(domain);
    return host === normalized || host.endsWith(`.${normalized}`);
  });
}
