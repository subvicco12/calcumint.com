import { AiFinder } from "@/components/ai-finder";

export const metadata = { title: "AI Calculator Finder" };

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
