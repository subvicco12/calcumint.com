import { afterEach, describe, expect, it } from "vitest";
import { clearTaxonomyRegistry, getJourney, listCategories, listJourneys, registerCategory, registerCoreTaxonomy, registerJourney } from "./taxonomy";

afterEach(clearTaxonomyRegistry);

describe("calculator taxonomy", () => {
  it("registers the global core taxonomy and journeys", () => {
    registerCoreTaxonomy();
    expect(listCategories().map((category) => category.id)).toContain("finance");
    expect(listCategories().map((category) => category.id)).toContain("health");
    expect(getJourney("buy-a-home")?.calculatorSlugs).toContain("mortgage-payment");
    expect(listJourneys().length).toBeGreaterThanOrEqual(5);
  });

  it("supports country-specific categories while retaining global categories", () => {
    registerCategory({ id: "tax", title: "Tax" });
    registerCategory({ id: "india-tax", title: "India Tax", parentId: "tax", country: "IN" });
    expect(listCategories("IN").map((category) => category.id)).toEqual(["tax", "india-tax"]);
    expect(listCategories("US").map((category) => category.id)).toEqual(["tax"]);
  });

  it("completes core taxonomy after partial custom initialization",()=>{registerCategory({id:"finance",title:"Custom Finance"});registerJourney({id:"custom",title:"Custom Journey",calculatorSlugs:["custom-calculator"]});registerCoreTaxonomy();const ids=listCategories().map(c=>c.id);expect(ids).toContain("loans");expect(ids).toContain("health");expect(listCategories().find(c=>c.id==="finance")?.title).toBe("Custom Finance");expect(getJourney("custom")?.calculatorSlugs).toEqual(["custom-calculator"]);expect(getJourney("buy-a-home")).toBeDefined();expect(()=>registerCoreTaxonomy()).not.toThrow()});

  it("validates hierarchy, duplicate ids and journey members", () => {
    expect(() => registerCategory({ id: "child", title: "Child", parentId: "missing" })).toThrow(/Unknown parent/);
    registerCategory({ id: "finance", title: "Finance" });
    expect(() => registerCategory({ id: "finance", title: "Duplicate" })).toThrow(/Duplicate/);
    expect(() => registerJourney({ id: "empty", title: "Empty", calculatorSlugs: [] })).toThrow(/at least one/);
    expect(() => registerJourney({ id: "duplicate-members", title: "Bad", calculatorSlugs: ["sip", "sip"] })).toThrow(/unique/);
  });
});
