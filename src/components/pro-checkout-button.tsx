"use client";

import { useState } from "react";
import type { BillingInterval } from "@/lib/billing/plans";

export function ProCheckoutButton({ interval }: { interval: BillingInterval }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function startCheckout() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interval })
      });
      const payload = await response.json() as { checkoutUrl?: string; error?: string };
      if (response.status === 401) {
        window.location.href = `/login?next=${encodeURIComponent("/pricing")}`;
        return;
      }
      if (!response.ok || !payload.checkoutUrl) throw new Error(payload.error ?? "Checkout unavailable");
      window.location.href = payload.checkoutUrl;
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Checkout unavailable");
      setBusy(false);
    }
  }

  return (
    <div className="checkout-action">
      <button className="button primary" type="button" disabled={busy} onClick={startCheckout}>
        {busy ? "Opening checkout…" : interval === "yearly" ? "Choose Pro yearly" : "Choose Pro monthly"}
      </button>
      {error && <small className="error-text">{error}</small>}
    </div>
  );
}
