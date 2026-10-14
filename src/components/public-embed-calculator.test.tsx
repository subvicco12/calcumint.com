// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, waitFor } from "@testing-library/react";
import { PublicEmbedCalculator } from "./public-embed-calculator";

vi.mock("next/image", () => ({ default: () => null }));
vi.mock("@/lib/builder/definition", () => ({
  runCustomCalculator: () => ({ output: { answer: 42 } })
}));

const props = {
  publicKey: "test-embed",
  sessionToken: "initial-token",
  definition: { fields: [], outputs: [{ key: "answer", label: "Answer", format: "number", decimals: 0 }] },
  accentColor: "#123456",
  hideCalcumintBrand: true,
  leadCaptureEnabled: true,
  leadFields: ["email"],
  consentText: "I consent"
} as unknown as Parameters<typeof PublicEmbedCalculator>[0];

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

describe("embedded calculator browser lifecycle", () => {
  it("renews on focus and visibility resume with a single in-flight request", async () => {
    let finishRenewal!: (response: unknown) => void;
    const pending = new Promise<unknown>((resolve) => { finishRenewal = resolve; });
    const fetchMock = vi.fn((url: string) => url.endsWith("/session") ? pending : Promise.resolve({ ok: true }));
    vi.stubGlobal("fetch", fetchMock);
    render(<PublicEmbedCalculator {...props} />);
    await act(async () => {
      window.dispatchEvent(new Event("focus"));
      document.dispatchEvent(new Event("visibilitychange"));
    });
    expect(fetchMock.mock.calls.filter(([url]) => url.endsWith("/session"))).toHaveLength(1);
    await act(async () => { finishRenewal({ ok: true, json: async () => ({ sessionToken: "renewed-token" }) }); await pending; });
    await waitFor(() => expect(fetchMock.mock.calls.filter(([url]) => url.endsWith("/session"))).toHaveLength(1));
  });

  it("disables lead submission when resume renewal fails", async () => {
    const fetchMock = vi.fn((url: string) => Promise.resolve(url.endsWith("/session") ? { ok: false } : { ok: true }));
    vi.stubGlobal("fetch", fetchMock);
    const { getByRole } = render(<PublicEmbedCalculator {...props} />);
    await act(async () => { window.dispatchEvent(new Event("focus")); });
    await waitFor(() => expect((getByRole("button", { name: "Submit" }) as HTMLButtonElement).disabled).toBe(true));
    expect(getByRole("alert").textContent).toContain("Reload");
  });
});
