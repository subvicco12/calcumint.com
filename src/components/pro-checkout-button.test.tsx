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

  it("moves keyboard focus into the confirmation and restores the trigger on Escape", async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({status:200,ok:true,json:async()=>({confirmationRequired:true})}));
    const {PlanCheckoutButton}=await import('./pro-checkout-button');
    render(<PlanCheckoutButton plan="pro" interval="monthly"/>);
    const trigger=screen.getByRole('button',{name:'Choose Pro monthly'});trigger.focus();fireEvent.click(trigger);
    const dialog=await screen.findByRole('dialog',{name:'Confirm plan change'});
    await waitFor(()=>expect(dialog.contains(document.activeElement)).toBe(true));
    fireEvent.keyDown(dialog,{key:'Escape'});
    expect(screen.queryByRole('dialog')).toBeNull();expect(document.activeElement).toBe(trigger);
  });

  it("returns focus after keyboard Cancel without sending a confirmed update", async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({status:200,ok:true,json:async()=>({confirmationRequired:true})}));
    const {PlanCheckoutButton}=await import('./pro-checkout-button');render(<PlanCheckoutButton plan="business" interval="yearly"/>);
    const trigger=screen.getByRole('button',{name:'Choose Business yearly'});trigger.focus();fireEvent.click(trigger);
    const cancel=await screen.findByRole('button',{name:'Cancel'});cancel.focus();fireEvent.click(cancel);
    expect(screen.queryByRole('dialog')).toBeNull();expect(document.activeElement).toBe(trigger);
  });

  it('announces a failed confirmation while retaining the review and retry controls',async()=>{
    vi.stubGlobal('fetch',vi.fn().mockResolvedValueOnce({status:200,ok:true,json:async()=>({confirmationRequired:true})}).mockRejectedValueOnce(new Error('Synthetic interruption')));
    const {PlanCheckoutButton}=await import('./pro-checkout-button');render(<PlanCheckoutButton plan="pro" interval="monthly"/>);
    fireEvent.click(screen.getByRole('button',{name:'Choose Pro monthly'}));fireEvent.click(await screen.findByRole('button',{name:'Confirm and update plan'}));
    expect(await screen.findByRole('alert')).toHaveProperty('textContent','Synthetic interruption');expect(screen.getByRole('dialog')).toBeTruthy();expect(screen.getByRole('button',{name:'Cancel'})).toHaveProperty('disabled',false);
  });

  it('does not steal focus when a delayed preview arrives after the user moves elsewhere',async()=>{
    let resolve!:(response:unknown)=>void;vi.stubGlobal('fetch',vi.fn(()=>new Promise(done=>{resolve=done;})));
    const {PlanCheckoutButton}=await import('./pro-checkout-button');render(<><PlanCheckoutButton plan="pro" interval="monthly"/><button>Outside control</button></>);
    fireEvent.click(screen.getByRole('button',{name:'Choose Pro monthly'}));const outside=screen.getByRole('button',{name:'Outside control'});outside.focus();
    await act(async()=>resolve({status:200,ok:true,json:async()=>({confirmationRequired:true})}));expect(screen.getByRole('dialog')).toBeTruthy();expect(document.activeElement).toBe(outside);
  });

  it('retains an in-flight confirmation on Escape and never automatically retries a failed update',async()=>{
    let reject!:(error:Error)=>void;const transport=vi.fn().mockResolvedValueOnce({status:200,ok:true,json:async()=>({confirmationRequired:true})}).mockImplementationOnce(()=>new Promise((_done,fail)=>{reject=fail;}));vi.stubGlobal('fetch',transport);
    const {PlanCheckoutButton}=await import('./pro-checkout-button');render(<PlanCheckoutButton plan="pro" interval="monthly"/>);
    fireEvent.click(screen.getByRole('button',{name:'Choose Pro monthly'}));const confirm=await screen.findByRole('button',{name:'Confirm and update plan'});fireEvent.click(confirm);
    const dialog=screen.getByRole('dialog');fireEvent.keyDown(dialog,{key:'Escape'});expect(screen.getByRole('dialog')).toBe(dialog);expect(screen.getByRole('button',{name:'Cancel'})).toHaveProperty('disabled',true);
    await act(async()=>reject(new Error('Synthetic lost response')));await screen.findByRole('alert');expect(transport).toHaveBeenCalledTimes(2);expect(JSON.parse(transport.mock.calls[1][1].body)).toEqual({plan:'pro',interval:'monthly',confirmChange:true});expect(screen.getByRole('button',{name:'Confirm and update plan'})).toHaveProperty('disabled',false);
  });
});
