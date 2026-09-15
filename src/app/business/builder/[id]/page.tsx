import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { customCalculatorSchema } from "@/lib/builder/definition";
import { CustomCalculatorPreview } from "@/components/custom-calculator-preview";
import { publishCustomCalculator, saveCustomCalculatorVersion } from "../actions";

type PageProps = { params: Promise<{ id: string }> };

export default async function CustomCalculatorBuilderPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  if (!supabase) return <section className="container page-top"><h1>Builder requires Supabase configuration.</h1></section>;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: calculator } = await supabase.from("custom_calculators").select("id,organization_id,name,slug,description,status,visibility,current_version,published_version,updated_at").eq("id", id).maybeSingle();
  if (!calculator) notFound();
  const { data: membership } = await supabase.from("organization_members").select("role").eq("organization_id", calculator.organization_id).eq("user_id", user.id).maybeSingle();
  if (!membership) notFound();

  const { data: versionRow } = await supabase.from("custom_calculator_versions").select("version,definition,change_note,created_at").eq("calculator_id", id).eq("version", calculator.current_version).maybeSingle();
  const parsed = customCalculatorSchema.safeParse(versionRow?.definition);
  if (!parsed.success) throw new Error("Current calculator definition is invalid");
  const definition = parsed.data;
  const canEdit = ["owner", "admin", "manager"].includes(String(membership.role));

  const { data: versions } = await supabase.from("custom_calculator_versions").select("version,change_note,created_at").eq("calculator_id", id).order("version", { ascending: false }).limit(20);

  return (
    <section className="container page-top business-page">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Custom Calculator Builder</span>
          <h1>{calculator.name}</h1>
          <p className="hero-copy">/{calculator.slug} · {calculator.status} · {calculator.visibility} · current v{calculator.current_version}{calculator.published_version ? ` · published v${calculator.published_version}` : ""}</p>
        </div>
        <Link className="button secondary" href="/business/builder">Back to builder</Link>
      </div>

      <div className="builder-grid">
        <article className="card">
          <span className="eyebrow">Live preview</span><h2>Test the current draft</h2>
          <CustomCalculatorPreview definition={definition} />
        </article>

        <article className="card">
          <span className="eyebrow">Formula safety</span><h2>Restricted deterministic DSL</h2>
          <p>Formulas are parsed by CalcuMint. Arbitrary JavaScript, network calls, DOM access and dynamic code execution are not permitted.</p>
          <ul><li>Arithmetic and powers</li><li>Comparisons and boolean logic</li><li>IF, MIN, MAX, ABS, ROUND, FLOOR, CEIL</li><li>Outputs may reference earlier numeric outputs</li><li>Optional branded result charts</li></ul>
        </article>
      </div>

      {canEdit && (
        <form className="card form-stack builder-editor" action={saveCustomCalculatorVersion}>
          <input type="hidden" name="calculatorId" value={calculator.id} />
          <span className="eyebrow">Versioned editor</span><h2>Create the next version</h2>
          <label>Name<input name="name" required defaultValue={definition.name} /></label>
          <label>Description<textarea name="description" rows={3} defaultValue={definition.description} /></label>
          <label>Visibility<select name="visibility" defaultValue={definition.visibility}><option value="private">Private</option><option value="workspace">Workspace</option><option value="share-link">Share-link ready</option></select></label>
          <label>Brand / company name<input name="companyName" maxLength={120} defaultValue={definition.branding.companyName} /></label>
          <label>Logo URL<input name="logoUrl" type="url" defaultValue={definition.branding.logoUrl} /></label>
          <label>Accent color<input name="accentColor" pattern="#[0-9A-Fa-f]{6}" defaultValue={definition.branding.accentColor} /></label>
          <label>Input fields JSON<textarea name="fields" rows={14} defaultValue={JSON.stringify(definition.fields, null, 2)} spellCheck={false} /></label>
          <label>Outputs & formulas JSON<textarea name="outputs" rows={12} defaultValue={JSON.stringify(definition.outputs, null, 2)} spellCheck={false} /></label>
          <label>Charts JSON<textarea name="charts" rows={8} defaultValue={JSON.stringify(definition.charts, null, 2)} spellCheck={false} /></label>
          <label>Change note<input name="changeNote" maxLength={300} placeholder="Explain what changed" /></label>
          <button className="button primary" type="submit">Save as version {Number(calculator.current_version) + 1}</button>
        </form>
      )}

      <div className="account-grid section">
        <article className="card">
          <span className="eyebrow">Release</span><h2>Publish a tested version</h2>
          <p>Publishing points the calculator at a specific immutable version. Editing later creates another draft version. Share-link delivery itself is activated in B7.</p>
          {canEdit && <form action={publishCustomCalculator}><input type="hidden" name="calculatorId" value={calculator.id} /><input type="hidden" name="version" value={calculator.current_version} /><button className="button primary" type="submit">Publish version {calculator.current_version}</button></form>}
        </article>
        <article className="card">
          <span className="eyebrow">Version history</span><h2>Audit-friendly revisions</h2>
          <ul>{versions?.map((version) => <li key={version.version}><strong>v{version.version}</strong> · {version.change_note || "No note"} · {new Date(version.created_at).toLocaleString()}</li>)}</ul>
        </article>
      </div>
    </section>
  );
}
