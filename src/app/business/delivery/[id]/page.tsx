import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createEmbedConfig, createShareLink } from "../actions";

type PageProps = { params: Promise<{ id: string }>; searchParams: Promise<{ share?: string }> };

export default async function DeliveryPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { share } = await searchParams;
  const supabase = await createSupabaseServerClient();
  if (!supabase) return <section className="container page-top"><h1>Delivery tools require Supabase configuration.</h1></section>;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: calculator } = await supabase.from("custom_calculators").select("id,organization_id,name,slug,status,published_version").eq("id", id).maybeSingle();
  if (!calculator) notFound();
  const { data: membership } = await supabase.from("organization_members").select("role").eq("organization_id", calculator.organization_id).eq("user_id", user.id).maybeSingle();
  if (!membership) notFound();
  const canManage = ["owner","admin","manager"].includes(String(membership.role));
  const [{ data: embeds }, { data: leads }, { data: events }] = await Promise.all([
    supabase.from("embed_configs").select("id,public_key,name,status,allowed_domains,lead_capture_enabled,created_at").eq("calculator_id", id).order("created_at", { ascending: false }),
    supabase.from("embed_leads").select("id,name,email,phone,company,created_at").eq("calculator_id", id).order("created_at", { ascending: false }).limit(20),
    supabase.from("embed_events").select("event_type").eq("calculator_id", id)
  ]);
  const counts = Object.fromEntries(["view","calculate","lead_submit","cta_click"].map((type) => [type, events?.filter((event) => event.event_type === type).length ?? 0]));

  return <section className="container page-top business-page">
    <div className="section-heading"><div><span className="eyebrow">Business delivery</span><h1>{calculator.name}</h1><p className="hero-copy">White-label embeds, controlled domains, client share links and lead capture.</p></div><Link className="button secondary" href={`/business/builder/${id}`}>Back to builder</Link></div>
    {share && <div className="notice success-notice">Secure share link created: <Link className="text-link" href={`/share/${share}`}>Open client link</Link>. Copy it now; CalcuMint stores only its hash.</div>}
    <div className="business-stats"><article className="card"><span className="eyebrow">Views</span><h2>{counts.view}</h2></article><article className="card"><span className="eyebrow">Calculations</span><h2>{counts.calculate}</h2></article><article className="card"><span className="eyebrow">Leads</span><h2>{counts.lead_submit}</h2></article></div>
    {canManage && <div className="account-grid section">
      <form className="card form-stack" action={createEmbedConfig}><input type="hidden" name="calculatorId" value={id}/><input type="hidden" name="organizationId" value={calculator.organization_id}/><span className="eyebrow">Website embed</span><h2>Create deployment</h2><label>Name<input name="name" defaultValue="Primary website embed" required/></label><label>Allowed domains<textarea name="allowedDomains" rows={3} placeholder="example.com, app.example.com"/></label><label><input type="checkbox" name="allowDirect" defaultChecked/> Allow direct embed URL opening</label><label>Company name<input name="companyName"/></label><label>Logo URL<input name="logoUrl" type="url"/></label><label>Accent color<input name="accentColor" defaultValue="#0b7a66" pattern="#[0-9A-Fa-f]{6}"/></label><label><input type="checkbox" name="hideCalcumintBrand"/> Hide CalcuMint branding</label><label>CTA label<input name="ctaLabel" placeholder="Book a consultation"/></label><label>CTA URL<input name="ctaUrl" type="url"/></label><label><input type="checkbox" name="leadCaptureEnabled"/> Enable lead capture</label><div><label><input type="checkbox" name="lead_name" defaultChecked/> Name</label> <label><input type="checkbox" name="lead_email" defaultChecked/> Email</label> <label><input type="checkbox" name="lead_phone"/> Phone</label> <label><input type="checkbox" name="lead_company"/> Company</label></div><label>Consent text<textarea name="consentText" rows={3} placeholder="I agree that this business may contact me about my calculation."/></label><label>Privacy URL<input name="privacyUrl" type="url"/></label><button className="button primary" type="submit">Create embed</button></form>
      <form className="card form-stack" action={createShareLink}><input type="hidden" name="calculatorId" value={id}/><input type="hidden" name="organizationId" value={calculator.organization_id}/><span className="eyebrow">Client delivery</span><h2>Create expiring share link</h2><label>Label<input name="label" defaultValue="Client result calculator"/></label><label>Expires in days<input name="days" type="number" min="1" max="90" defaultValue="7"/></label><button className="button secondary" type="submit" disabled={calculator.status !== "published"}>Create secure link</button>{calculator.status !== "published" && <p>Publish a calculator version before sharing it.</p>}</form>
    </div>}
    <div className="account-grid section"><article className="card"><span className="eyebrow">Deployments</span><h2>Embed library</h2>{embeds?.length ? <ul>{embeds.map((embed) => <li key={embed.id}><strong>{embed.name}</strong> · {embed.status} · <Link className="text-link" href={`/embed/${embed.public_key}`}>Preview</Link><br/><small>{embed.allowed_domains?.length ? `Domains: ${embed.allowed_domains.join(", ")}` : "All domains"}{embed.lead_capture_enabled ? " · Leads on" : ""}</small></li>)}</ul> : <p>No embeds yet.</p>}</article><article className="card"><span className="eyebrow">Lead inbox</span><h2>Recent leads</h2>{leads?.length ? <ul>{leads.map((lead) => <li key={lead.id}><strong>{lead.name || lead.email || "Lead"}</strong>{lead.email ? ` · ${lead.email}` : ""}{lead.company ? ` · ${lead.company}` : ""}</li>)}</ul> : <p>No leads yet.</p>}</article></div>
  </section>;
}
