"use client";

import { useState } from "react";

type Props = {
  calculatorName: string;
  formula?: string;
  assumptions?: readonly string[];
  values: Record<string, unknown>;
  result: Record<string, unknown>;
};

export function AiResultExplanation(props: Props) {
  const [summary, setSummary] = useState("");
  const [points, setPoints] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [scenarioQuestion, setScenarioQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  async function requestExplanation(withScenario: boolean) {
    setLoading(true); setMessage("");
    try {
      const response = await fetch("/api/ai/explain", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...props, scenarioQuestion: withScenario ? scenarioQuestion : undefined })
      });
      const payload = await response.json() as { summary?: string; keyPoints?: string[]; caveat?: string; error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Explanation unavailable");
      setSummary(payload.summary ?? ""); setPoints(payload.keyPoints ?? []); setMessage(payload.caveat ?? "");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Explanation unavailable"); }
    finally { setLoading(false); }
  }

  return <div className="ai-explainer">
    <div className="button-row"><button className="button secondary" type="button" onClick={() => requestExplanation(false)} disabled={loading}>{loading ? "Working…" : "Explain this result with AI"}</button></div>
    <label className="field"><span>Ask a scenario question</span><input value={scenarioQuestion} maxLength={800} onChange={(event) => setScenarioQuestion(event.target.value)} placeholder="What should I change if I want a higher result?" /></label>
    <button className="button secondary" type="button" onClick={() => requestExplanation(true)} disabled={loading || scenarioQuestion.trim().length === 0}>Explain the scenario</button>
    <p className="muted-copy">Scenario AI may explain which inputs to vary, but it does not calculate replacement numeric results.</p>
    {summary && <div className="notice"><strong>AI explanation</strong><p>{summary}</p>{points.length > 0 && <ul>{points.map((point) => <li key={point}>{point}</li>)}</ul>}</div>}
    {message && <p className="muted-copy">{message}</p>}
  </div>;
}
