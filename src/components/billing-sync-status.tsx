"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function BillingSyncStatus() {
  const router = useRouter();
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (attempts >= 15) return;
    const timer = window.setTimeout(() => {
      setAttempts((current) => current + 1);
      router.refresh();
    }, 2000);
    return () => window.clearTimeout(timer);
  }, [attempts, router]);

  const timedOut = attempts >= 15;

  return (
    <div className="card" role="status" aria-live="polite">
      <span className="eyebrow">Billing update pending</span>
      <h2>{timedOut ? "Paddle is still synchronizing your plan." : "Updating your account…"}</h2>
      <p>
        {timedOut
          ? "The payment change was accepted, but the confirmation webhook is taking longer than expected. Do not submit the change again."
          : "Your subscription change was accepted. This page will refresh automatically when Paddle confirms it."}
      </p>
      {timedOut && (
        <button className="button secondary" type="button" onClick={() => { setAttempts(0); router.refresh(); }}>
          Check again
        </button>
      )}
    </div>
  );
}
