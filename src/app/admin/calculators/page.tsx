import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createCatalogCalculator, importCalculatorInventory } from "../actions";
import { calculatorRegistry } from "@/calculators/registry";
import { inspectCertificationEvidencePacket } from "@/calculators/certification-evidence-packet";

export const metadata = { title: "Calculator Factory" };

const bulkExample = JSON.stringify([
  { calculatorKey: "core:bmi", slug: "bmi-calculator", title: "BMI Calculator", category: "health", riskClass: "health" }
], null, 2);

export default async function AdminCalculatorsPage() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return <section className="container page-top"><h1>Calculator factory requires Supabase configuration.</h1></section>;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: admin } = await supabase.from("platform_admins").select("role,active").eq("user_id", user.id).maybeSingle();
  if (!admin?.active) redirect("/admin");
  const role = String(admin.role);
  const canBulk = ["owner","admin"].includes(role);
  const reviewedStandard = calculatorRegistry.list().filter((definition) => definition.riskClass === "standard" && definition.reviewStatus === "reviewed");
  const evidenceReady = reviewedStandard.filter((definition) => inspectCertificationEvidencePacket(definition).ready).length;
  const evidenceBlocked = reviewedStandard.length - evidenceReady;

  const { data: calculators } = await supabase.from("calculator_catalog_admin")
    .select("id,calculator_key,slug,title,category,risk_class,lifecycle,version,source_count,reviewer_id,next_review_due_at,updated_at")
    .order("updated_at", { ascending: false });

  return <section className="container page-top admin-page">
    <div className="section-heading"><div><span className="eyebrow">Publishing factory</span><h1>Calculator inventory</h1><p className="hero-copy">Every calculator moves through draft → review → certified → published, with explicit QA gates and stronger YMYL controls.</p></div><Link className="button secondary" href="/admin">Admin dashboard</Link></div>

    <div className="admin-stats"><article className="card"><span className="eyebrow">Reviewed standard</span><h2>{reviewedStandard.length}</h2><p>Deterministic registry candidates awaiting governed certification.</p></article><article className="card"><span className="eyebrow">Evidence ready</span><h2>{evidenceReady}</h2><p>Registry evidence packets can be prepared for reviewer action.</p></article><article className="card"><span className="eyebrow">Evidence blocked</span><h2>{evidenceBlocked}</h2><p>Missing URL-backed sources, golden tests, or formulas keep these candidates blocked.</p></article></div>

    <article className="card section admin-table-wrap">
      <table className="admin-table"><thead><tr><th>Calculator</th><th>Category</th><th>Risk</th><th>State</th><th>Sources</th><th>Version</th></tr></thead><tbody>
        {(calculators ?? []).map((calculator) => <tr key={calculator.id}><td><Link href={`/admin/calculators/${calculator.id}`}><strong>{calculator.title}</strong></Link><br/><code>{calculator.slug}</code></td><td>{calculator.category}</td><td>{calculator.risk_class}</td><td><span className={`status-pill status-${calculator.lifecycle}`}>{calculator.lifecycle}</span></td><td>{calculator.source_count}</td><td>v{calculator.version}</td></tr>)}
      </tbody></table>
      {!calculators?.length && <p>No governed calculator records yet.</p>}
    </article>

    <div className="account-grid section">
      <form className="card form-stack" action={createCatalogCalculator}>
        <span className="eyebrow">New governed record</span><h2>Add calculator</h2>
        <label>Calculator key<input name="calculatorKey" required placeholder="core:percentage"/></label>
        <label>Slug<input name="slug" required pattern="[a-z0-9-]+" placeholder="percentage-calculator"/></label>
        <label>Title<input name="title" required placeholder="Percentage Calculator"/></label>
        <label>Category<input name="category" required placeholder="math"/></label>
        <label>Risk class<select name="riskClass" defaultValue="standard"><option value="standard">Standard</option><option value="financial">Financial</option><option value="health">Health</option><option value="tax">Tax</option></select></label>
        <button className="button primary" type="submit">Create draft record</button>
      </form>

      {canBulk ? <form className="card form-stack" action={importCalculatorInventory}>
        <span className="eyebrow">Production factory</span><h2>Bulk inventory import</h2><p>Import or seed up to 250 calculator records in one governed job. Existing calculator keys are left unchanged.</p>
        <label>Inventory JSON<textarea name="inventory" rows={14} defaultValue={bulkExample} spellCheck={false}/></label>
        <button className="button primary" type="submit">Run inventory import</button>
      </form> : <article className="card"><span className="eyebrow">Bulk factory</span><h2>Admin permission required</h2><p>Your role can work with individual calculator records, but only Owner/Admin can run bulk inventory jobs.</p></article>}
    </div>
  </section>;
}
