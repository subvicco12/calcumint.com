"use client";

import { FormEvent, useEffect, useMemo, useState, useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import { runCustomCalculator, type CustomCalculatorDefinition } from "@/lib/builder/definition";

type Props = {
  publicKey: string;
  sessionToken: string;
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
  // Never carry contacts, retries or acknowledgements into another calculator or
  // displayed-consent scope. Ordinary edits and token renewal retain their scope.
  const scope=JSON.stringify([props.publicKey,capabilityScope(props.sessionToken),props.definition,props.consentText??null,props.privacyUrl??null]);
  return <EmbedCalculatorScope key={scope} {...props}/>;
}

const subscribeReadiness = () => () => {};

function EmbedCalculatorScope(props: Props) {
  // SSR remains readable; editable controls activate only with their client handlers.
  const interactive = useSyncExternalStore(subscribeReadiness, () => true, () => false);
  const initial = Object.fromEntries(props.definition.fields.map((field) => [field.key, String(field.defaultValue ?? field.min ?? 0)]));
  const [values, setValues] = useState<Record<string, string>>(initial);
  const [leadStatus, setLeadStatus] = useState("");
  const [sessionMessage,setSessionMessage]=useState("Embed session expired. Reload this calculator to continue submitting events or leads.");
  const sessionRef = useRef(props.sessionToken);
  const leadAttempt=useRef<{id:string;body:string;key:string;confirmed:boolean}|null>(null);
  const leadPending=useRef(false);
  const [submittingLead,setSubmittingLead]=useState(false);
  const [uncertainLead,setUncertainLead]=useState(false);
  const renewalRef = useRef<Promise<boolean> | null>(null);
  const [sessionAvailable, setSessionAvailable] = useState(true);

  useEffect(() => { sessionRef.current=props.sessionToken; }, [props.sessionToken]);

  useEffect(() => {
    const renew = async (): Promise<boolean> => {
      try {
        const response = await fetch(`/api/embed/${props.publicKey}/session`, { method: "POST", headers: { "X-Embed-Session": sessionRef.current } });
        if (!response.ok) { setSessionAvailable(false); return false; }
        const payload: unknown = await response.json();
        if (!payload || typeof payload !== "object" || !("sessionToken" in payload) || typeof payload.sessionToken !== "string") { setSessionAvailable(false); return false; }
        sessionRef.current = payload.sessionToken;
        setSessionAvailable(true);
        return true;
      } catch { setSessionAvailable(false); return false; }
    };
    const renewOnce = () => {
      if (!renewalRef.current) {
        const pending = renew();
        renewalRef.current = pending;
        void pending.finally(() => { if (renewalRef.current === pending) renewalRef.current = null; });
      }
      return renewalRef.current;
    };
    const onResume = () => { if (document.visibilityState === "visible") void renewOnce(); };
    const interval = window.setInterval(() => { void renewOnce(); }, 3 * 60_000);
    document.addEventListener("visibilitychange", onResume);
    window.addEventListener("focus", onResume);
    return () => { window.clearInterval(interval); document.removeEventListener("visibilitychange", onResume); window.removeEventListener("focus", onResume); };
  }, [props.publicKey]);
  const evaluated = useMemo(() => {
    try { return { result: runCustomCalculator(props.definition, values).output, error: "" }; }
    catch (error) { return { result: null, error: error instanceof Error ? error.message : "Calculation failed" }; }
  }, [props.definition, values]);

  useEffect(() => {
    void fetch(`/api/embed/${props.publicKey}/events`, { method: "POST", headers: { "Content-Type": "application/json", "X-Embed-Session": sessionRef.current }, body: JSON.stringify({ type: "view", sourceUrl: window.location.href, referrer: document.referrer || undefined }) });
  }, [props.publicKey]);

  async function submitLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!evaluated.result || !sessionAvailable || leadPending.current) return;
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(["name", "email", "phone", "company"].map((key) => [key, String(form.get(key) ?? "").trim()]).filter(([,value])=>value!==""));
    const body=JSON.stringify({...payload,consentText:props.consentText??"",privacyUrl:props.privacyUrl??null,consented:form.get("consent")==="on",input:values,output:evaluated.result,sourceUrl:window.location.href});
    const previous=leadAttempt.current;
    const attempt=previous?.key===props.publicKey&&(!previous.confirmed||previous.body===body)?previous:{id:crypto.randomUUID(),body,key:props.publicKey,confirmed:false};
    leadAttempt.current=attempt;
    leadPending.current=true;setSubmittingLead(true);setLeadStatus("");
    try {
      const response=await fetch(`/api/embed/${attempt.key}/leads`,{
        method:"POST",headers:{"Content-Type":"application/json","X-Embed-Session":sessionRef.current,"Idempotency-Key":attempt.id},body:attempt.body
      });
      const result:unknown=await response.json();
      if(response.status===409&&result&&typeof result==="object"&&"code" in result&&result.code==="CONSENT_CHANGED"){
        setSessionAvailable(false);setSessionMessage("Consent information changed. Reload this calculator before submitting again.");setLeadStatus("");setUncertainLead(false);return;
      }
      if(!response.ok||!result||typeof result!=="object"||!("ok" in result)||result.ok!==true)throw new Error("Unconfirmed submission");
      attempt.confirmed=true;setUncertainLead(false);setLeadStatus("Thanks — your details were submitted.");
    } catch {
      setUncertainLead(true);setLeadStatus("Submission outcome is unconfirmed. Retry the original submission; your current edits are preserved.");
    } finally {leadPending.current=false;setSubmittingLead(false);}

  }

  function recordCalculation() {
    void fetch(`/api/embed/${props.publicKey}/events`, { method: "POST", headers: { "Content-Type": "application/json", "X-Embed-Session": sessionRef.current }, body: JSON.stringify({ type: "calculate", sourceUrl: window.location.href }) });
  }

  return (
    <div className="public-embed" aria-busy={!interactive} style={{ "--embed-accent": props.accentColor } as React.CSSProperties}>
      {(props.companyName || props.logoUrl) && <header className="embed-brand">{props.logoUrl && <Image src={props.logoUrl} alt="" width={120} height={48} unoptimized />}<strong>{props.companyName}</strong></header>}
      <div className="field-grid">
        {props.definition.fields.map((field) => <label className="field" key={field.key}><span>{field.label}</span><input type="number" disabled={!interactive} inputMode="decimal" min={field.min ?? undefined} max={field.max ?? undefined} step={field.step ?? "any"} value={values[field.key] ?? ""} onChange={(event) => { setValues((current) => ({ ...current, [field.key]: event.target.value })); recordCalculation(); }} />{field.helpText && <small>{field.helpText}</small>}</label>)}
      </div>
      {evaluated.error ? <div className="notice error-notice">{evaluated.error}</div> : <div className="builder-results">{props.definition.outputs.map((output) => <div className="result-box" key={output.key}><span>{output.label}</span><strong>{formatValue(evaluated.result?.[output.key], output.format, output.decimals)}</strong></div>)}</div>}
      {props.ctaLabel && props.ctaUrl && <a className="button primary embed-cta" href={props.ctaUrl} target="_blank" rel="noreferrer" onClick={() => void fetch(`/api/embed/${props.publicKey}/events`, { method: "POST", headers: { "Content-Type": "application/json", "X-Embed-Session": sessionRef.current }, body: JSON.stringify({ type: "cta_click", sourceUrl: window.location.href }) })}>{props.ctaLabel}</a>}
      {!sessionAvailable && <p role="alert">{sessionMessage}</p>}
      {props.leadCaptureEnabled && <form className="embed-lead-form" method="post" onSubmit={submitLead}><h3>Send me this result</h3><fieldset disabled={!interactive} aria-label="Contact details and consent" style={{border:0,padding:0,margin:0,minWidth:0}}>{props.leadFields.includes("name") && <label>Name<input name="name" required /></label>}{props.leadFields.includes("email") && <label>Email<input name="email" type="email" required /></label>}{props.leadFields.includes("phone") && <label>Phone<input name="phone" /></label>}{props.leadFields.includes("company") && <label>Company<input name="company" /></label>}<label className="consent-row"><input name="consent" type="checkbox" required /><span>{props.consentText}{props.privacyUrl && <> <a href={props.privacyUrl} target="_blank" rel="noreferrer">Privacy policy</a></>}</span></label><button className="button primary" type="submit" disabled={!interactive||!sessionAvailable||submittingLead}>{submittingLead?"Submitting…":uncertainLead?"Retry original submission":"Submit"}</button></fieldset>{leadStatus && <p aria-live="polite">{leadStatus}</p>}</form>}
      <noscript><p>Enable JavaScript to edit this calculator or submit your details.</p></noscript>
      {!props.hideCalcumintBrand && <footer className="embed-powered">Powered by CalcuMint</footer>}
    </div>
  );
}

// Decode only to partition local UI state. This is NOT capability verification;
// every server route still verifies the signed token and current publication.
function capabilityScope(token:string):string {
  try {
    const raw=token.split(".")[0].replace(/-/g,"+").replace(/_/g,"/");
    const claims:unknown=JSON.parse(atob(raw));
    if(claims&&typeof claims==="object"&&"configId" in claims&&"calculatorId" in claims&&"organizationId" in claims&&"version" in claims
      && typeof claims.configId==="string"&&typeof claims.calculatorId==="string"&&typeof claims.organizationId==="string"
      && typeof claims.version==="number"&&Number.isSafeInteger(claims.version)&&claims.version>0)
      return JSON.stringify([claims.configId,claims.calculatorId,claims.organizationId,claims.version]);
  } catch { /* An opaque/malformed token remains a separate UI scope. */ }
  return token;
}

function formatValue(value: number | boolean | undefined, format: "number" | "currency" | "percentage", decimals: number) {
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value !== "number" || !Number.isFinite(value)) return "—";
  if (format === "percentage") return `${value.toFixed(decimals)}%`;
  if (format === "currency") return value.toLocaleString(undefined, { style: "currency", currency: "USD", minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return value.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}
