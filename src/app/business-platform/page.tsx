import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Business Calculator Platform",
  description: "Build, brand, share and automate calculators with team workspaces, embeds, API access, leads and client reporting on CalcuMint Business.",
  alternates: { canonical: "/business-platform" },
  openGraph: { type: "website", title: "CalcuMint Business Calculator Platform", description: "Build, brand, collaborate and automate with CalcuMint Business.", url: "/business-platform" }
};

const capabilities = [
  ["Build", "Create private or public calculators with the no-code builder, reusable templates, validation and controlled formula logic."],
  ["Brand", "Publish branded calculators, white-label embeds and professional client-facing exports."],
  ["Collaborate", "Use organization workspaces, shared projects, team roles and client workspaces with auditable access."],
  ["Automate", "Connect calculators to API, webhooks, bulk workflows, scheduled automation, lead capture and reporting."]
];

export default function BusinessPlatformPage() {
  return <>
    <section className="container page-top"><span className="eyebrow">CalcuMint Business</span><h1>Build, brand, collaborate and automate calculators.</h1><p className="hero-copy">CalcuMint Business turns the verified calculation platform into a team workspace for organizations that need reusable calculators, branded experiences, integrations and repeatable client workflows.</p><div className="hero-actions"><Link className="button primary" href="/pricing">Compare Business pricing</Link><Link className="button secondary" href="/business">Open Business workspace</Link></div></section>
    <section className="container section"><div className="section-heading"><span className="eyebrow">Business capabilities</span><h2>More than a larger Pro plan</h2><p>Business is designed around organizational workflows: build calculation tools, control how they are presented, work with a team and connect results to downstream systems.</p></div><div className="card-grid">{capabilities.map(([title, description]) => <article className="card" key={title}><h3>{title}</h3><p>{description}</p></article>)}</div></section>
    <section className="container section"><div className="card"><span className="eyebrow">Verified calculation core</span><h2>Automation does not replace the arithmetic.</h2><p>Business workflows use the same deterministic, versioned calculation architecture as CalcuMint&apos;s public calculators. AI can assist with discovery, explanations, builder workflows and report narratives, while verified calculation logic remains authoritative.</p></div></section>
    <section className="container section"><div className="card business-card"><span className="eyebrow">Ready for a team workflow?</span><h2>Start with Business and expand as your calculator library grows.</h2><p>Business includes the platform layer for team workspaces, branded and batch outputs, private calculators, embeds, integrations and automation.</p><div className="hero-actions"><Link className="button primary" href="/pricing">View Business plan</Link><Link className="text-link" href="/calculators">Explore the calculation platform →</Link></div></div></section>
  </>;
}
