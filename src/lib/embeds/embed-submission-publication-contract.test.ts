import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/** Static regression contract for the server-only public embed submission boundaries. */
describe("public embed submission publication boundary", () => {
  for (const route of ["events", "leads"]) {
    it(`${route} rejects unpublished or cross-organization custom calculators before writes`, () => {
      const source = readFileSync(join(process.cwd(), "src/app/api/embed/[key]", route, "route.ts"), "utf8");
      expect(source).toContain('verifyEmbedSession(request.headers.get("x-embed-session")');
      expect(source).toContain("session.configId !== config.id");
      expect(source).toContain("session.organizationId !== config.organization_id");
      expect(source).toContain("session.calculatorId !== config.calculator_id");
      expect(source).toContain("session.version !== calculator.published_version");
      expect(source).toContain('.from("custom_calculators")');
      expect(source).toContain('.eq("id", config.calculator_id)');
      expect(source).toContain('.eq("organization_id", config.organization_id)');
      expect(source).toContain('.eq("status", "published")');
      expect(source).toContain('!calculator?.published_version');
      expect(source.indexOf('!calculator?.published_version')).toBeLessThan(source.indexOf('.insert('));
    });
  }
});
