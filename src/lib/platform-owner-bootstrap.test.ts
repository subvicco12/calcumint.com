import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const script = readFileSync("scripts/bootstrap-platform-owner.mjs", "utf8");

describe("platform owner bootstrap operations guard", () => {
  it("requires explicit owner identity and service-role credentials", () => {
    expect(script).toContain('required("CALCUMINT_OWNER_EMAIL")');
    expect(script).toContain('required("SUPABASE_SERVICE_ROLE_KEY")');
    expect(script).toContain('required("NEXT_PUBLIC_SUPABASE_URL")');
  });

  it("defaults to dry-run and requires an explicit apply flag", () => {
    expect(script).toContain('process.argv.includes("--apply")');
    expect(script).toContain("Dry run only.");
  });

  it("requires exactly one confirmed auth user and refuses owner replacement", () => {
    expect(script).toContain("matches.length !== 1");
    expect(script).toContain("email_confirmed_at");
    expect(script).toContain("An active owner already exists");
  });

  it("writes only the platform owner role after all guards pass", () => {
    expect(script).toContain('.from("platform_admins").insert');
    expect(script).toContain('role: "owner"');
    expect(script).not.toContain("calculator_catalog_admin");
    expect(script).not.toContain("calculator_qa_checks");
  });
});
