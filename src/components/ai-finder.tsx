"use client";

import Link from "next/link";
import { useState } from "react";

type Recommendation = { slug: string; category: string; description: string; url: string; reason?: string };
type FinderPayload = { recommendations?: Recommendation[]; error?: string; warning?: string; usedAi?: boolean };

async function readFinderPayload(response: Response): Promise<FinderPayload> {
  const text = await response.text();
  if (!text.trim()) throw new Error("Calculator finder is temporarily unavailable. Please try again.");
  try {
    return JSON.parse(text) as FinderPayload;
  } catch {
    throw new Error("Calculator finder returned an invalid response. Please try again.");
  }
}

export function AiFinder() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<Recommendation[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/ai/find", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ query }) });
      const payload = await readFinderPayload(response);
      if (!response.ok) throw new Error(payload.error ?? "Search failed");
      setItems(payload.recommendations ?? []);
      setMessage(payload.warning ?? (payload.usedAi ? "AI-assisted ranking from CalcuMint's verified calculator catalog." : "Matched from CalcuMint's verified calculator catalog."));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Search failed");
      setItems([]);
    } finally { setLoading(false); }
  }

  return (
    <div className="card ai-finder-card">
      <form className="form-stack" onSubmit={submit}>
        <label>What do you want to calculate?<textarea rows={3} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="For example: I need to convert miles to kilometres" required minLength={2} maxLength={500}/></label>
        <button className="button primary" disabled={loading}>{loading ? "Finding…" : "Find the right calculator"}</button>
      </form>
      {message && <p className="muted-copy">{message}</p>}
      {items.length > 0 && <div className="ai-results">{items.map((item) => <article className="result-box" key={item.slug}><span>{item.category}</span><strong>{item.description}</strong><p>{item.reason}</p><Link className="text-link" href={item.url}>Open calculator →</Link></article>)}</div>}
    </div>
  );
}
