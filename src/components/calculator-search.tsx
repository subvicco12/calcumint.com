"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { rankCalculatorSearchItems } from "@/calculators/search-ranking";

type SearchItem = { title: string; href: string; description: string; keywords: readonly string[] };

export function CalculatorSearch({ items }: { items: readonly SearchItem[] }) {
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLowerCase();
  const matches = useMemo(() => {
    if (!normalized) return [];
    return rankCalculatorSearchItems(items,normalized,12);
  }, [items, normalized]);

  return <div className="search-panel">
    <label className="search-label" htmlFor="calculator-search">Search calculators</label>
    <input id="calculator-search" className="search-input" type="search" placeholder="Try percentage, unit conversion..." value={query} onChange={(event) => setQuery(event.target.value)} />
    {normalized && <div className="search-results" aria-live="polite">
      {matches.map((item) => <Link className="search-result" href={item.href} key={item.href}><strong>{item.title}</strong><span>{item.description}</span></Link>)}
      {matches.length === 0 && <p className="muted">No certified calculator matches that search yet.</p>}
    </div>}
    {!normalized && <div className="search-footer"><Link className="text-link" href="/calculators">Browse all calculators →</Link></div>}
  </div>;
}
