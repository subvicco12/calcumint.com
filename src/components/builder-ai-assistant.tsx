"use client";

import { useState } from "react";

export function BuilderAiAssistant() {
  const [prompt, setPrompt] = useState("");
  const [definition, setDefinition] = useState("");
  const [notes, setNotes] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function generate(event: React.FormEvent) {
    event.preventDefault(); setLoading(true); setMessage(""); setDefinition("");
    try {
      const response = await fetch("/api/ai/builder-assist", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ prompt }) });
      const payload = await response.json() as { definition?: unknown; notes?: string[]; error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Assistant unavailable");
      setDefinition(JSON.stringify(payload.definition, null, 2)); setNotes(payload.notes ?? []);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Assistant unavailable"); }
    finally { setLoading(false); }
  }

  return <div className="account-grid">
    <form className="card form-stack" onSubmit={generate}>
      <span className="eyebrow">Business AI</span><h2>Describe the calculator</h2>
      <label>Requirements<textarea rows={10} required minLength={10} maxLength={5000} value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Create a calculator that takes revenue and cost, returns profit and profit margin, and shows a bar chart."/></label>
      <button className="button primary" disabled={loading}>{loading ? "Generating & validating…" : "Generate validated draft"}</button>
      <p className="muted-copy">AI only drafts the definition. CalcuMint validates the schema and executes a deterministic test run before returning it.</p>
      {message && <div className="notice error-notice">{message}</div>}
    </form>
    <article className="card"><span className="eyebrow">Validated proposal</span><h2>Builder definition</h2>{definition ? <><pre className="code-output">{definition}</pre>{notes.length > 0 && <ul>{notes.map((note) => <li key={note}>{note}</li>)}</ul>}</> : <p>No proposal yet.</p>}</article>
  </div>;
}
