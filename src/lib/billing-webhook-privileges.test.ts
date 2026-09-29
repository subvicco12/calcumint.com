import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const migration = fs.readFileSync(
  path.join(process.cwd(), "supabase/migrations/034_billing_webhook_event_privileges.sql"),
  "utf8"
).toLowerCase();

describe("billing webhook event ledger privileges", () => {
  it("revokes all direct client table privileges", () => {
    expect(migration).toMatch(
      /revoke\s+all\s+privileges\s+on\s+table\s+public\.billing_webhook_events\s+from\s+anon\s*,\s*authenticated\s*;/
    );
  });

  it("does not grant client or public access", () => {
    expect(migration).not.toMatch(/grant[\s\S]*\b(?:anon|authenticated|public)\b/);
  });

  it("does not alter RLS policies or service-role privileges", () => {
    expect(migration).not.toMatch(/(?:create|alter|drop)\s+policy/);
    expect(migration).not.toMatch(/service_role/);
  });
});
