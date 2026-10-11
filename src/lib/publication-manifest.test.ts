import { beforeEach, describe, expect, it, vi } from "vitest";
import { calculatorRegistry } from "@/calculators/registry";

const state = vi.hoisted(() => ({ env: { NEXT_PUBLIC_SUPABASE_URL: "https://example.invalid" as string | undefined, NEXT_PUBLIC_SUPABASE_ANON_KEY: "synthetic-key" as string | undefined }, rpc: vi.fn() }));
vi.mock("server-only", () => ({}));
vi.mock("@/lib/env", () => ({ publicEnv: state.env }));
vi.mock("@supabase/supabase-js", () => ({ createClient: () => ({ rpc: state.rpc }) }));
import { getPublicationSnapshot, getPublishedCalculatorSlugs } from "./publication-manifest";

beforeEach(() => { state.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.invalid"; state.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "synthetic-key"; state.rpc.mockReset(); });
describe("publication availability evidence", () => {
  it("distinguishes an authoritative empty manifest from unavailable authority", async () => {
    state.rpc.mockResolvedValue({ data: [], error: null });
    expect(await getPublicationSnapshot()).toEqual({ state: "available", slugs: new Set() });
    state.rpc.mockResolvedValue({ data: null, error: { message: "synthetic failure" } });
    expect(await getPublicationSnapshot()).toEqual({ state: "unavailable", slugs: new Set() });
    expect(await getPublishedCalculatorSlugs()).toEqual(new Set());
  });
  it("fails closed when configuration is absent, data malformed or transport throws", async () => {
    state.env.NEXT_PUBLIC_SUPABASE_URL = undefined;
    expect((await getPublicationSnapshot()).state).toBe("unavailable");
    expect(state.rpc).not.toHaveBeenCalled();
    state.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.invalid";
    state.rpc.mockResolvedValue({ data: {}, error: null });
    expect((await getPublicationSnapshot()).state).toBe("unavailable");
    state.rpc.mockRejectedValue(new Error("synthetic transport failure"));
    expect((await getPublicationSnapshot()).state).toBe("unavailable");
  });
  it("requires manifest identity/version and repository certification; a forged draft slug grants nothing", async () => {
    const loan = calculatorRegistry.getBySlug("loan-emi-calculator")!;
    const bmi = calculatorRegistry.getBySlug("bmi-calculator")!;
    state.rpc.mockResolvedValue({ data: [{ calculator_key: loan.id, slug: loan.slug, version: loan.version }, { calculator_key: bmi.id, slug: bmi.slug, version: bmi.version }, { calculator_key: "forged", slug: "compound-interest-calculator", version: 1 }], error: null });
    const snapshot = await getPublicationSnapshot();
    expect(snapshot.state).toBe("available");
    expect(snapshot.slugs).toEqual(new Set([loan.slug]));
    expect(bmi.reviewStatus).toBe("draft");
  });
});
