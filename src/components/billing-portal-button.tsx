"use client";

import { useState } from "react";

type Action = "overview" | "cancel" | "payment";

export function BillingPortalButton({ action = "overview", children, className = "button secondary" }: { action?: Action; children: React.ReactNode; className?: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function openPortal() {
    setBusy(true); setError(null);
    try {
      const response = await fetch("/api/billing/portal", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action }) });
      const data = await response.json() as { url?: string; error?: string };
      if (!response.ok || !data.url) throw new Error(data.error ?? "Billing portal unavailable");
      window.location.assign(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Billing portal unavailable");
      setBusy(false);
    }
  }
  return <><button type="button" className={className} disabled={busy} onClick={openPortal}>{busy ? "Opening billing…" : children}</button>{error && <p className="muted-copy" role="alert">{error}</p>}</>;
}
