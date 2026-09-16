import type { Metadata } from "next";
import { AiFinder } from "@/components/ai-finder";

export const metadata: Metadata = { title: "AI Calculator Finder", description: "Describe what you need to calculate and let CalcuMint help you find the right verified calculator without replacing deterministic calculation logic.", alternates: { canonical: "/ai" }, openGraph: { type: "website", title: "AI Calculator Finder | CalcuMint", description: "Find the right verified CalcuMint calculator by describing what you need to calculate.", url: "/ai" } };

export default function AiFinderPage() {
  return (
    <section className="container page-top">
      <span className="eyebrow">CalcuMint AI</span>
      <h1>Describe the problem. Find the right calculator.</h1>
      <p className="hero-copy">AI can help route you to a verified CalcuMint calculator. It does not replace the deterministic calculation engine and it never invents a numeric answer.</p>
      <div className="section"><AiFinder /></div>
    </section>
  );
}
