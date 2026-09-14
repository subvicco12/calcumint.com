"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { runCustomCalculator, type CustomCalculatorDefinition } from "@/lib/builder/definition";

type Props = {
  publicKey: string;
  definition: CustomCalculatorDefinition;
  companyName?: string | null;
  logoUrl?: string | null;
  accentColor: string;
  hideCalcumintBrand: boolean;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
  leadCaptureEnabled: boolean;
  leadFields: string[];
  consentText?: string | null;
  privacyUrl?: string | null;
};

export function PublicEmbedCalculator(props: Props) {
  const initial = Object.fromEntries(props.definition.fields.map((field) => [field.key, String(field.defaultValue ?? field.min ?? 0)]));
  const [values, setValues] = useState<Record<string, string>>(initial);
  const [leadStatus, setLeadStatus] = useState("");
  const evaluated = useMemo(() => {
    try { return { result: runCustomCalculator(props.definition, values).output, error: "" }; }
    catch (error) { return { result: null, error: error instanceof Error ? error.message : "Calculation failed" }; }
  }, [props.definition, values]);

  useEffect(() => {
    void fetch(`/api/embed/${props.publicKey}/events`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "view", sourceUrl: window.location.href, referrer: document.referrer || undefined }) });
  }, [props.publicKey]);

  async function submitLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!evaluated.result) return;
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(["name", "email", "phone", "company"].map((key) => [key, String(form.get(key) ?? "").trim()]));
    const response = await fetch(`/api/embed/${props.publicKey}/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, consented: form.get("consent") === "on", input: values, output: evaluated.result, sourceUrl: window.location.href })
    });
    setLeadStatus(response.ok ? "Thanks — your details were submitted." : "Could not submit your details.");
  }

  function recordCalculation() {
    void fetch(`/api/embed/${props.publicKey}/events`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "calculate", sourceUrl: window.location.href }) });
  }

  return (
    <div className="public-embed" style={{ "--embed-accent": props.accentColor } as React.CSSProperties}>
      {(props.companyName || props.logoUrl) && <header className="embed-brand">{props.logoUrl && <img src={props.logoUrl} alt="" />}<strong>{props.companyName}</strong></header>}
      <div className="field-grid">
        {props.definition.fields.map((field) => <label className="field" key={field.key}><span>{field.label}</span><input type="number" inputMode="decimal" min={field.min ?? undefined} max={field.max ?? undefined} step={field.step ?? "any"} value={values[field.key] ?? ""} onChange={(event) => { setValues((current) => ({ ...current, [field.key]: event.target.value })); recordCalculation(); }} />{field.helpText && <small>{field.helpText}</small>}</label>)}
      </div>
      {evaluated.error ? <div className="notice error-notice">{evaluated.error}</div> : <div className="builder-results">{props.definition.outputs.map((output) => <div className="result-box" key={output.key}><span>{output.label}</span><strong>{formatValue(evaluated.result?.[output.key], output.format, output.decimals)}</strong></div>)}</div>}
      {props.ctaLabel && props.ctaUrl && <a className="button primary embed-cta" href={props.ctaUrl} target="_blank" rel="noreferrer" onClick={() => void fetch(`/api/embed/${props.publicKey}/events`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "cta_click", sourceUrl: window.location.href }) })}>{props.ctaLabel}</a>}
      {props.leadCaptureEnabled && <form className="embed-lead-form" onSubmit={submitLead}><h3>Send me this result</h3>{props.leadFields.includes("name") && <label>Name<input name="name" required /></label>}{props.leadFields.includes("email") && <label>Email<input name="email" type="email" required /></label>}{props.leadFields.includes("phone") && <label>Phone<input name="phone" /></label>}{props.leadFields.includes("company") && <label>Company<input name="company" /></label>}<label className="consent-row"><input name="consent" type="checkbox" required /><span>{props.consentText}{props.privacyUrl && <> <a href={props.privacyUrl} target="_blank" rel="noreferrer">Privacy policy</a></>}</span></label><button className="button primary" type="submit">Submit</button>{leadStatus && <p aria-live="polite">{leadStatus}</p>}</form>}
      {!props.hideCalcumintBrand && <footer className="embed-powered">Powered by CalcuMint</footer>}
    </div>
  );
}

function formatValue(value: number | boolean | undefined, format: "number" | "currency" | "percentage", decimals: number) {
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value !== "number" || !Number.isFinite(value)) return "—";
  if (format === "percentage") return `${value.toFixed(decimals)}%`;
  if (format === "currency") return value.toLocaleString(undefined, { style: "currency", currency: "USD", minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return value.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}
