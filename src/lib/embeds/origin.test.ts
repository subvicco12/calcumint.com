import { describe, expect, it } from "vitest";
import { isEmbedRequestAllowed } from "./origin";

describe("embed origin authorization", () => {
  it("accepts an allowed parent domain and its subdomains", () => {
    expect(isEmbedRequestAllowed(["example.com"], true, "https://example.com/page", "iframe")).toBe(true);
    expect(isEmbedRequestAllowed(["example.com"], true, "https://app.example.com/page", "iframe")).toBe(true);
  });

  it("rejects unauthorized and originless frames for restricted embeds", () => {
    expect(isEmbedRequestAllowed(["example.com"], true, "https://attacker.test/page", "iframe")).toBe(false);
    expect(isEmbedRequestAllowed(["example.com"], true, null, "iframe")).toBe(false);
    expect(isEmbedRequestAllowed(["example.com"], true, null, null)).toBe(false);
  });

  it("allows an explicit direct navigation only when configured", () => {
    expect(isEmbedRequestAllowed(["example.com"], true, null, "document")).toBe(true);
    expect(isEmbedRequestAllowed(["example.com"], false, null, "document")).toBe(false);
  });

  it("keeps unrestricted embeds frameable", () => {
    expect(isEmbedRequestAllowed([], false, null, "iframe")).toBe(true);
  });
});
