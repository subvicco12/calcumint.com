"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { BillingInterval, PlanId } from "@/lib/billing/plans";
import { publicEnv } from "@/lib/env";

type PaidPlan = Exclude<PlanId, "free">;
type PaddleApi = {
  Environment: { set: (environment: "sandbox" | "production") => void };
  Initialize: (options: { token: string; eventCallback?: (event: { name?: string }) => void }) => void;
  Checkout: { open: (options: { transactionId: string; settings?: { displayMode?: "overlay"; theme?: "light" | "dark" } }) => void };
};
declare global { interface Window { Paddle?: PaddleApi; } }
let paddleReady: Promise<PaddleApi> | null = null;
let paddleInstance: PaddleApi | null = null;
let paddleInitialized = false;
const paddleEventListeners = new Set<(event: { name?: string }) => void>();

function loadPaddle(): Promise<PaddleApi> {
  if (paddleReady) return paddleReady;
  if (paddleInstance && paddleInitialized) return Promise.resolve(paddleInstance);
  const loading = new Promise<PaddleApi>((resolve, reject) => {
    const token = publicEnv.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
    if (!token) return reject(new Error("Paddle client token is not configured"));
    const initialize = () => {
      const paddle = window.Paddle;
      if (!paddle) return reject(new Error("Paddle checkout could not be loaded"));
      try {
        if (!paddleInitialized) {
          paddle.Environment.set(publicEnv.NEXT_PUBLIC_PADDLE_ENV);
          paddle.Initialize({ token, eventCallback: (event) => { for (const listener of paddleEventListeners) listener(event); } });
          paddleInitialized = true;
        }
        paddleInstance = paddle;
        resolve(paddle);
      } catch (error) { paddleInitialized = false; paddleInstance = null; reject(error); }
    };
    if (window.Paddle) return initialize();
    const existing = document.querySelector<HTMLScriptElement>('script[src="https://cdn.paddle.com/paddle/v2/paddle.js"]');
    if (existing) {
      existing.addEventListener("load", initialize, { once: true });
      existing.addEventListener("error", () => reject(new Error("Paddle checkout could not be loaded")), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
    script.async = true;
    script.addEventListener("load", initialize, { once: true });
    script.addEventListener("error", () => reject(new Error("Paddle checkout could not be loaded")), { once: true });
    document.head.appendChild(script);
  });
  paddleReady = loading.catch((error: unknown): never => { paddleReady = null; paddleInitialized = false; paddleInstance = null; throw error; });
  return paddleReady;
}

export function PlanCheckoutButton({ plan, interval, disabledReason }: { plan: PaidPlan; interval: BillingInterval; disabledReason?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState(false);
  const planLabel = plan === "business" ? "Business" : "Pro";

  async function requestBillingChange(confirmed = false) {
    setBusy(true); setError("");
    let handleCheckoutEvent: ((event: { name?: string }) => void) | null = null;
    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, interval, confirmChange: confirmed })
      });
      const payload = await response.json() as { transactionId?: string; updated?: boolean; confirmationRequired?: boolean; error?: string };
      if (response.status === 401) { router.push(`/login?next=${encodeURIComponent("/pricing")}`); return; }
      if (!response.ok) throw new Error(payload.error ?? "Checkout unavailable");
      if (payload.confirmationRequired) { setConfirmation(true); setBusy(false); return; }
      if (payload.updated) { router.push(`/account?billing=updated&plan=${plan}&interval=${interval}`); router.refresh(); return; }
      if (!payload.transactionId) throw new Error(payload.error ?? "Checkout unavailable");
      const paddle = await loadPaddle();
      const listener = (event: { name?: string }) => {
        if (event.name === "checkout.completed") { paddleEventListeners.delete(listener); setBusy(false); window.location.assign(`/account?billing=completed&plan=${plan}&interval=${interval}`); }
        if (event.name === "checkout.closed") { paddleEventListeners.delete(listener); setBusy(false); }
      };
      handleCheckoutEvent = listener; paddleEventListeners.add(listener);
      paddle.Checkout.open({ transactionId: payload.transactionId, settings: { displayMode: "overlay", theme: "light" } });
    } catch (caught) {
      if (handleCheckoutEvent) paddleEventListeners.delete(handleCheckoutEvent);
      setError(caught instanceof Error ? caught.message : "Checkout unavailable"); setBusy(false);
    }
  }

  return (
    <div className="checkout-action">
      <button className="button primary" type="button" disabled={busy || Boolean(disabledReason)} onClick={() => requestBillingChange(false)}>
        {busy ? "Opening checkout…" : `Choose ${planLabel} ${interval}`}
      </button>
      {confirmation && (
        <div className="billing-change-confirmation" role="dialog" aria-label="Confirm plan change">
          <p><strong>Confirm change to {planLabel} {interval}</strong></p>
          <p className="muted-copy">Your existing Paddle payment method will be used. Any immediate prorated charge is calculated by Paddle. By confirming, you authorize CalcuMint to update your subscription and charge the saved payment method where applicable.</p>
          <div className="checkout-action">
            <button className="button primary" type="button" disabled={busy} onClick={() => requestBillingChange(true)}>{busy ? "Updating…" : "Confirm and update plan"}</button>
            <button className="button secondary" type="button" disabled={busy} onClick={() => setConfirmation(false)}>Cancel</button>
          </div>
        </div>
      )}
      {disabledReason && <small className="muted-copy">{disabledReason}</small>}
      {error && <small className="error-text">{error}</small>}
    </div>
  );
}

export function ProCheckoutButton({ interval }: { interval: BillingInterval }) { return <PlanCheckoutButton plan="pro" interval={interval} />; }
