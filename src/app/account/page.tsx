import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { signOut } from "@/app/login/actions";
import { updatePreferences } from "./actions";

export default async function AccountPage() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return (
      <section className="container page-top">
        <span className="eyebrow">Account foundation</span>
        <h1>Authentication is ready for configuration.</h1>
        <p className="hero-copy">Add the Supabase project URL and public anon key to the deployment environment to activate secure accounts.</p>
      </section>
    );
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { data: preferences }, { data: favorites }, { data: history }] = await Promise.all([
    supabase.from("profiles").select("display_name,plan,created_at").eq("id", user.id).maybeSingle(),
    supabase.from("user_preferences").select("locale,currency,unit_system").eq("user_id", user.id).maybeSingle(),
    supabase.from("favorites").select("calculator_slug,created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(12),
    supabase.from("calculation_history").select("id,calculator_slug,calculator_version,created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(10)
  ]);

  return (
    <section className="container page-top account-page">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Free account</span>
          <h1>{profile?.display_name ? `Welcome, ${profile.display_name}` : "Your CalcuMint account"}</h1>
          <p className="hero-copy">{user.email}</p>
        </div>
        <form action={signOut}><button className="button secondary" type="submit">Sign out</button></form>
      </div>

      <div className="account-grid">
        <div className="card">
          <span className="eyebrow">Plan</span>
          <h2>{String(profile?.plan ?? "free").toUpperCase()}</h2>
          <p>Your account currently uses the Free tier. Pro and Business billing will be connected in B4.</p>
          <Link className="button secondary" href="/pricing">Compare plans</Link>
        </div>

        <form className="card form-stack" action={updatePreferences}>
          <span className="eyebrow">Preferences</span>
          <h2>Regional defaults</h2>
          <label>Locale<input name="locale" defaultValue={preferences?.locale ?? "en"} maxLength={16} /></label>
          <label>Currency<input name="currency" defaultValue={preferences?.currency ?? "USD"} maxLength={8} /></label>
          <label>Unit system<select name="unitSystem" defaultValue={preferences?.unit_system ?? "metric"}><option value="metric">Metric</option><option value="us">US customary</option></select></label>
          <button className="button primary" type="submit">Save preferences</button>
        </form>
      </div>

      <div className="account-grid section">
        <div className="card">
          <span className="eyebrow">Favorites</span>
          <h2>Saved calculators</h2>
          {favorites && favorites.length > 0 ? (
            <ul>{favorites.map((item) => <li key={item.calculator_slug}><Link className="text-link" href={`/calculators?search=${encodeURIComponent(item.calculator_slug)}`}>{item.calculator_slug}</Link></li>)}</ul>
          ) : <p>No favorites yet. Use the Favorite control on any certified calculator.</p>}
        </div>

        <div className="card">
          <span className="eyebrow">History</span>
          <h2>Recent calculations</h2>
          {history && history.length > 0 ? (
            <ul>{history.map((item) => <li key={item.id}><Link className="text-link" href={`/calculators?search=${encodeURIComponent(item.calculator_slug)}`}>{item.calculator_slug}</Link> · v{item.calculator_version}</li>)}</ul>
          ) : <p>No cloud calculation history yet. Sign in on a calculator and choose Save calculation.</p>}
        </div>
      </div>
    </section>
  );
}
