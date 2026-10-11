// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { getPublicCalculatorContent } from "@/calculators/public-content";
const authority = vi.hoisted(() => ({ state: "available", slugs: new Set<string>() }));
vi.mock("@/lib/publication-manifest", () => ({ getPublicationSnapshot: async () => authority, getPublishedCalculatorSlugs: async () => authority.slugs }));
vi.mock("next/navigation", () => ({ notFound: () => { throw new Error("NOT_FOUND"); }, usePathname: () => "/calculators" }));
vi.mock("@/components/calculator-interactive", () => ({ CalculatorInteractive: () => <div>Calculator interface</div> }));
vi.mock("@/components/free-user-ad-slot", () => ({ FreeUserAdSlot: () => null }));
import HomePage from "./page";
import DirectoryPage from "./calculators/page";
import CategoryPage from "./calculators/[category]/page";
import DetailPage, { generateMetadata } from "./calculators/[category]/[slug]/page";
import sitemap from "./sitemap";

afterEach(cleanup);
const calculatorPaths = () => [...document.querySelectorAll<HTMLAnchorElement>("a")].map(link => link.getAttribute("href")!).filter(path => /^\/calculators\/[^/]+\/[^/]+$/.test(path));
describe("actual governed public discovery surfaces", () => {
  it("uses the same certified manifest intersection for home, directory, category, detail, country links and sitemap", async () => {
    authority.state = "available"; authority.slugs = new Set(["loan-emi-calculator", "sip-calculator", "bmi-calculator", "unknown-draft"]);
    const paths = ["loan-emi-calculator", "sip-calculator"].map(slug => { const content = getPublicCalculatorContent(slug)!; return `/calculators/${content.category}/${slug}`; });
    render(await HomePage()); expect([...new Set(calculatorPaths())].sort()).toEqual(paths.sort()); cleanup();
    render(await DirectoryPage()); expect([...new Set(calculatorPaths())].sort()).toEqual(paths.sort()); cleanup();
    const content = getPublicCalculatorContent("sip-calculator")!;
    render(await CategoryPage({ params: Promise.resolve({ category: content.category }) }));
    expect([...new Set(calculatorPaths())]).toEqual([`/calculators/${content.category}/sip-calculator`]); cleanup();
    render(await DetailPage({ params: Promise.resolve({ category: content.category, slug: content.slug }) }));
    expect(screen.getByRole("heading", { level: 1 }).textContent).toContain("SIP"); cleanup();
    const entries = await sitemap();
    expect(entries.map(entry => new URL(entry.url).pathname).filter(path => /^\/calculators\/[^/]+\/[^/]+$/.test(path)).sort()).toEqual(paths.sort());
  });
  it("distinguishes unknown availability from zero without fallback calculator links or global availability claims", async () => {
    authority.state = "unavailable"; authority.slugs = new Set();
    for (const page of [HomePage, DirectoryPage]) {
      render(await page());
      expect(screen.getByText(/Calculator availability is temporarily unavailable/)).toBeTruthy();
      expect(document.body.textContent).not.toContain("0 published tools");
      expect(document.body.textContent).not.toContain("Global certified calculators remain available");
      expect(calculatorPaths()).toEqual([]); cleanup();
    }
    expect((await sitemap()).some(entry => /\/calculators\/[^/]+/.test(new URL(entry.url).pathname))).toBe(false);
  });
  it("reports an authoritative empty library as empty and blocks category/detail routes", async () => {
    authority.state = "available"; authority.slugs = new Set();
    render(await DirectoryPage()); expect(screen.getByText(/No calculators are currently published/)).toBeTruthy(); cleanup();
    await expect(CategoryPage({ params: Promise.resolve({ category: "finance-investment" }) })).rejects.toThrow("NOT_FOUND");
    await expect(DetailPage({ params: Promise.resolve({ category: "finance-investment", slug: "sip-calculator" }) })).rejects.toThrow("NOT_FOUND");
  });
  it("keeps canonical metadata, detail and sitemap aligned as published routes are withdrawn", async () => {
    const params = Promise.resolve({ category: "finance-investment", slug: "sip-calculator" });
    authority.state = "available"; authority.slugs = new Set(["sip-calculator"]);
    expect((await generateMetadata({ params })).alternates?.canonical).toBe("/calculators/finance-investment/sip-calculator");
    expect((await sitemap()).some(entry => entry.url.endsWith("/finance-investment/sip-calculator"))).toBe(true);
    for (const state of ["available", "unavailable"]) {
      authority.state = state; authority.slugs = new Set();
      expect(await generateMetadata({ params })).toEqual({});
      await expect(DetailPage({ params })).rejects.toThrow("NOT_FOUND");
      expect((await sitemap()).some(entry => entry.url.endsWith("/sip-calculator"))).toBe(false);
    }
    authority.state = "available"; authority.slugs = new Set(["sip-calculator"]);
    expect(await generateMetadata({ params: Promise.resolve({ category: "math", slug: "sip-calculator" }) })).toEqual({});
  });
  it("rejects draft, unpublished and wrong-category details even when slugs are supplied", async () => {
    authority.state = "available"; authority.slugs = new Set(["bmi-calculator", "sip-calculator"]);
    for (const params of [{ category: "health", slug: "bmi-calculator" }, { category: "business", slug: "break-even-calculator" }, { category: "math", slug: "sip-calculator" }]) {
      await expect(DetailPage({ params: Promise.resolve(params) })).rejects.toThrow("NOT_FOUND");
    }
  });
});
