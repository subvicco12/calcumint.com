import { describe, expect, it } from "vitest";
import { requiredQaChecks } from "@/lib/admin/publishing";

describe("reviewer QA fail-closed status combinations", () => {
  it("does not permit a complete standard-risk gate with one failed or pending check", () => {
    const required = requiredQaChecks("standard", false);
    expect(required).toHaveLength(15);
    const statuses = new Map(required.map((type) => [type, "passed"]));
    const complete = () => required.every((type) => ["passed", "waived"].includes(statuses.get(type) ?? "pending"));
    expect(complete()).toBe(true);
    for (const blockedStatus of ["pending", "failed"]) {
      for (const type of required) {
        statuses.set(type, blockedStatus);
        expect(complete()).toBe(false);
        statuses.set(type, "passed");
      }
    }
  });
});
