// @vitest-environment jsdom
import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
const publication = vi.hoisted(() => ({ state: "available", slugs: new Set<string>() }));
vi.mock("@/lib/publication-manifest", () => ({ getPublicationSnapshot: async () => publication }));
import DirectoryPage from "./page";
afterEach(cleanup);
beforeEach(() => { publication.state = "available"; publication.slugs = new Set(["sip-calculator", "loan-emi-calculator"]); });
describe("directory account-link search parameters", () => {
  it("initializes a saved-calculator URL query from awaited searchParams", async () => {
    render(await DirectoryPage({ searchParams: Promise.resolve({ search: "sip-calculator" }) }));
    expect((screen.getByRole("searchbox") as HTMLInputElement).value).toBe("sip-calculator");
    const links = within(screen.getByRole("list", { name: "Calculator search results" })).getAllByRole("link");
    expect(links.some(link => link.getAttribute("href") === "/calculators/finance-investment/sip-calculator")).toBe(true);
  });
  it("drops withdrawn matches when the same saved URL is revisited", async () => {
    const view = render(await DirectoryPage({ searchParams: Promise.resolve({ search: "sip" }) }));
    expect(screen.getByRole("list", { name: "Calculator search results" })).toBeTruthy();
    publication.slugs = new Set(["loan-emi-calculator"]);
    view.rerender(await DirectoryPage({ searchParams: Promise.resolve({ search: "sip" }) }));
    expect(screen.queryByRole("list", { name: "Calculator search results" })).toBeNull();
    expect(screen.getByText("No calculators match that search.")).toBeTruthy();
  });
  it.each([undefined, ["sip", "loan"], null, 42])("ignores missing or invalid query values: %s", async (search) => {
    render(await DirectoryPage({ searchParams: Promise.resolve({ search } as {search?: string | string[]}) }));
    expect((screen.getByRole("searchbox") as HTMLInputElement).value).toBe("");
    expect(screen.queryByRole("list", {name:"Calculator search results"})).toBeNull();
  });
  it("never restores an unpublished or draft route from its URL query", async () => {
    publication.slugs = new Set(["bmi-calculator"]);
    render(await DirectoryPage({ searchParams: Promise.resolve({ search: "bmi-calculator" }) }));
    expect(screen.getByText("No calculators match that search.")).toBeTruthy();
    expect(screen.queryByRole("list", {name:"Calculator search results"})).toBeNull();
  });
});
