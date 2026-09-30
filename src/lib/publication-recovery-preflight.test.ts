import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const script = readFileSync("scripts/publication-recovery-preflight.mjs", "utf8");

describe("publication recovery preflight", () => {
  it("is read-only and checks the governed production dependencies", () => {
    expect(script).toContain('from("platform_admins")');
    expect(script).toContain('from("calculator_catalog_admin")');
    expect(script).toContain('from("calculator_source_evidence")');
    expect(script).toContain('from("calculator_qa_checks")');
    expect(script).toContain('rpc("list_published_calculator_manifest")');
    expect(script).not.toContain(".insert(");
    expect(script).not.toContain(".update(");
    expect(script).not.toContain(".delete(");
  });

  it("requires exactly one active owner before inventory recovery", () => {
    expect(script).toContain('eq("role", "owner")');
    expect(script).toContain("readyForInventoryImport: (ownerCount ?? 0) === 1");
    expect(script).toContain("process.exitCode = 2");
  });

  it("reports evidence and QA population without mutating it", () => {
    expect(script).toContain("sourceEvidenceRows: sourceEvidenceCount ?? 0");
    expect(script).toContain("qaRows: qaCheckCount ?? 0");
    expect(script).toContain("publishedCatalogRows: publishedCount ?? 0");
    expect(script).toContain("publicationManifestConsistent:");
  });
});
