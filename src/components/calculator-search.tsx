"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { rankCalculatorSearchItems } from "@/calculators/search-ranking";

type SearchItem = { title: string; href: string; description: string; keywords: readonly string[] };
const RESULT_LIMIT = 12;

export function CalculatorSearch({ items, initialQuery = "" }: { items: readonly SearchItem[]; initialQuery?: string }) {
  const id = useId();
  const [search, setSearch] = useState({ source: initialQuery, query: initialQuery });
  // A client navigation supplies a new URL query without remounting this workspace.
  // Reset during render so previous results are never committed for the new URL.
  if (search.source !== initialQuery) setSearch({ source: initialQuery, query: initialQuery });
  const query = search.source === initialQuery ? search.query : initialQuery;
  const setQuery = (value: string) => setSearch({ source: initialQuery, query: value });
  const normalized = query.trim().toLowerCase();
  const ranked = useMemo(() => {
    if (!normalized) return [];
    return rankCalculatorSearchItems(items, normalized, items.length);
  }, [items, normalized]);
  const matches = ranked.slice(0, RESULT_LIMIT);
  const status = !normalized ? "" : ranked.length === 0 ? "No calculators match that search." :
    ranked.length > RESULT_LIMIT ? `Showing ${RESULT_LIMIT} of ${ranked.length} matching calculators. Refine your search to find more.` :
      `${ranked.length} matching calculator${ranked.length === 1 ? "" : "s"}.`;

  return <div className="search-panel">
    <label className="search-label" htmlFor={id}>Search calculators</label>
    <input id={id} className="search-input" type="search" placeholder="Try percentage, unit conversion..." value={query}
      aria-describedby={`${id}-status`} aria-controls={`${id}-results`}
      onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => {
        if (event.key === "Escape") { event.preventDefault(); setQuery(""); }
      }} />
    <p id={`${id}-status`} role="status" aria-atomic="true" className={normalized ? "muted" : "sr-only"}>{status}</p>
    <div id={`${id}-results`}>
      {matches.length > 0 && <div className="search-results" role="list" aria-label="Calculator search results">
        {matches.map((item) => <div role="listitem" key={item.href}><Link className="search-result" href={item.href}><strong>{item.title}</strong><span>{item.description}</span></Link></div>)}
      </div>}
    </div>
    {!normalized && <div className="search-footer"><Link className="text-link" href="/calculators">Browse all calculators →</Link></div>}
  </div>;
}
