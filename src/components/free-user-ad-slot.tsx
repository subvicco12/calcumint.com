"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function FreeUserAdSlot() {
  const [showAds, setShowAds] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;
    const supabase = createSupabaseBrowserClient();

    void (async () => {
      if (!supabase) {
        if (active) setShowAds(true);
        return;
      }
      const { data: { user } } = await supabase.auth.getUser();
      if (!active) return;
      if (!user) {
        setShowAds(true);
        return;
      }
      const { data } = await supabase.from("profiles").select("plan").eq("id", user.id).maybeSingle();
      if (active) setShowAds((data?.plan ?? "free") === "free");
    })();

    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!showAds) return;
    const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
    const slot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_CALCULATOR;
    if (!clientId || !slot) return;

    const scriptId = "calcumint-adsense";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.async = true;
      script.crossOrigin = "anonymous";
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
      document.head.appendChild(script);
    }

    const timer = window.setTimeout(() => {
      try {
        const ads = window as typeof window & { adsbygoogle?: unknown[] };
        (ads.adsbygoogle ??= []).push({});
      } catch {
        // Ad blockers or an unapproved domain may prevent initialization.
      }
    }, 250);

    return () => window.clearTimeout(timer);
  }, [showAds]);

  if (showAds !== true) return null;

  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const slot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_CALCULATOR;
  if (!clientId || !slot) {
    return <aside className="ad-placeholder" aria-label="Advertisement placeholder">Ad space · Free plan only</aside>;
  }

  return (
    <aside className="ad-shell" aria-label="Advertisement">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
