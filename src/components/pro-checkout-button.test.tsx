/** @vitest-environment jsdom */

import React from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const push = vi.fn();
const refresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, refresh })
}));

vi.mock("@/lib/env", () => ({
  publicEnv: {
    NEXT_PUBLIC_PADDLE_CLIENT_TOKEN: "test-client-token",
    NEXT_PUBLIC_PADDLE_ENV: "sandbox"
  }
}));

type PaddleEvent = { name?: string };

describe("PlanCheckoutButton", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    document.body.innerHTML = "";
    document.head.innerHTML = "";
  });

  async function renderCheckoutButton() {
    let paddleEventCallback: ((event: PaddleEvent) => void) | undefined;
    const setEnvironment = vi.fn();
    const initialize = vi.fn((options: { token: string; eventCallback?: (event: PaddleEvent) => void }) => {
      paddleEventCallback = options.eventCallback;
    });
    const open = vi.fn();

    window.Paddle = {
      Environment: { set: setEnvironment },
      Initialize: initialize,
      Checkout: { open }
    };

    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      status: 200,
      ok: true,
      json: async () => ({ transactionId: "txn_123" })
    } satisfies Partial<Response>));

    const { PlanCheckoutButton } = await import("./pro-checkout-button");
    render(<PlanCheckoutButton plan="pro" interval="monthly" />);

    const button = screen.getByRole("button", { name: "Choose Pro monthly" });
    fireEvent.click(button);

    await waitFor(() => expect(open).toHaveBeenCalledWith({
      transactionId: "txn_123",
      settings: { displayMode: "overlay", theme: "light" }
    }));

    return { button, initialize, open, paddleEventCallback, setEnvironment };
  }

  it("keeps the button disabled until Paddle closes the checkout", async () => {
    const { button, initialize, open, paddleEventCallback, setEnvironment } = await renderCheckoutButton();

    expect(setEnvironment).toHaveBeenCalledWith("sandbox");
    expect(initialize).toHaveBeenCalledTimes(1);
    expect(button).toHaveProperty("disabled", true);

    act(() => {
      paddleEventCallback?.({ name: "checkout.closed" });
    });

    await waitFor(() => expect(button).toHaveProperty("disabled", false));

    fireEvent.click(button);

    await waitFor(() => expect(open).toHaveBeenCalledTimes(2));
    expect(initialize).toHaveBeenCalledTimes(1);
  });

  it("re-enables the button when Paddle completes checkout", async () => {
    const { button, paddleEventCallback } = await renderCheckoutButton();

    expect(button).toHaveProperty("disabled", true);

    act(() => {
      paddleEventCallback?.({ name: "checkout.completed" });
    });

    await waitFor(() => expect(button).toHaveProperty("disabled", false));
  });
});
