"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { BillingInterval, PlanId } from "@/lib/billing/plans";
import { publicEnv } from "@/lib/env";

type PaidPlan = Exclude<PlanId, "free">;

type PaddleApi = {
  Environment: { set: (environment: "sandbox") => void };
  Initialize: (options: { token: string }) => void;
  Checkout: { open: (options: { transactionId: string; settings?: { displayMode?: "overlay"; theme?: "light" | "dark" } }) => void };
};

declare global {
  interface Window {
    Paddle?: PaddleApi;
  }
}

let paddleReady: Promise<PaddleApi> | null = null;

function loadPaddle(): Promise<PaddleApi> {
  if (paddleReady) return paddleReady;

  const loading = new Promise<PaddleApi>((resolve, reject) => {
    const token = publicEnv.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
    if (!token) {
      reject(new Error("Paddle client token is not configured"));
      return;
    }

    const initialize = () => {
      const paddle = window.Paddle;
      if (!paddle) {
        reject(new Error("Paddle checkout could not be loaded"));
        return;
      }
      try {
        if (publicEnv.NEXT_PUBLIC_PADDLE_ENV === "sandbox") paddle.Environment.set("sandbox");
        paddle.Initialize({ token });
        resolve(paddle);
      } catch (error) {
        reject(error);
      }
    };

    if (window.Paddle) {
      initialize();
      return;
    }

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

  const ready = loading.catch((error: unknown): never => {
    paddleReady = null;
    throw error;
  });
  paddleReady = ready;
  return ready;
}

export function PlanCheckoutButton({ plan, interval, disabledReason }: { plan: PaidPlan; interval: BillingInterval; disabledReason?: string }) {
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
      const payload = await response.json() as { transactionId?: string; updated?: boolean; error?: string };
      if (response.status === 401) {
        router.push(`/login?next=${encodeURIComponent("/pricing")}`);
        return;
      }
      if (!response.ok) throw new Error(payload.error ?? "Checkout unavailable");
      if (payload.updated) {
        router.push(`/account?billing=updated&plan=${plan}&interval=${interval}`);
        router.refresh();
        return;
      }
      if (!payload.transactionId) throw new Error(payload.error ?? "Checkout unavailable");

      const paddle = await loadPaddle();
      paddle.Checkout.open({
        transactionId: payload.transactionId,
        settings: { displayMode: "overlay", theme: "light" }
      });
      setBusy(false);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Checkout unavailable");
      setBusy(false);
    }
  }

  const planLabel = plan === "business" ? "Business" : "Pro";
  return (
    <div className="checkout-action">
      <button className="button primary" type="button" disabled={busy || Boolean(disabledReason)} onClick={startCheckout}>
        {busy ? "Opening checkout…" : `Choose ${planLabel} ${interval}`}
      </button>
      {disabledReason && <small className="muted-copy">{disabledReason}</small>}
      {error && <small className="error-text">{error}</small>}
    </div>
  );
}

export function ProCheckoutButton({ interval }: { interval: BillingInterval }) {
  return <PlanCheckoutButton plan="pro" interval={interval} />;
}
