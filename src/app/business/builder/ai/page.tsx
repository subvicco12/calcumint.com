import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { BuilderAiAssistant } from "@/components/builder-ai-assistant";

export const metadata = { title: "AI Builder Assistant" };

export default async function BuilderAiPage() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return <section className="container page-top"><h1>AI Builder requires Supabase configuration.</h1></section>;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("plan").eq("id", user.id).maybeSingle();
  if (profile?.plan !== "business") return <section className="container page-top"><span className="eyebrow">Business AI</span><h1>Business plan required.</h1><p className="hero-copy">AI-assisted calculator drafting is a Business capability.</p><Link className="button primary" href="/pricing">View Business plan</Link></section>;

  return <section className="container page-top business-page"><div className="section-heading"><div><span className="eyebrow">Business Builder AI</span><h1>Turn requirements into a validated draft.</h1><p className="hero-copy">AI proposes structure and formulas; the CalcuMint deterministic schema and formula engine remain authoritative.</p></div><Link className="button secondary" href="/business/builder">Back to builder</Link></div><BuilderAiAssistant /></section>;
}
