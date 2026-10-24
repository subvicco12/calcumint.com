import {getProductPolicy} from '@/lib/product-mode-server';
import {FeatureUnavailable} from '@/components/feature-unavailable';
import type { Metadata } from "next";
import { AiFinder } from "@/components/ai-finder";

const fullMetadata: Metadata = { title: "AI Calculator Finder", description: "Describe what you need to calculate and let CalcuMint help you find the right verified calculator without replacing deterministic calculation logic.", alternates: { canonical: "/ai" }, openGraph: { type: "website", title: "AI Calculator Finder | CalcuMint", description: "Find the right verified CalcuMint calculator by describing what you need to calculate.", url: "/ai" } };
export function generateMetadata(): Metadata {
  return getProductPolicy().mode === 'full' ? fullMetadata : {title:'Feature unavailable',robots:{index:false,follow:false}};
}


export default function AiFinderPage() {
  if (!getProductPolicy().capabilities.aiAssistant) return <FeatureUnavailable/>;

  return (
    <section className="container page-top">
      <span className="eyebrow">CalcuMint AI</span>
      <h1>Describe the problem. Find the right calculator.</h1>
      <p className="hero-copy">AI can help route you to a verified CalcuMint calculator. It does not replace the deterministic calculation engine and it never invents a numeric answer.</p>
      <div className="section"><AiFinder /></div>
    </section>
  );
}
