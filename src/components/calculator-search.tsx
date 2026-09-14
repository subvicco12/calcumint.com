"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type SearchItem = {
  title: string;
  href: string;
  description: string;
  keywords: readonly string[];
};

export function CalculatorSearch({ items }: { items: readonly SearchItem[] }) {
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLowerCase();
  const matches = useMemo(() => {
    if (!normalized) return items;
    return items.filter((item) =>
      [item.title, item.description, ...item.keywords].some((value) => value.toLowerCase().includes(normalized))
    );
  }, [items, normalized]);

  return (
    <div className="search-panel">
      <label className="search-label" htmlFor="calculator-search">Search calculators</label>
      <input
        id="calculator-search"
        className="search-input"
        type="search"
        placeholder="Try percentage, unit conversion..."
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <div className="search-results" aria-live="polite">
        {matches.map((item) => (
          <Link className="search-result" href={item.href} key={item.href}>
            <strong>{item.title}</strong>
            <span>{item.description}</span>
          </Link>
        ))}
        {matches.length === 0 && <p className="muted">No certified calculator matches that search yet.</p>}
      </div>
    </div>
  );
}
