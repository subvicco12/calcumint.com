import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { signOut } from "@/app/login/actions";
import { updatePreferences } from "./actions";
import { BillingSyncStatus } from "@/components/billing-sync-status";

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ billing?: string; plan?: string; interval?: string }> }) {
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

  const [{ data: profile }, { data: preferences }, { data: favorites }, { data: history }, { data: subscription }] = await Promise.all([
    supabase.from("profiles").select("display_name,plan,created_at").eq("id", user.id).maybeSingle(),
    supabase.from("user_preferences").select("locale,currency,unit_system").eq("user_id", user.id).maybeSingle(),
    supabase.from("favorites").select("calculator_slug,created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(12),
    supabase.from("calculation_history").select("id,calculator_slug,calculator_version,created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(10),
    supabase.from("subscriptions").select("plan,billing_interval,status,current_period_end,cancel_at_period_end").eq("user_id", user.id).order("updated_at", { ascending: false }).limit(1).maybeSingle()
  ]);

  const plan = String(profile?.plan ?? "free");
  const query = await searchParams;
  const requestedPlan = query.plan === "pro" || query.plan === "business" ? query.plan : null;
  const requestedInterval = query.interval === "monthly" || query.interval === "yearly" ? query.interval : null;
  const billingSyncPending = query.billing === "updated"
    && requestedPlan !== null
    && requestedInterval !== null
    && (subscription?.plan !== requestedPlan || subscription?.billing_interval !== requestedInterval);

  return (
    <section className="container page-top account-page">
      <div className="section-heading">
        <div>
          <span className="eyebrow">{plan === "free" ? "Free account" : `${plan} account`}</span>
          <h1>{profile?.display_name ? `Welcome, ${profile.display_name}` : "Your CalcuMint account"}</h1>
          <p className="hero-copy">{user.email}</p>
        </div>
        <form action={signOut}><button className="button secondary" type="submit">Sign out</button></form>
      </div>

      {billingSyncPending && <BillingSyncStatus />}

      <div className="account-grid">
        <div className="card">
          <span className="eyebrow">Plan</span>
          <h2>{plan.toUpperCase()}</h2>
          {subscription ? (
            <>
              <p>{String(subscription.status).replaceAll("_", " ")} · {subscription.billing_interval ?? "billing interval unavailable"}</p>
              {subscription.current_period_end && <p className="muted-copy">Current term ends {new Date(subscription.current_period_end).toLocaleDateString()}.</p>}
              {subscription.cancel_at_period_end && <p className="muted-copy">Cancellation is scheduled for the end of the current term.</p>}
            </>
          ) : <p>{plan === "free" ? "Free includes public calculators, 20 saved calculations and 10 favorites." : "Paid entitlement is active; billing details will appear after Paddle synchronization."}</p>}
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
