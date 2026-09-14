import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata = { title: "Platform Admin" };

export default async function AdminPage() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return <section className="container page-top"><h1>Admin console requires Supabase configuration.</h1></section>;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: admin } = await supabase.from("platform_admins").select("role,active").eq("user_id", user.id).maybeSingle();
  if (!admin?.active) return <section className="container page-top"><span className="eyebrow">CalcuMint operations</span><h1>Platform admin access required.</h1><p className="hero-copy">This console is restricted to explicitly provisioned CalcuMint operators.</p></section>;

  const now = new Date().toISOString();
  const [{ data: calculators }, { data: alerts }, { data: jobs }] = await Promise.all([
    supabase.from("calculator_catalog_admin").select("id,lifecycle,risk_class,next_review_due_at"),
    supabase.from("admin_alerts").select("id,severity,alert_type,message,calculator_id,created_at").eq("status", "open").order("created_at", { ascending: false }).limit(20),
    supabase.from("calculator_bulk_jobs").select("id,job_type,status,created_at,completed_at").order("created_at", { ascending: false }).limit(10)
  ]);
  const inventory = calculators ?? [];
  const counts = Object.fromEntries(["draft","review","certified","published","archived"].map((state) => [state, inventory.filter((item) => item.lifecycle === state).length]));
  const overdue = inventory.filter((item) => item.lifecycle === "published" && item.next_review_due_at && item.next_review_due_at < now).length;
  const ymyl = inventory.filter((item) => ["financial","health","tax"].includes(String(item.risk_class))).length;

  return <section className="container page-top admin-page">
    <div className="section-heading"><div><span className="eyebrow">CalcuMint operations</span><h1>Admin Control Center</h1><p className="hero-copy">Review, certify, publish and monitor the calculator inventory from one governed workflow.</p></div><Link className="button primary" href="/admin/calculators">Calculator factory</Link></div>

    <div className="admin-stats">
      <article className="card"><span className="eyebrow">Inventory</span><h2>{inventory.length}</h2><p>{counts.published ?? 0} published · {counts.review ?? 0} in review</p></article>
      <article className="card"><span className="eyebrow">YMYL</span><h2>{ymyl}</h2><p>Financial, health and tax calculators needing stronger review.</p></article>
      <article className="card"><span className="eyebrow">Review debt</span><h2>{overdue}</h2><p>Published calculators past their next-review date.</p></article>
      <article className="card"><span className="eyebrow">Open alerts</span><h2>{alerts?.length ?? 0}</h2><p>Quality, publishing and operational issues needing attention.</p></article>
    </div>

    <div className="account-grid section">
      <article className="card"><span className="eyebrow">Workflow</span><h2>Lifecycle snapshot</h2><ul>{Object.entries(counts).map(([state,count]) => <li key={state}><strong>{state}</strong> · {count}</li>)}</ul></article>
      <article className="card"><span className="eyebrow">Operator</span><h2>{String(admin.role)}</h2><p>Platform-admin privileges are separate from customer Business roles and cannot be self-assigned.</p></article>
    </div>

    <article className="card section"><div className="section-heading"><div><span className="eyebrow">Quality watch</span><h2>Open alerts</h2></div></div>{alerts?.length ? <ul className="admin-list">{alerts.map((alert) => <li key={alert.id}><strong>{alert.severity.toUpperCase()}</strong> · {alert.alert_type} — {alert.message}{alert.calculator_id ? <> · <Link href={`/admin/calculators/${alert.calculator_id}`}>Open calculator</Link></> : null}</li>)}</ul> : <p>No open alerts.</p>}</article>

    <article className="card section"><span className="eyebrow">Factory activity</span><h2>Recent bulk jobs</h2>{jobs?.length ? <ul className="admin-list">{jobs.map((job) => <li key={job.id}>{job.job_type} · <strong>{job.status}</strong> · {new Date(job.created_at).toLocaleString()}</li>)}</ul> : <p>No bulk jobs yet.</p>}</article>
  </section>;
}
