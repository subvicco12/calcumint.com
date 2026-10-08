import { describe, expect, it } from "vitest";
import { canTransition, roleCanTransition } from "./publishing";

describe("reviewer lifecycle authority boundaries", () => {
  it("never allows a reviewer or editor to publish", () => {
    for (const role of ["reviewer", "editor"] as const) {
      expect(roleCanTransition(role, "published")).toBe(false);
    }
  });
  it("rejects direct draft-to-certification or publication transitions", () => {
    expect(canTransition("draft", "certified")).toBe(false);
    expect(canTransition("draft", "published")).toBe(false);
    expect(canTransition("review", "published")).toBe(false);
    expect(canTransition("archived", "published")).toBe(false);
  });
  it("does not permit a reviewer to bypass transition restrictions by role permission alone", () => {
    expect(roleCanTransition("reviewer", "certified")).toBe(true);
    expect(canTransition("draft", "certified")).toBe(false);
    expect(roleCanTransition("reviewer", "published")).toBe(false);
  });
});
