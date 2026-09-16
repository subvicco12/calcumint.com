import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About CalcuMint",
  description: "Learn how CalcuMint builds deterministic, versioned and source-documented calculators, with AI used only as an assistant around verified calculation results.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About CalcuMint",
    description: "CalcuMint's approach to reliable calculators, transparent methodology and responsible AI assistance.",
    url: "/about",
    type: "website"
  }
};

export default function AboutPage() {
  return (
    <main className="container page-stack">
      <header className="page-header">
        <p className="eyebrow">About CalcuMint</p>
        <h1>Calculation tools built around verifiable math</h1>
        <p>
          CalcuMint is a universal calculation platform designed to make useful calculators easy to discover,
          understand and reuse without hiding the underlying method.
        </p>
      </header>

      <section className="card page-stack">
        <h2>How our calculators are built</h2>
        <p>
          Public calculators use deterministic calculation logic: the same valid inputs produce the same outputs.
          Calculation definitions are versioned and tested, with formulas, worked examples, assumptions and sources
          published where they are relevant to the result.
        </p>
        <p>
          Formula changes are treated as calculation changes rather than invisible content edits. Higher-risk topics
          require stronger source and review information before publication.
        </p>
      </section>

      <section className="card page-stack">
        <h2>AI assists; it does not replace verified arithmetic</h2>
        <p>
          CalcuMint may use AI to help people find calculators, understand verified results, compare scenarios or build
          workflows. AI is not the calculation engine and does not replace deterministic calculator logic.
        </p>
      </section>

      <section className="card page-stack">
        <h2>Transparency and user control</h2>
        <p>
          Calculator pages are designed to show the information needed to interpret an output: purpose, inputs,
          results, formula or methodology, assumptions, examples and supporting sources. Calculators are tools for
          information and planning; professional advice may still be appropriate for consequential decisions.
        </p>
        <div className="button-row">
          <Link className="button button-primary" href="/calculators">Browse calculators</Link>
          <Link className="button button-secondary" href="/contact">Contact CalcuMint</Link>
        </div>
      </section>
    </main>
  );
}
