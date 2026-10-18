"use client";

import { useId, useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { BillingInterval, PlanId } from "@/lib/billing/plans";
import { publicEnv } from "@/lib/env";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { requiresSignIn } from "@/lib/auth-recovery";

type PaidPlan = Exclude<PlanId, "free">;
type ProrationPreview = { immediateTotal: string | null; currencyCode: string | null; charge: string | null; credit: string | null; result: string | null };
type PaddleEvent = { name?: string; data?: { transaction_id?: unknown } };
type PaddleApi = {
  Environment: { set: (environment: "sandbox" | "production") => void };
  Initialize: (options: { token: string; eventCallback?: (event: PaddleEvent) => void }) => void;
  Checkout: { open: (options: { transactionId: string; settings?: { displayMode?: "overlay"; theme?: "light" | "dark" } }) => void };
};
declare global { interface Window { Paddle?: PaddleApi; } }
let paddleReady: Promise<PaddleApi> | null = null;
let paddleInstance: PaddleApi | null = null;
let paddleInitialized = false;
const paddleEventListeners = new Set<(event: PaddleEvent) => void>();

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
          paddle.Initialize({ token, eventCallback: (event) => { if (!event || typeof event !== "object") return; for (const listener of paddleEventListeners) listener(event); } });
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

function formatMinorAmount(amount: string | null, currencyCode: string | null) {
  if (!amount || !currencyCode || !/^-?\d+$/.test(amount)) return null;
  try { return new Intl.NumberFormat(undefined, { style: "currency", currency: currencyCode }).format(Number(amount) / 100); }
  catch { return `${currencyCode} ${(Number(amount) / 100).toFixed(2)}`; }
}

type CheckoutButtonProps = { plan: PaidPlan; interval: BillingInterval; disabledReason?: string };
export function PlanCheckoutButton(props: CheckoutButtonProps) {
  return <CheckoutSessionButton key={`${props.plan}:${props.interval}:${props.disabledReason ?? ""}`} {...props}/>;
}

function CheckoutSessionButton({ plan, interval, disabledReason }: CheckoutButtonProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [needsReconciliation, setNeedsReconciliation] = useState(false);
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState(false);
  const [preview, setPreview] = useState<ProrationPreview | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const confirmationRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const descriptionId = useId();
  const lifetime = useRef<object | null>(null), requestIdentity = useRef<object | null>(null);
  const owner = useRef<string | null>(null), previewOwner = useRef<string | null>(null), locked = useRef(false);
  const checkoutEvent = useRef<((event: PaddleEvent) => void) | null>(null);
  const planLabel = plan === "business" ? "Business" : "Pro";

  function invalidate() {
    requestIdentity.current = null; owner.current = null; previewOwner.current = null; locked.current = false;
    if (checkoutEvent.current) paddleEventListeners.delete(checkoutEvent.current);
    checkoutEvent.current = null;
    setConfirmation(false); setPreview(null); setBusy(false); setNeedsReconciliation(false);
  }

  useLayoutEffect(() => {
    lifetime.current = {};
    const subscription = createSupabaseBrowserClient()?.auth.onAuthStateChange((_event, session) => {
      if (owner.current && session?.user.id !== owner.current) {
        invalidate(); setError("Your account session changed. Choose your plan again.");
      }
    }).data.subscription;
    return () => {
      lifetime.current = null; requestIdentity.current = null; locked.current = false;
      if (checkoutEvent.current) paddleEventListeners.delete(checkoutEvent.current);
      checkoutEvent.current = null; subscription?.unsubscribe();
    };
  }, []);

  useLayoutEffect(() => {
    if (confirmation && (document.activeElement === document.body || document.activeElement === triggerRef.current)) {
      cancelRef.current?.focus({ preventScroll: true });
    }
  }, [confirmation]);

  function dismissConfirmation() {
    if (busy) return;
    const restore = confirmationRef.current?.contains(document.activeElement);
    setConfirmation(false); setPreview(null);
    if (restore) triggerRef.current?.focus({ preventScroll: true });
  }

  async function requestBillingChange(confirmed = false) {
    if (locked.current || needsReconciliation || disabledReason || (confirmed && !previewOwner.current)) return;
    locked.current = true;
    const scope = lifetime.current, request = requestIdentity.current = {};
    const current = () => scope !== null && lifetime.current === scope && requestIdentity.current === request;
    const client = createSupabaseBrowserClient();
    let overlayOpen = false, transactionAvailable = false;
    const accountChanged = () => { if (current()) { invalidate(); setError("Your account session changed. Choose your plan again."); } };
    async function verifyOwner(expected?: string | null) {
      if (!current()) return null;
      const auth = await client?.auth.getUser();
      if (!current()) return null;
      if (auth?.error && requiresSignIn(auth.error)) { accountChanged(); router.push(`/login?next=${encodeURIComponent("/pricing")}`); return null; }
      if (!auth || auth.error) {
        setConfirmation(false); setPreview(null); previewOwner.current = null;
        throw new Error("We could not verify your account. Choose your plan again after recovery.");
      }
      if (!auth.data.user) { accountChanged(); router.push(`/login?next=${encodeURIComponent("/pricing")}`); return null; }
      if (expected && auth.data.user.id !== expected) { accountChanged(); return null; }
      return auth.data.user.id;
    }
    setBusy(true); setError("");
    let handleCheckoutEvent: ((event: PaddleEvent) => void) | null = null;
    try {
      const verifiedOwner = await verifyOwner(confirmed ? previewOwner.current : null);
      if (!verifiedOwner) return;
      owner.current = verifiedOwner;
      const response = await fetch("/api/billing/checkout", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, interval, confirmChange: confirmed, expectedOwnerId: verifiedOwner })
      });
      const payload = await response.json() as { transactionId?: string; updated?: boolean; confirmationRequired?: boolean; prorationPreview?: ProrationPreview; error?: string };
      if (!await verifyOwner(verifiedOwner)) return;
      if (response.status === 401) { router.push(`/login?next=${encodeURIComponent("/pricing")}`); return; }
      if (!response.ok) throw new Error(payload.error ?? "Checkout unavailable");
      if (payload.confirmationRequired) { previewOwner.current = verifiedOwner; setPreview(payload.prorationPreview ?? null); setConfirmation(true); setBusy(false); return; }
      if (payload.updated) { router.push(`/account?billing=updated&plan=${plan}&interval=${interval}`); router.refresh(); return; }
      if (typeof payload.transactionId !== "string" || !payload.transactionId.trim()) throw new Error(payload.error ?? "Checkout unavailable");
      transactionAvailable = true;
      const paddle = await loadPaddle();
      if (!await verifyOwner(verifiedOwner)) return;
      const listener = (event: PaddleEvent) => {
        if (!current() || event.data?.transaction_id !== payload.transactionId || (event.name !== "checkout.completed" && event.name !== "checkout.closed")) return;
        paddleEventListeners.delete(listener); checkoutEvent.current = null;
        void verifyOwner(verifiedOwner).then(async id => {
          if (!id) return;
          if (event.name === "checkout.completed") {
            // Browser events are hints. Only authenticated server/provider evidence can confirm this transaction.
            const query = new URLSearchParams({transactionId:payload.transactionId!,expectedOwnerId:verifiedOwner,plan,interval});
            const response = await fetch(`/api/billing/checkout/status?${query}`, {cache:"no-store"});
            const evidence = await response.json() as {verified?:unknown};
            if (!await verifyOwner(verifiedOwner)) return;
            if (!response.ok || evidence.verified !== true) throw new Error("Unverified checkout");
          }
          locked.current = false; setBusy(false);
          if (event.name === "checkout.completed") window.location.assign(`/account?billing=completed&plan=${plan}&interval=${interval}`);
        }).catch(() => { if (current()) { locked.current = false; setBusy(false); setNeedsReconciliation(true); setError("We could not verify checkout completion. Check your account before retrying."); } });
      };
      handleCheckoutEvent = listener; checkoutEvent.current = listener; paddleEventListeners.add(listener);
      overlayOpen = true;
      paddle.Checkout.open({ transactionId: payload.transactionId, settings: { displayMode: "overlay", theme: "light" } });
    } catch (caught) {
      if (handleCheckoutEvent) paddleEventListeners.delete(handleCheckoutEvent);
      overlayOpen = false;
      if (!current()) return;
      if (owner.current) { try { if (!await verifyOwner(owner.current)) return; } catch { if (!current()) return; } }
      if (current()) {
        if (transactionAvailable) {
          setNeedsReconciliation(true); setConfirmation(false); setPreview(null); previewOwner.current = null;
          setError("Checkout was interrupted. Check your account before retrying.");
        } else setError(caught instanceof Error ? caught.message : "Checkout unavailable");
        setBusy(false);
      }
    } finally {
      if (current() && !overlayOpen) { locked.current = false; setBusy(false); }
    }
  }

  const dueNow = formatMinorAmount(preview?.immediateTotal ?? null, preview?.currencyCode ?? null);
  const credit = formatMinorAmount(preview?.credit ?? null, preview?.currencyCode ?? null);

  return (
    <div className="checkout-action">
      <button ref={triggerRef} className="button primary" type="button" disabled={busy || needsReconciliation || Boolean(disabledReason)} onClick={() => requestBillingChange(false)}>
        {busy ? "Checking price…" : `Choose ${planLabel} ${interval}`}
      </button>
      {confirmation && (
        <div ref={confirmationRef} className="billing-change-confirmation" role="dialog" aria-label="Confirm plan change" aria-describedby={descriptionId} aria-busy={busy} onKeyDown={event => { if (event.key === "Escape" && !busy) { event.preventDefault(); event.stopPropagation(); dismissConfirmation(); } }}>
          <p><strong>Confirm change to {planLabel} {interval}</strong></p>
          {dueNow ? <p><strong>Due now: {dueNow}</strong></p> : <p className="muted-copy">Paddle reports no immediate payment total for this change.</p>}
          {credit && preview?.credit !== "0" ? <p className="muted-copy">Proration credit included: {credit}.</p> : null}
          <p id={descriptionId} className="muted-copy">This amount is calculated by Paddle from your current subscription and the remaining billing period. Your saved Paddle payment method will be used. By confirming, you authorize this subscription update and any displayed immediate charge.</p>
          <div className="checkout-action">
            <button className="button primary" type="button" disabled={busy} onClick={() => requestBillingChange(true)}>{busy ? "Updating…" : "Confirm and update plan"}</button>
            <button ref={cancelRef} className="button secondary" type="button" disabled={busy} onClick={dismissConfirmation}>Cancel</button>
          </div>
        </div>
      )}
      {disabledReason && <small className="muted-copy">{disabledReason}</small>}
      {error && <small className="error-text" role="alert">{error}</small>}
      {(busy || needsReconciliation) && <a href="/account">Check account</a>}
    </div>
  );
}

export function ProCheckoutButton({ interval }: { interval: BillingInterval }) { return <PlanCheckoutButton plan="pro" interval={interval} />; }
