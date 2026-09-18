"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type SearchItem = { title: string; href: string; description: string; keywords: readonly string[] };
function queryTokens(value:string){return value.toLowerCase().split(/[^a-z0-9]+/).filter(token=>token.length>1)}

export function CalculatorSearch({ items }: { items: readonly SearchItem[] }) {
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLowerCase();
  const matches = useMemo(() => {
    if (!normalized) return [];
    const tokens=queryTokens(normalized);
    return items.map(item=>{const title=item.title.toLowerCase(),description=item.description.toLowerCase(),keywords=item.keywords.join(" ").toLowerCase();let score=0;for(const token of tokens){if(title.includes(token))score+=5;if(keywords.includes(token))score+=3;if(description.includes(token))score+=1}return{item,score}}).filter(match=>match.score>0).sort((a,b)=>b.score-a.score||a.item.title.localeCompare(b.item.title)).slice(0,12).map(match=>match.item);
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
