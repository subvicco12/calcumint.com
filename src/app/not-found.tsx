import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Page not found", description: "The requested CalcuMint page could not be found.", robots: { index: false, follow: true } };

export default function NotFound() {
  return (
    <section className="container page-top">
      <span className="eyebrow">404</span>
      <h1>We could not find that page.</h1>
      <p className="hero-copy">The link may be outdated or the calculator may not be published yet.</p>
      <div className="button-row">
        <Link className="button primary" href="/calculators">Browse calculators</Link>
        <Link className="button secondary" href="/ai">Find a calculator</Link>
      </div>
    </section>
  );
}
