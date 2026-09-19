import { afterEach, describe, expect, it } from "vitest";
import { clearRulePackRegistry, listRulePacks, registerRulePack, selectRulePack } from "./rule-packs";

afterEach(clearRulePackRegistry);

const source = [{ label: "Official source", url: "https://example.gov/rules" }] as const;

describe("rule-pack registry", () => {
  it("selects the rule version effective on the requested date", () => {
    registerRulePack({ id: "sample", jurisdiction: { country: "IN" }, ruleVersion: "2025", effectiveFrom: "2025-04-01", effectiveTo: "2026-03-31", taxYear: "2025-26", currency: "INR", officialSources: source, lastVerifiedAt: "2026-01-01" });
    registerRulePack({ id: "sample", jurisdiction: { country: "IN" }, ruleVersion: "2026", effectiveFrom: "2026-04-01", taxYear: "2026-27", currency: "INR", officialSources: source, lastVerifiedAt: "2026-09-01" });
    expect(selectRulePack({ jurisdiction: { country: "IN" }, id: "sample", asOf: "2026-02-01" })?.ruleVersion).toBe("2025");
    expect(selectRulePack({ jurisdiction: { country: "IN" }, id: "sample", asOf: "2026-09-17" })?.ruleVersion).toBe("2026");
  });

  it("supports explicit version and tax-year selection", () => {
    registerRulePack({ id: "sample", jurisdiction: { country: "GB" }, ruleVersion: "v1", effectiveFrom: "2026-04-06", taxYear: "2026-27", currency: "GBP", officialSources: source, lastVerifiedAt: "2026-09-01" });
    expect(selectRulePack({ jurisdiction: { country: "GB" }, id: "sample", ruleVersion: "v1", taxYear: "2026-27", asOf: "2026-09-17" })?.currency).toBe("GBP");
  });

  it("rejects duplicates and invalid effective ranges", () => {
    const pack = { id: "sample", jurisdiction: { country: "US" }, ruleVersion: "v1", effectiveFrom: "2026-01-01", officialSources: source, lastVerifiedAt: "2026-09-01" } as const;
    registerRulePack(pack);
    expect(() => registerRulePack(pack)).toThrow(/Duplicate/);
    expect(() => registerRulePack({ ...pack, id: "bad", effectiveFrom: "2026-12-01", effectiveTo: "2026-01-01" })).toThrow(/effectiveTo/);
    expect(listRulePacks({ country: "US" })).toHaveLength(1);
  });
  it("rejects rollover and impossible calendar dates",()=>{const base={id:"calendar",jurisdiction:{country:"CA"},ruleVersion:"v1",effectiveFrom:"2026-01-01",officialSources:source,lastVerifiedAt:"2026-09-01"} as const;expect(()=>registerRulePack({...base,effectiveFrom:"2026-02-30"})).toThrow(/valid YYYY-MM-DD/);expect(()=>registerRulePack({...base,effectiveFrom:"2026-13-01"})).toThrow(/valid YYYY-MM-DD/);expect(()=>selectRulePack({jurisdiction:{country:"CA"},asOf:"2026-02-30"})).toThrow(/valid YYYY-MM-DD/)});
  it("rejects country packs without jurisdiction or official provenance",()=>{expect(()=>registerRulePack({...pack,jurisdiction:{country:" "}})).toThrow(/country/);expect(()=>registerRulePack({...pack,officialSources:[]})).toThrow(/official source/)});
});
