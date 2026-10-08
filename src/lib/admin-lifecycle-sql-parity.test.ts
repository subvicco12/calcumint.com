import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { adminRoles, canTransition, lifecycleStates, roleCanTransition } from "./admin/publishing";

const sql = readFileSync("supabase/migrations/034_atomic_lifecycle_transition_audit.sql", "utf8");
const graph = sql.split("if not (")[1]?.split(") then raise exception 'Invalid lifecycle transition'")[0] ?? "";

describe("atomic lifecycle transition authority parity", () => {
  it("mirrors every allowed and denied lifecycle transition in SQL", () => {
    for (const from of lifecycleStates) {
      for (const to of lifecycleStates) {
        if (from === to) continue;
        const edge = new RegExp(`p_expected_lifecycle = '${from}' and p_target_lifecycle (?:= '${to}'|in \\([^)]*'${to}'[^)]*\\))`);
        expect(edge.test(graph), `${from} -> ${to}`).toBe(canTransition(from, to));
      }
    }
  });

  it("retains reviewer and editor restrictions for every target state", () => {
    expect(sql).toContain("v_role = 'editor' and p_target_lifecycle not in ('draft','review')");
    expect(sql).toContain("v_role = 'reviewer' and p_target_lifecycle = 'published'");
    for (const role of adminRoles) {
      for (const target of lifecycleStates) {
        const sqlPermits = role === "owner" || role === "admin" || (role === "reviewer" ? target !== "published" : target === "draft" || target === "review");
        expect(sqlPermits).toBe(roleCanTransition(role, target));
      }
    }
  });
});
