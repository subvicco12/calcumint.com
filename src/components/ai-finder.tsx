"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

type Recommendation = { slug: string; category: string; description: string; url: string; reason?: string };
type FinderPayload = { recommendations: Recommendation[]; warning?: string; usedAi?: boolean };
const INVALID_RESPONSE = "Calculator finder returned an invalid response. Please try again.";
const UNAVAILABLE = "Calculator finder is temporarily unavailable. Please try again.";
const segment = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
function record(value: unknown): value is Record<string, unknown> { return typeof value === 'object' && value !== null && !Array.isArray(value); }
function optionalText(value: unknown): boolean { return value === undefined || typeof value === 'string'; }

async function readFinderPayload(response: Response): Promise<FinderPayload> {
  const text = await response.text();
  if (!text.trim()) throw new Error(UNAVAILABLE);
  let value: unknown;
  try { value = JSON.parse(text); } catch { throw new Error(INVALID_RESPONSE); }
  if (!record(value)) throw new Error(INVALID_RESPONSE);
  if (!response.ok) throw new Error(typeof value.error === 'string' && value.error.trim() ? value.error : UNAVAILABLE);
  if (!Array.isArray(value.recommendations) || value.recommendations.length > 5 ||
      !optionalText(value.warning) || (value.usedAi !== undefined && typeof value.usedAi !== 'boolean')) throw new Error(INVALID_RESPONSE);
  const slugs = new Set<string>();
  for (const item of value.recommendations) {
    // This is the canonical search-index route shape. Publication membership is
    // still checked by the server against its authoritative public catalog.
    if (!record(item) || typeof item.slug !== 'string' || !segment.test(item.slug) ||
        typeof item.category !== 'string' || !segment.test(item.category) ||
        item.url !== `/calculators/${item.category}/${item.slug}` ||
        typeof item.description !== 'string' || !item.description.trim() ||
        !optionalText(item.reason) || slugs.has(item.slug)) throw new Error(INVALID_RESPONSE);
    slugs.add(item.slug);
  }
  return value as FinderPayload;
}

export function AiFinder() {
  const id = useId();
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<Recommendation[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const request = useRef<AbortController | null>(null);
  useEffect(() => () => { request.current?.abort(); request.current = null; }, []);

  function changeQuery(value: string) {
    request.current?.abort(); request.current = null;
    setQuery(value); setItems([]); setMessage(''); setError(false); setLoading(false);
  }
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (request.current) return;
    const submittedQuery = query.trim();
    setItems([]); setError(false);
    if (submittedQuery.length < 2 || submittedQuery.length > 500) { setError(true); setMessage('Enter 2–500 characters to find a calculator.'); return; }
    const controller = new AbortController(); request.current = controller;
    setLoading(true); setMessage(`Finding calculators for “${submittedQuery}”…`);
    try {
      const response = await fetch("/api/ai/find", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ query: submittedQuery }), signal: controller.signal });
      const payload = await readFinderPayload(response);
      if (request.current !== controller) return;
      setItems(payload.recommendations);
      const summary = payload.recommendations.length ? `${payload.recommendations.length} calculator${payload.recommendations.length === 1 ? '' : 's'} found for “${submittedQuery}”.` : `No calculators matched “${submittedQuery}”. Try different words or browse all calculators.`;
      setMessage(`${summary} ${payload.warning ?? (payload.usedAi ? "AI-assisted ranking from CalcuMint's verified calculator catalog." : "Matched from CalcuMint's verified calculator catalog.")}`);
    } catch (caught) {
      if (request.current !== controller) return;
      setError(true); setMessage(caught instanceof Error ? caught.message : UNAVAILABLE);
      setItems([]);
    } finally {
      if (request.current === controller) { request.current = null; setLoading(false); }
    }
  }

  return (
    <div className="card ai-finder-card">
      <form className="form-stack" onSubmit={submit}>
        <label htmlFor={id}>What do you want to calculate?</label>
        <textarea id={id} rows={3} value={query} onChange={(event) => changeQuery(event.target.value)} placeholder="For example: I need to convert miles to kilometres" required minLength={2} maxLength={500} aria-describedby={`${id}-status`} aria-controls={`${id}-results`}/>
        <button className="button primary" disabled={loading} aria-busy={loading}>{loading ? "Finding…" : "Find the right calculator"}</button>
      </form>
      <p id={`${id}-status`} role={error ? 'alert' : 'status'} aria-atomic="true" className="muted-copy">{message}</p>
      <div id={`${id}-results`} aria-busy={loading}>
        {items.length > 0 && <div className="ai-results">{items.map((item) => <article className="result-box" key={item.slug}><span>{item.category}</span><strong>{item.description}</strong>{item.reason && <p>{item.reason}</p>}<Link className="text-link" href={item.url}>Open calculator →</Link></article>)}</div>}
      </div>
    </div>
  );
}
