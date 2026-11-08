import { afterEach, describe, expect, it, vi } from "vitest";
import { calculatorRegistry } from "@/calculators/registry";
const state = vi.hoisted(() => ({ rpc: vi.fn() }));
vi.mock("server-only", () => ({}));
vi.mock("@/lib/env", () => ({ publicEnv: { NEXT_PUBLIC_SUPABASE_URL: "https://synthetic.invalid", NEXT_PUBLIC_SUPABASE_ANON_KEY: "synthetic" } }));
vi.mock("@supabase/supabase-js", () => ({ createClient: () => ({ rpc: state.rpc }) }));
import { getPublicationSnapshot } from "./publication-manifest";
import { getPublicCalculatorRoute } from "./public-calculator-route";
import { listGovernedPublicCalculators } from "@/calculators/public-content";
import sitemap from "@/app/sitemap";
const candidates = [
  { id: "conversion.frequency", slug: "frequency-converter", version: 1 },
  { id: "conversion.time", slug: "time-converter", version: 1 }
] as const;
afterEach(() => { vi.restoreAllMocks(); state.rpc.mockReset(); });
describe("isolated first-pilot route and discovery composition (not approval)", () => {
  it.each(candidates)("retains actual $id draft refusal even with a positive hosted tuple", async candidate => {
    expect(calculatorRegistry.getBySlug(candidate.slug)?.reviewStatus).toBe("draft");
    state.rpc.mockResolvedValue({ data: [{ calculator_key: candidate.id, slug: candidate.slug, version: 1 }], error: null });
    expect((await getPublicationSnapshot()).slugs.has(candidate.slug)).toBe(false);
    expect((await getPublicCalculatorRoute("unit-conversions", candidate.slug)).state).toBe("blocked");
    expect((await sitemap()).some(x => x.url.endsWith("/" + candidate.slug))).toBe(false);
    expect(state.rpc).toHaveBeenCalledWith("list_published_calculator_manifest");
  });
  it.each(candidates)("conditionally synchronizes exact $id route/discovery/sitemap and withdrawal", async candidate => {
    // Only an in-memory certification fixture; registered definitions remain DRAFT.
    const originals = calculatorRegistry.list();
    const definitions = originals.map(d => d.id === candidate.id ? { ...d, reviewStatus: "certified" as const } : d);
    vi.spyOn(calculatorRegistry, "list").mockReturnValue(definitions);
    vi.spyOn(calculatorRegistry, "getBySlug").mockImplementation(slug => definitions.find(d => d.slug === slug));
    const tuple = { calculator_key: candidate.id, slug: candidate.slug, version: 1 };
    for (const data of [[{ ...tuple, version: 2 }], [{ ...tuple, calculator_key: "forged" }], [], null]) {
      state.rpc.mockResolvedValue({ data, error: null });
      expect((await getPublicCalculatorRoute("unit-conversions", candidate.slug)).state).toBe("blocked");
      expect((await sitemap()).some(x => x.url.endsWith("/" + candidate.slug))).toBe(false);
    }
    state.rpc.mockResolvedValue({ data: [tuple], error: null });
    expect(await getPublicCalculatorRoute("unit-conversions", candidate.slug)).toMatchObject({ state: "ready", path: `/calculators/unit-conversions/${candidate.slug}` });
    const snapshot = await getPublicationSnapshot();
    expect(listGovernedPublicCalculators(snapshot.slugs).map(d => d.slug)).toEqual([candidate.slug]);
    expect((await sitemap()).filter(x => x.url.endsWith("/" + candidate.slug))).toHaveLength(1);
    const other = candidates.find(x => x.id !== candidate.id)!;
    expect((await getPublicCalculatorRoute("unit-conversions", other.slug)).state).toBe("blocked");
    state.rpc.mockResolvedValue({ data: [], error: null });
    expect((await getPublicCalculatorRoute("unit-conversions", candidate.slug)).state).toBe("blocked");
    expect(listGovernedPublicCalculators((await getPublicationSnapshot()).slugs)).toEqual([]);
    expect((await sitemap()).some(x => x.url.endsWith("/" + candidate.slug))).toBe(false);
    expect(originals.find(d => d.id === candidate.id)?.reviewStatus).toBe("draft");
  });
});
