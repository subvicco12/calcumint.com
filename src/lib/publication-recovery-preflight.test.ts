import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const script = readFileSync("scripts/publication-recovery-preflight.mjs", "utf8");

describe("publication recovery preflight", () => {
  it("is read-only and checks the governed production dependencies", () => {
    expect(script).toContain('from("platform_admins")');
    expect(script).toContain('from("calculator_catalog_admin")');
    expect(script).toContain('rpc("list_published_calculator_manifest")');
    expect(script).not.toContain(".insert(");
    expect(script).not.toContain(".update(");
    expect(script).not.toContain(".delete(");
  });

  it("fails readiness when no active administrator exists", () => {
    expect(script).toContain("readyForInventoryImport: (adminCount ?? 0) > 0");
    expect(script).toContain("process.exitCode = 2");
  });
});
