"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { BillingInterval, PlanId } from "@/lib/billing/plans";

type PaidPlan = Exclude<PlanId, "free">;

export function PlanCheckoutButton({ plan, interval }: { plan: PaidPlan; interval: BillingInterval }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function startCheckout() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, interval })
      });
      const payload = await response.json() as { checkoutUrl?: string; error?: string };
      if (response.status === 401) {
        router.push(`/login?next=${encodeURIComponent("/pricing")}`);
        return;
      }
      if (!response.ok || !payload.checkoutUrl) throw new Error(payload.error ?? "Checkout unavailable");
      window.location.assign(payload.checkoutUrl);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Checkout unavailable");
      setBusy(false);
    }
  }

  const planLabel = plan === "business" ? "Business" : "Pro";
  return (
    <div className="checkout-action">
      <button className="button primary" type="button" disabled={busy} onClick={startCheckout}>
        {busy ? "Opening checkout…" : `Choose ${planLabel} ${interval}`}
      </button>
      {error && <small className="error-text">{error}</small>}
    </div>
  );
}

export function ProCheckoutButton({ interval }: { interval: BillingInterval }) {
  return <PlanCheckoutButton plan="pro" interval={interval} />;
}
