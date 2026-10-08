import { describe, expect, it } from "vitest";
import { requiredQaChecks } from "@/lib/admin/publishing";

describe("reviewer QA completion contract", () => {
  it("requires all 15 standard-risk decisions and never treats pending or failed as complete", () => {
    const required = requiredQaChecks("standard", false);
    expect(required).toHaveLength(15);
    const statuses = new Map(required.map((check) => [check, "pending"]));
    const incomplete = () => required.filter((check) => !["passed", "waived"].includes(statuses.get(check) ?? "pending"));
    expect(incomplete()).toHaveLength(15);
    statuses.set(required[0], "passed");
    statuses.set(required[1], "failed");
    expect(incomplete()).toHaveLength(14);
    statuses.set(required[1], "waived");
    expect(incomplete()).toHaveLength(13);
    for (const check of required) statuses.set(check, "passed");
    expect(incomplete()).toEqual([]);
  });
});
