import type {Metadata} from "next";
import {getProductPolicy} from '@/lib/product-mode-server';
import {FeatureUnavailable} from '@/components/feature-unavailable';
import Link from "next/link";
import { BusinessCredentialForm } from "@/components/business-credential-form";
import { AccountSessionBoundary } from "@/components/account-session-boundary";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { apiScopes } from "@/lib/api/api-keys";
import { createBusinessApiKey, createWebhookEndpoint, disableWebhookEndpoint, revokeBusinessApiKey } from "./actions";

async function readAutomation<T>(query: PromiseLike<T>): Promise<T | {data: null; error: unknown}> {
  try { return await query; } catch (error) { return {data: null, error: error || true}; }
}

function ReadUnavailable({label}: {label: string}) {
  return <p role="status">{label} is temporarily unavailable. <Link href="/business/api" className="text-link">Retry automation</Link></p>;
}

function AutomationUnavailable() {
  return <section className="container page-top business-page"><h1>Business automation is temporarily unavailable.</h1><ReadUnavailable label="Workspace access"/><Link className="text-link" href="/business">Business workspace</Link></section>;
}

type PageProps = { searchParams: Promise<{ created?: string; webhookSecret?: string }> };

const fullMetadata = { title: "Business API" };
export function generateMetadata(): Metadata {
  return getProductPolicy().mode === 'full' ? fullMetadata : {title:'Feature unavailable',robots:{index:false,follow:false}};
}


export default async function BusinessApiPage(_props: PageProps) {
  if (!getProductPolicy().capabilities.apiAndWebhooks) return <FeatureUnavailable/>;

  void _props; // Legacy query parameters never carry or reveal credentials.
  const supabase = await createSupabaseServerClient();
  if (!supabase) return <section className="container page-top"><h1>Business API requires Supabase configuration.</h1></section>;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const {data:profile,error:profileError}=await readAutomation(supabase.from("profiles").select("plan").eq("id",user.id).maybeSingle());
  if(profileError || !profile) return <AutomationUnavailable/>;
  if(profile.plan!=="business")redirect("/business");
  const { data: memberships, error: membershipError } = await readAutomation(supabase.from("organization_members").select("organization_id,role").eq("user_id", user.id).limit(1));
  if (membershipError) return <AutomationUnavailable/>;
  const membership = memberships?.[0];
  if (!membership) redirect("/business");
  const canAdmin = ["owner", "admin"].includes(String(membership.role));
  const organizationId = String(membership.organization_id);
  const [{ data: keys, error: keysError }, { data: usage, error: usageError }, { data: endpoints, error: endpointsError }, { data: deliveries, error: deliveriesError }] = await Promise.all([
    readAutomation(supabase.from("business_api_keys").select("id,name,key_prefix,scopes,status,rate_limit_per_minute,monthly_quota,last_used_at,created_at").eq("organization_id", organizationId).order("created_at", { ascending: false })),
    readAutomation(supabase.from("api_usage_events").select("id,created_at").eq("organization_id", organizationId).order("created_at", { ascending: false }).limit(1000)),
    readAutomation(supabase.from("business_webhook_endpoints").select("id,name,endpoint_url,event_types,status,created_at").eq("organization_id", organizationId).order("created_at", { ascending: false })),
    readAutomation(supabase.from("webhook_deliveries").select("id,status").eq("organization_id", organizationId).order("created_at", { ascending: false }).limit(1000))
  ]);

  return (
    <AccountSessionBoundary ownerId={user.id}><section className="container page-top business-page">
      <div className="section-heading">
        <div><span className="eyebrow">Business automation</span><h1>API & webhooks</h1><p className="hero-copy">Connect CalcuMint to your software, n8n, Make, Zapier, Airtable, CRM or internal workflow.</p></div>
        <Link className="button secondary" href="/business">Business workspace</Link>
      </div>


      <div className="business-stats">
        <article className="card"><span className="eyebrow">Keys</span><h2>{keysError ? "Unavailable" : keys?.filter((key) => key.status === "active").length ?? 0}</h2><p>Active organization API credentials.</p></article>
        <article className="card"><span className="eyebrow">Recent API usage</span><h2>{usageError ? "Unavailable" : usage?.length ?? 0}</h2><p>Latest 1,000 metered API requests shown.</p>{Boolean(usageError) && <ReadUnavailable label="API usage"/>}</article>
        <article className="card"><span className="eyebrow">Webhook deliveries</span><h2>{deliveriesError ? "Unavailable" : deliveries?.length ?? 0}</h2><p>Latest 1,000 queued, delivered and failed events shown.</p>{Boolean(deliveriesError) && <ReadUnavailable label="Webhook delivery activity"/>}</article>
      </div>

      <div className="account-grid section">
        <article className="card">
          <span className="eyebrow">Credentials</span><h2>API keys</h2>
          {keysError ? <ReadUnavailable label="API key list"/> : keys?.length ? <ul>{keys.map((key) => <li key={key.id}><strong>{key.name}</strong> · <code>{key.key_prefix}…</code> · {key.status} · {key.rate_limit_per_minute}/min · {key.monthly_quota}/month{canAdmin && key.status === "active" ? <form action={revokeBusinessApiKey}><input type="hidden" name="expectedOwnerId" value={user.id}/><input type="hidden" name="keyId" value={key.id}/><button className="button secondary" type="submit">Revoke</button></form> : null}</li>)}</ul> : <p>No API keys yet.</p>}
        </article>

        {!keysError && canAdmin && <BusinessCredentialForm ownerId={user.id} kind="API key" action={createBusinessApiKey}>
          <span className="eyebrow">New credential</span><h2>Create API key</h2>
          <label>Name<input name="name" required placeholder="Production automation"/></label>
          <fieldset><legend>Scopes</legend>{apiScopes.map((scope) => <label key={scope}><input type="checkbox" name="scopes" value={scope}/> {scope}</label>)}</fieldset>
          <label>Requests per minute<input type="number" name="rateLimit" min="1" max="5000" defaultValue="60"/></label>
          <label>Monthly request quota<input type="number" name="monthlyQuota" min="1" max="10000000" defaultValue="10000"/></label>
          <button className="button primary" type="submit">Create key</button>
        </BusinessCredentialForm>}
      </div>

      <div className="account-grid section">
        <article className="card">
          <span className="eyebrow">Outbound automation</span><h2>Webhook endpoints</h2>
          {endpointsError ? <ReadUnavailable label="Webhook endpoint list"/> : endpoints?.length ? <ul>{endpoints.map((endpoint) => <li key={endpoint.id}><strong>{endpoint.name}</strong> · {endpoint.status}<br/><code>{endpoint.endpoint_url}</code>{canAdmin && endpoint.status === "active" ? <form action={disableWebhookEndpoint}><input type="hidden" name="expectedOwnerId" value={user.id}/><input type="hidden" name="endpointId" value={endpoint.id}/><button className="button secondary" type="submit">Disable</button></form> : null}</li>)}</ul> : <p>No webhook endpoints yet.</p>}
        </article>

        {!endpointsError && canAdmin && <BusinessCredentialForm ownerId={user.id} kind="webhook signing secret" action={createWebhookEndpoint}>
          <span className="eyebrow">Signed delivery</span><h2>Add webhook</h2>
          <label>Name<input name="webhookName" required placeholder="CRM automation"/></label>
          <label>HTTPS endpoint<input type="url" name="endpointUrl" required placeholder="https://example.com/calcumint-webhook"/></label>
          <fieldset><legend>Events</legend><label><input type="checkbox" name="eventTypes" value="calculation.completed"/> calculation.completed</label><label><input type="checkbox" name="eventTypes" value="lead.created"/> lead.created</label></fieldset>
          <button className="button primary" type="submit">Create webhook</button>
        </BusinessCredentialForm>}
      </div>

      <article className="card section">
        <span className="eyebrow">Endpoints</span><h2>Business API v1</h2>
        <p><code>POST /api/v1/custom/{'{calculatorId}'}/calculate</code> — run one published custom calculator.</p>
        <p><code>POST /api/v1/batch</code> — process 1–100 calculation rows per request.</p>
        <p className="muted">Authenticate with <code>Authorization: Bearer &lt;api-key&gt;</code>. API keys are scope-limited, rate-limited and monthly-quota metered. Webhooks use HMAC-SHA256 signatures, retry with exponential backoff and dead-letter after eight failed attempts.</p>
      </article>
    </section></AccountSessionBoundary>
  );
}
