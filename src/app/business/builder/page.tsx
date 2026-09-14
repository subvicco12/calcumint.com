import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createCustomCalculator } from "./actions";

export const metadata = { title: "Custom Calculator Builder" };

const starterFields = JSON.stringify([
  { key: "revenue", label: "Revenue", type: "currency", required: true, min: 0, defaultValue: 10000 },
  { key: "cost", label: "Cost", type: "currency", required: true, min: 0, defaultValue: 6500 }
], null, 2);

const starterOutputs = JSON.stringify([
  { key: "profit", label: "Profit", formula: "revenue - cost", format: "currency", decimals: 2 },
  { key: "margin", label: "Profit margin", formula: "IF(revenue > 0, profit / revenue * 100, 0)", format: "percentage", decimals: 2 }
], null, 2);

export default async function BuilderPage() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return <section className="container page-top"><h1>Builder requires Supabase configuration.</h1></section>;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: memberships } = await supabase.from("organization_members").select("organization_id,role").eq("user_id", user.id).limit(1);
  const membership = memberships?.[0];
  if (!membership) redirect("/business");
  if (!["owner", "admin", "manager"].includes(String(membership.role))) {
    return <section className="container page-top"><span className="eyebrow">Business Builder</span><h1>Builder access is read-only for your role.</h1><p className="hero-copy">Owner, Admin or Manager permission is required to create and edit custom calculators.</p></section>;
  }

  const organizationId = String(membership.organization_id);
  const { data: calculators } = await supabase.from("custom_calculators").select("id,name,slug,status,current_version,published_version,updated_at").eq("organization_id", organizationId).order("updated_at", { ascending: false });

  return (
    <section className="container page-top business-page">
      <div className="section-heading">
        <div><span className="eyebrow">Business Builder</span><h1>Build calculators without code.</h1><p className="hero-copy">Define inputs, formulas and outputs. CalcuMint executes formulas with a restricted parser—never arbitrary JavaScript.</p></div>
        <Link className="button secondary" href="/business">Business workspace</Link>
      </div>

      <div className="account-grid">
        <article className="card">
          <span className="eyebrow">Existing calculators</span><h2>Your builder library</h2>
          {calculators?.length ? <ul>{calculators.map((calculator) => <li key={calculator.id}><Link className="text-link" href={`/business/builder/${calculator.id}`}>{calculator.name}</Link> · {calculator.status} · v{calculator.current_version}</li>)}</ul> : <p>No custom calculators yet.</p>}
        </article>

        <form className="card form-stack" action={createCustomCalculator}>
          <input type="hidden" name="organizationId" value={organizationId} />
          <span className="eyebrow">New calculator</span><h2>Create a draft</h2>
          <label>Name<input name="name" required minLength={2} maxLength={120} defaultValue="Profit Margin Calculator" /></label>
          <label>Slug<input name="slug" required pattern="[a-z0-9-]+" defaultValue="profit-margin-calculator" /></label>
          <label>Description<textarea name="description" rows={3} defaultValue="Calculate profit and profit margin from revenue and cost." /></label>
          <label>Input fields JSON<textarea name="fields" rows={12} defaultValue={starterFields} spellCheck={false} /></label>
          <label>Outputs & formulas JSON<textarea name="outputs" rows={10} defaultValue={starterOutputs} spellCheck={false} /></label>
          <p className="muted-copy">Formula language supports +, −, ×, ÷, powers, comparisons, AND/OR, IF, MIN, MAX, ABS, ROUND, FLOOR and CEIL.</p>
          <button className="button primary" type="submit">Create calculator</button>
        </form>
      </div>
    </section>
  );
}
