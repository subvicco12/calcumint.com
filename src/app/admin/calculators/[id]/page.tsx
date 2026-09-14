import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { assignReviewer, transitionCalculator, updateQaCheck } from "../../actions";
import { requiredQaChecks } from "@/lib/admin/publishing";

type PageProps = { params: Promise<{ id: string }> };
export const metadata = { title: "Calculator Review" };

export default async function AdminCalculatorDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  if (!supabase) return <section className="container page-top"><h1>Review workspace requires Supabase configuration.</h1></section>;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: admin } = await supabase.from("platform_admins").select("role,active").eq("user_id", user.id).maybeSingle();
  if (!admin?.active) redirect("/admin");

  const [{ data: calculator }, { data: checks }, { data: events }, { data: reviewers }] = await Promise.all([
    supabase.from("calculator_catalog_admin").select("*").eq("id", id).maybeSingle(),
    supabase.from("calculator_qa_checks").select("id,check_type,status,details,checked_by,checked_at").eq("calculator_id", id).order("check_type"),
    supabase.from("calculator_review_events").select("id,event_type,from_state,to_state,notes,created_at").eq("calculator_id", id).order("created_at", { ascending: false }).limit(30),
    supabase.from("platform_admins").select("user_id,role,active").eq("active", true)
  ]);
  if (!calculator) notFound();

  const riskClass = String(calculator.risk_class) as "standard" | "financial" | "health" | "tax";
  const required = requiredQaChecks(riskClass);
  const checkMap = new Map((checks ?? []).map((check) => [String(check.check_type), check]));
  const complete = required.every((type) => ["passed","waived"].includes(String(checkMap.get(type)?.status ?? "pending")));
  const canReview = ["owner","admin","reviewer"].includes(String(admin.role));
  const canAssign = ["owner","admin"].includes(String(admin.role));

  return <section className="container page-top admin-page">
    <div className="section-heading"><div><span className="eyebrow">Calculator governance</span><h1>{calculator.title}</h1><p className="hero-copy"><code>{calculator.slug}</code> · {calculator.category} · {calculator.risk_class} risk · v{calculator.version}</p></div><Link className="button secondary" href="/admin/calculators">Inventory</Link></div>

    <div className="admin-stats">
      <article className="card"><span className="eyebrow">Lifecycle</span><h2>{calculator.lifecycle}</h2><p>Current governed publication state.</p></article>
      <article className="card"><span className="eyebrow">QA gate</span><h2>{complete ? "Ready" : "Blocked"}</h2><p>{required.filter((type) => !["passed","waived"].includes(String(checkMap.get(type)?.status ?? "pending"))).length} required checks incomplete.</p></article>
      <article className="card"><span className="eyebrow">Sources</span><h2>{calculator.source_count}</h2><p>Reviewed source references recorded.</p></article>
      <article className="card"><span className="eyebrow">Next review</span><h2>{calculator.next_review_due_at ? new Date(calculator.next_review_due_at).toLocaleDateString() : "—"}</h2><p>Published calculators default to a 180-day review cycle.</p></article>
    </div>

    <article className="card section">
      <span className="eyebrow">Lifecycle control</span><h2>Move through the publishing workflow</h2>
      <div className="button-row">
        {["draft","review","certified","published","archived"].map((target) => <form key={target} action={transitionCalculator}><input type="hidden" name="calculatorId" value={id}/><input type="hidden" name="target" value={target}/><button className="button secondary" type="submit" disabled={target === calculator.lifecycle}>{target}</button></form>)}
      </div>
      <p className="muted-copy">Skipping lifecycle stages is rejected. Certification and publication also call the database publishing gate, so UI bypass cannot publish an incomplete calculator.</p>
    </article>

    {canAssign && <article className="card section"><span className="eyebrow">Reviewer</span><h2>Assign accountable reviewer</h2><form className="inline-form" action={assignReviewer}><input type="hidden" name="calculatorId" value={id}/><select name="reviewerId" required defaultValue={calculator.reviewer_id ?? ""}><option value="" disabled>Select reviewer</option>{(reviewers ?? []).filter((item) => ["owner","admin","reviewer"].includes(String(item.role))).map((item) => <option key={item.user_id} value={item.user_id}>{item.role} · {String(item.user_id).slice(0,8)}…</option>)}</select><button className="button secondary" type="submit">Assign</button></form></article>}

    <article className="card section"><span className="eyebrow">Quality gates</span><h2>Required checks</h2><div className="qa-grid">{required.map((type) => {
      const check = checkMap.get(type);
      return <form className="qa-card" action={updateQaCheck} key={type}>
        <input type="hidden" name="calculatorId" value={id}/><input type="hidden" name="checkType" value={type}/>
        <strong>{type}</strong><span className={`status-pill status-${String(check?.status ?? "pending")}`}>{String(check?.status ?? "pending")}</span>
        {canReview ? <><select name="status" defaultValue={String(check?.status ?? "pending")}><option value="pending">Pending</option><option value="passed">Passed</option><option value="failed">Failed</option><option value="waived">Waived</option></select><textarea name="details" rows={3} defaultValue={String(check?.details ?? "")} placeholder="Evidence / reviewer notes"/><button className="button secondary" type="submit">Save check</button></> : <p>{String(check?.details ?? "No notes")}</p>}
      </form>;
    })}</div></article>

    <article className="card section"><span className="eyebrow">Audit trail</span><h2>Review events</h2>{events?.length ? <ul className="admin-list">{events.map((event) => <li key={event.id}><strong>{event.event_type}</strong>{event.from_state || event.to_state ? ` · ${event.from_state ?? "—"} → ${event.to_state ?? "—"}` : ""}{event.notes ? ` · ${event.notes}` : ""} · {new Date(event.created_at).toLocaleString()}</li>)}</ul> : <p>No review events yet.</p>}</article>
  </section>;
}
