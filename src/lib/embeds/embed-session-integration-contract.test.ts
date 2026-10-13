import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function source(path: string) { return readFileSync(join(process.cwd(), path), "utf8"); }

describe("embed session integration contracts", () => {
  it("mints a token only after embed authorization and publication checks", () => {
    const page = source("src/app/embed/[key]/page.tsx");
    expect(page.indexOf("isEmbedRequestAllowed(")).toBeLessThan(page.indexOf("issueEmbedSession("));
    expect(page.indexOf("customCalculatorSchema.safeParse(")).toBeLessThan(page.indexOf("issueEmbedSession("));
    expect(page).toContain("sessionToken={sessionToken}");
    expect(page).not.toContain("Date.now()");
  });
  it("renews only a valid, matching, still-published session", () => {
    const route = source("src/app/api/embed/[key]/session/route.ts");
    expect(route).toContain("verifyEmbedSession(");
    expect(route).toContain("config.id !== claims.configId");
    expect(route).toContain("config.organization_id !== claims.organizationId");
    expect(route).toContain("config.calculator_id !== claims.calculatorId");
    expect(route).toContain('.eq("status", "published")');
    expect(route).toContain("calculator.published_version !== claims.version");
    expect(route.indexOf("calculator.published_version !== claims.version")).toBeLessThan(route.indexOf("signEmbedSession("));
  });
  it("sends the token with lead and event requests and disables lead submission on renewal failure", () => {
    const component = source("src/components/public-embed-calculator.tsx");
    expect(component).toContain("X-Embed-Session");
    expect(component).toContain("/session");
    expect(component).toContain("setSessionAvailable(false)");
    expect(component).toContain("disabled={!sessionAvailable}");
  });
});
