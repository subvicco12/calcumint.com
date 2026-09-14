import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { apiScopes } from "@/lib/api/api-keys";
import { createBusinessApiKey, createWebhookEndpoint, disableWebhookEndpoint, revokeBusinessApiKey } from "./actions";

type PageProps = { searchParams: Promise<{ created?: string; webhookSecret?: string }> };

export const metadata = { title: "Business API" };

export default async function BusinessApiPage({ searchParams }: PageProps) {
  const { created, webhookSecret } = await searchParams;
  const supabase = await createSupabaseServerClient();
  if (!supabase) return <section className="container page-top"><h1>Business API requires Supabase configuration.</h1></section>;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: memberships } = await supabase.from("organization_members").select("organization_id,role").eq("user_id", user.id).limit(1);
  const membership = memberships?.[0];
  if (!membership) redirect("/business");
  const canAdmin = ["owner", "admin"].includes(String(membership.role));
  const organizationId = String(membership.organization_id);
  const [{ data: keys }, { data: usage }, { data: endpoints }, { data: deliveries }] = await Promise.all([
    supabase.from("business_api_keys").select("id,name,key_prefix,scopes,status,rate_limit_per_minute,monthly_quota,last_used_at,created_at").eq("organization_id", organizationId).order("created_at", { ascending: false }),
    supabase.from("api_usage_events").select("id,created_at").eq("organization_id", organizationId).order("created_at", { ascending: false }).limit(1000),
    supabase.from("business_webhook_endpoints").select("id,name,endpoint_url,event_types,status,created_at").eq("organization_id", organizationId).order("created_at", { ascending: false }),
    supabase.from("webhook_deliveries").select("id,status").eq("organization_id", organizationId).order("created_at", { ascending: false }).limit(1000)
  ]);

  return (
    <section className="container page-top business-page">
      <div className="section-heading">
        <div><span className="eyebrow">Business automation</span><h1>API & webhooks</h1><p className="hero-copy">Connect CalcuMint to your software, n8n, Make, Zapier, Airtable, CRM or internal workflow.</p></div>
        <Link className="button secondary" href="/business">Business workspace</Link>
      </div>

      {created && <div className="notice success-notice"><strong>Copy this API key now.</strong> It will not be shown again.<br/><code>{created}</code></div>}
      {webhookSecret && <div className="notice success-notice"><strong>Copy this webhook signing secret now.</strong> It is encrypted at rest and will not be shown again.<br/><code>{webhookSecret}</code></div>}

      <div className="business-stats">
        <article className="card"><span className="eyebrow">Keys</span><h2>{keys?.filter((key) => key.status === "active").length ?? 0}</h2><p>Active organization API credentials.</p></article>
        <article className="card"><span className="eyebrow">Recent API usage</span><h2>{usage?.length ?? 0}</h2><p>Recent metered API requests shown in this dashboard.</p></article>
        <article className="card"><span className="eyebrow">Webhook deliveries</span><h2>{deliveries?.length ?? 0}</h2><p>Recent queued, delivered and failed events.</p></article>
      </div>

      <div className="account-grid section">
        <article className="card">
          <span className="eyebrow">Credentials</span><h2>API keys</h2>
          {keys?.length ? <ul>{keys.map((key) => <li key={key.id}><strong>{key.name}</strong> · <code>{key.key_prefix}…</code> · {key.status} · {key.rate_limit_per_minute}/min · {key.monthly_quota}/month{canAdmin && key.status === "active" ? <form action={revokeBusinessApiKey}><input type="hidden" name="keyId" value={key.id}/><button className="button secondary" type="submit">Revoke</button></form> : null}</li>)}</ul> : <p>No API keys yet.</p>}
        </article>

        {canAdmin && <form className="card form-stack" action={createBusinessApiKey}>
          <span className="eyebrow">New credential</span><h2>Create API key</h2>
          <label>Name<input name="name" required placeholder="Production automation"/></label>
          <fieldset><legend>Scopes</legend>{apiScopes.map((scope) => <label key={scope}><input type="checkbox" name="scopes" value={scope}/> {scope}</label>)}</fieldset>
          <label>Requests per minute<input type="number" name="rateLimit" min="1" max="5000" defaultValue="60"/></label>
          <label>Monthly request quota<input type="number" name="monthlyQuota" min="1" max="10000000" defaultValue="10000"/></label>
          <button className="button primary" type="submit">Create key</button>
        </form>}
      </div>

      <div className="account-grid section">
        <article className="card">
          <span className="eyebrow">Outbound automation</span><h2>Webhook endpoints</h2>
          {endpoints?.length ? <ul>{endpoints.map((endpoint) => <li key={endpoint.id}><strong>{endpoint.name}</strong> · {endpoint.status}<br/><code>{endpoint.endpoint_url}</code>{canAdmin && endpoint.status === "active" ? <form action={disableWebhookEndpoint}><input type="hidden" name="endpointId" value={endpoint.id}/><button className="button secondary" type="submit">Disable</button></form> : null}</li>)}</ul> : <p>No webhook endpoints yet.</p>}
        </article>

        {canAdmin && <form className="card form-stack" action={createWebhookEndpoint}>
          <span className="eyebrow">Signed delivery</span><h2>Add webhook</h2>
          <label>Name<input name="webhookName" required placeholder="CRM automation"/></label>
          <label>HTTPS endpoint<input type="url" name="endpointUrl" required placeholder="https://example.com/calcumint-webhook"/></label>
          <fieldset><legend>Events</legend><label><input type="checkbox" name="eventTypes" value="calculation.completed"/> calculation.completed</label><label><input type="checkbox" name="eventTypes" value="lead.created"/> lead.created</label></fieldset>
          <button className="button primary" type="submit">Create webhook</button>
        </form>}
      </div>

      <article className="card section">
        <span className="eyebrow">Endpoints</span><h2>Business API v1</h2>
        <p><code>POST /api/v1/custom/{'{calculatorId}'}/calculate</code> — run one published custom calculator.</p>
        <p><code>POST /api/v1/batch</code> — process 1–100 calculation rows per request.</p>
        <p className="muted">Authenticate with <code>Authorization: Bearer &lt;api-key&gt;</code>. API keys are scope-limited, rate-limited and monthly-quota metered. Webhooks use HMAC-SHA256 signatures, retry with exponential backoff and dead-letter after eight failed attempts.</p>
      </article>
    </section>
  );
}
