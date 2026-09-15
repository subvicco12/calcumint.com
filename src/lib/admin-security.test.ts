import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const migration = readFileSync("supabase/migrations/008_b10_admin_factory.sql", "utf8");
const alerts = readFileSync("supabase/migrations/008b_b10_alert_automation.sql", "utf8");

describe("B10 admin governance security", () => {
  it("keeps platform-admin assignment outside authenticated self-service", () => {
    expect(migration).toMatch(/alter table public\.platform_admins enable row level security/i);
    expect(migration).toMatch(/create policy "admins_read_self"/i);
    expect(migration).not.toMatch(/create policy .*platform_admins for insert/i);
    expect(migration).not.toMatch(/create policy .*platform_admins for update/i);
  });

  it("enforces database-side publishing gates and YMYL reviewer assignment", () => {
    expect(migration).toMatch(/validate_calculator_publish_gate/i);
    expect(migration).toMatch(/risk_class in \('financial','health','tax'\)/i);
    expect(migration).toMatch(/YMYL reviewer is required/i);
    expect(migration).toMatch(/calculator_publish_gate_before_update/i);
  });

  it("protects publishing gate functions and automates quality alerts", () => {
    expect(migration).toMatch(/revoke all on function public\.validate_calculator_publish_gate\(uuid\) from public/i);
    expect(alerts).toMatch(/qa_failed_alert_after_update/i);
    expect(alerts).toMatch(/refresh_admin_review_alerts/i);
  });
});
