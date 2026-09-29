import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const migration = fs.readFileSync(
  path.join(process.cwd(), "supabase/migrations/034_billing_webhook_event_privileges.sql"),
  "utf8"
).toLowerCase();

const statements = migration
  .split(";")
  .map((statement) => statement.replace(/^\s*--.*$/gm, "").trim())
  .filter(Boolean);

describe("billing webhook event ledger privileges", () => {
  it("revokes all direct client table privileges", () => {
    expect(statements).toContain(
      "revoke all privileges on table public.billing_webhook_events from anon, authenticated"
    );
  });

  it("does not grant client or public access", () => {
    expect(
      statements.some(
        (statement) =>
          /^grant\b/.test(statement) &&
          /\b(?:anon|authenticated|public)\b/.test(statement)
      )
    ).toBe(false);
  });

  it("does not alter RLS policies or service-role privileges", () => {
    expect(migration).not.toMatch(/(?:create|alter|drop)\s+policy/);
    expect(migration).not.toMatch(/service_role/);
  });
});
