/** @vitest-environment jsdom */

import React from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const push = vi.fn();
const refresh = vi.fn();
const authState=vi.hoisted(()=>({owner:'owner-a',error:null as unknown,callbacks:new Set<(event:string,session:{user:{id:string}}|null)=>void>()}));
vi.mock('@/lib/supabase/browser',()=>({createSupabaseBrowserClient:()=>({auth:{getUser:async()=>({data:{user:authState.owner?{id:authState.owner}:null},error:authState.error}),onAuthStateChange:(callback:(event:string,session:{user:{id:string}}|null)=>void)=>{authState.callbacks.add(callback);return {data:{subscription:{unsubscribe:()=>authState.callbacks.delete(callback)}}};}}})}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, refresh })
}));

vi.mock("@/lib/env", () => ({
  publicEnv: {
    NEXT_PUBLIC_PADDLE_CLIENT_TOKEN: "test-client-token",
    NEXT_PUBLIC_PADDLE_ENV: "sandbox"
  }
}));

type PaddleEvent = { name?: string; data?: {transaction_id?: unknown} };

describe("PlanCheckoutButton", () => {
  it.each([false,true])('reloads the SDK after a failed CDN request and explicit checkout remount (existing script: %s)', async existing => {
    delete window.Paddle;
    if(existing){const script=document.createElement('script');script.src='https://cdn.paddle.com/paddle/v2/paddle.js';document.head.appendChild(script);}
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({status:200,ok:true,json:async()=>({transactionId:'txn_retry'})}));
    const {PlanCheckoutButton}=await import('./pro-checkout-button');
    const view=render(<PlanCheckoutButton plan="pro" interval="monthly"/>);
    fireEvent.click(screen.getByRole('button',{name:'Choose Pro monthly'}));
    const selector='script[src="https://cdn.paddle.com/paddle/v2/paddle.js"]';
    await waitFor(()=>expect(document.querySelector(selector)).not.toBeNull());
    const failed=document.querySelector(selector)!;
    fireEvent.error(failed);
    await screen.findByRole('alert');
    view.unmount();
    render(<PlanCheckoutButton plan="pro" interval="monthly"/>);
    fireEvent.click(screen.getByRole('button',{name:'Choose Pro monthly'}));
    await waitFor(()=>{expect(document.querySelector(selector)).not.toBeNull();expect(document.querySelector(selector)).not.toBe(failed);});
    const open=vi.fn();
    window.Paddle={Environment:{set:vi.fn()},Initialize:vi.fn(),Checkout:{open}};
    fireEvent.load(document.querySelector(selector)!);
    await waitFor(()=>expect(open).toHaveBeenCalledWith({transactionId:'txn_retry',settings:{displayMode:'overlay',theme:'light'}}));
  });
  beforeEach(() => {
    authState.owner='owner-a';authState.error=null;authState.callbacks.clear();
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

    const transport=vi.fn().mockImplementation(async (url:string)=>url.startsWith('/api/billing/checkout/status?')?{status:202,ok:true,json:async()=>({verified:false})}:{
      status: 200,
      ok: true,
      json: async () => ({ transactionId: "txn_123" })
    } satisfies Partial<Response>);
    vi.stubGlobal("fetch", transport);

    const { PlanCheckoutButton } = await import("./pro-checkout-button");
    render(<PlanCheckoutButton plan="pro" interval="monthly" />);

    const button = screen.getByRole("button", { name: "Choose Pro monthly" });
    fireEvent.click(button);

    await waitFor(() => expect(open).toHaveBeenCalledWith({
      transactionId: "txn_123",
      settings: { displayMode: "overlay", theme: "light" }
    }));

    return { button, initialize, open, paddleEventCallback, setEnvironment, transport };
  }

  it("keeps the button disabled until Paddle closes the checkout", async () => {
    const { button, initialize, open, paddleEventCallback, setEnvironment } = await renderCheckoutButton();

    expect(setEnvironment).toHaveBeenCalledWith("sandbox");
    expect(initialize).toHaveBeenCalledTimes(1);
    expect(button).toHaveProperty("disabled", true);

    act(() => {
      paddleEventCallback?.({ name: "checkout.closed", data:{transaction_id:'txn_123'} });
    });

    await waitFor(() => expect(button).toHaveProperty("disabled", false));

    fireEvent.click(button);

    await waitFor(() => expect(open).toHaveBeenCalledTimes(2));
    expect(initialize).toHaveBeenCalledTimes(1);
  });

  it("requires server evidence and reconciliation before accepting browser completion", async () => {
    const { button, paddleEventCallback, transport } = await renderCheckoutButton();

    expect(button).toHaveProperty("disabled", true);

    act(() => {
      paddleEventCallback?.({ name: "checkout.completed", data:{transaction_id:'txn_123'} });
    });

    await screen.findByRole('alert');expect(screen.getByRole('link',{name:'Check account'})).toBeTruthy();expect(button).toHaveProperty('disabled',true);expect(transport.mock.calls.some(([url])=>url.startsWith('/api/billing/checkout/status?'))).toBe(true);
  });

  it.each([undefined,{}, {transaction_id:'different-transaction'}, {transaction_id:42}])('ignores uncorrelated terminal events: %j',async data=>{
    const {button,paddleEventCallback,transport}=await renderCheckoutButton();await act(async()=>{paddleEventCallback?.({name:'checkout.closed',data});});expect(button).toHaveProperty('disabled',true);expect(transport).toHaveBeenCalledTimes(1);
    await act(async()=>{paddleEventCallback?.({name:'checkout.closed',data:{transaction_id:'txn_123'}});});await waitFor(()=>expect(button).toHaveProperty('disabled',false));
  });

  it('consumes duplicate completion callbacks once without replaying a billing POST',async()=>{
    const {paddleEventCallback,transport}=await renderCheckoutButton();await act(async()=>{for(let i=0;i<3;i++)paddleEventCallback?.({name:'checkout.completed',data:{transaction_id:'txn_123'}});});await screen.findByRole('alert');expect(transport.mock.calls.filter(([url])=>url.startsWith('/api/billing/checkout/status?'))).toHaveLength(1);expect(transport.mock.calls.filter(([url])=>url==='/api/billing/checkout')).toHaveLength(1);
  });

  it('ignores malformed callback envelopes without crashing the active checkout',async()=>{
    const {button,paddleEventCallback}=await renderCheckoutButton();expect(()=>paddleEventCallback?.(null as unknown as PaddleEvent)).not.toThrow();expect(button).toHaveProperty('disabled',true);
  });
  it.each([null,42,''])('never opens a provider checkout with invalid transaction identity %j',async transactionId=>{
    const open=vi.fn();window.Paddle={Environment:{set:vi.fn()},Initialize:vi.fn(),Checkout:{open}};vi.stubGlobal('fetch',vi.fn().mockResolvedValue({status:200,ok:true,json:async()=>({transactionId})}));const {PlanCheckoutButton}=await import('./pro-checkout-button');render(<PlanCheckoutButton plan="pro" interval="monthly"/>);fireEvent.click(screen.getByRole('button',{name:'Choose Pro monthly'}));await screen.findByRole('alert');expect(open).not.toHaveBeenCalled();
  });
  it('requires reconciliation after a created transaction cannot open its overlay',async()=>{
    const transport=vi.fn().mockResolvedValue({status:200,ok:true,json:async()=>({transactionId:'txn_123'})});vi.stubGlobal('fetch',transport);window.Paddle={Environment:{set:vi.fn()},Initialize:vi.fn(),Checkout:{open:vi.fn(()=>{throw new Error('Synthetic interrupted overlay');})}};const {PlanCheckoutButton}=await import('./pro-checkout-button');render(<PlanCheckoutButton plan="pro" interval="monthly"/>);const button=screen.getByRole('button',{name:'Choose Pro monthly'});fireEvent.click(button);await screen.findByRole('alert');expect(button).toHaveProperty('disabled',true);expect(screen.getByRole('link',{name:'Check account'})).toBeTruthy();fireEvent.click(button);expect(transport).toHaveBeenCalledTimes(1);
  });
  it('keeps unsupported deferred changes disabled without sending a billing request',async()=>{
    const transport=vi.fn();vi.stubGlobal('fetch',transport);const {PlanCheckoutButton}=await import('./pro-checkout-button');render(<PlanCheckoutButton plan="pro" interval="monthly" disabledReason="Available at renewal"/>);const button=screen.getByRole('button',{name:'Choose Pro monthly'});expect(button).toHaveProperty('disabled',true);fireEvent.click(button);expect(transport).not.toHaveBeenCalled();expect(screen.getByText('Available at renewal')).toBeTruthy();
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
    fireEvent.click(screen.getByRole('button',{name:'Choose Pro monthly'}));const outside=screen.getByRole('button',{name:'Outside control'});outside.focus();await waitFor(()=>expect(resolve).toBeTypeOf('function'));
    await act(async()=>resolve({status:200,ok:true,json:async()=>({confirmationRequired:true})}));expect(screen.getByRole('dialog')).toBeTruthy();expect(document.activeElement).toBe(outside);
  });

  it('retains an in-flight confirmation on Escape and never automatically retries a failed update',async()=>{
    let reject!:(error:Error)=>void;const transport=vi.fn().mockResolvedValueOnce({status:200,ok:true,json:async()=>({confirmationRequired:true})}).mockImplementationOnce(()=>new Promise((_done,fail)=>{reject=fail;}));vi.stubGlobal('fetch',transport);
    const {PlanCheckoutButton}=await import('./pro-checkout-button');render(<PlanCheckoutButton plan="pro" interval="monthly"/>);
    fireEvent.click(screen.getByRole('button',{name:'Choose Pro monthly'}));const confirm=await screen.findByRole('button',{name:'Confirm and update plan'});fireEvent.click(confirm);
    const dialog=screen.getByRole('dialog');fireEvent.keyDown(dialog,{key:'Escape'});expect(screen.getByRole('dialog')).toBe(dialog);expect(screen.getByRole('button',{name:'Cancel'})).toHaveProperty('disabled',true);
    await waitFor(()=>expect(reject).toBeTypeOf('function'));await act(async()=>reject(new Error('Synthetic lost response')));await screen.findByRole('alert');expect(transport).toHaveBeenCalledTimes(2);expect(JSON.parse(transport.mock.calls[1][1].body)).toEqual({plan:'pro',interval:'monthly',confirmChange:true,expectedOwnerId:'owner-a'});expect(screen.getByRole('button',{name:'Confirm and update plan'})).toHaveProperty('disabled',false);
  });

  it('ignores a delayed subscription success after navigation unmounts checkout',async()=>{
    let resolve!:(value:unknown)=>void;vi.stubGlobal('fetch',vi.fn(()=>new Promise(done=>{resolve=done;})));
    const {PlanCheckoutButton}=await import('./pro-checkout-button');const view=render(<PlanCheckoutButton plan="pro" interval="monthly"/>);
    fireEvent.click(screen.getByRole('button',{name:'Choose Pro monthly'}));await waitFor(()=>expect(resolve).toBeTypeOf('function'));view.unmount();
    await act(async()=>resolve({status:200,ok:true,json:async()=>({updated:true})}));expect(push).not.toHaveBeenCalled();expect(refresh).not.toHaveBeenCalled();
  });
  it.each(['owner-b',''])('discards an old preview after delivered owner transition to %s',async owner=>{
    let resolve!:(value:unknown)=>void;vi.stubGlobal('fetch',vi.fn(()=>new Promise(done=>{resolve=done;})));
    const {PlanCheckoutButton}=await import('./pro-checkout-button');render(<PlanCheckoutButton plan="pro" interval="monthly"/>);fireEvent.click(screen.getByRole('button',{name:'Choose Pro monthly'}));await waitFor(()=>expect(resolve).toBeTypeOf('function'));
    authState.owner=owner;act(()=>{for(const callback of authState.callbacks)callback(owner?'SIGNED_IN':'SIGNED_OUT',owner?{user:{id:owner}}:null);});await act(async()=>resolve({status:200,ok:true,json:async()=>({confirmationRequired:true})}));expect(screen.queryByRole('dialog')).toBeNull();
  });
  it('rejects a preview confirmed under a silently replaced account before dispatch',async()=>{
    const transport=vi.fn().mockResolvedValue({status:200,ok:true,json:async()=>({confirmationRequired:true})});vi.stubGlobal('fetch',transport);
    const {PlanCheckoutButton}=await import('./pro-checkout-button');render(<PlanCheckoutButton plan="pro" interval="monthly"/>);fireEvent.click(screen.getByRole('button',{name:'Choose Pro monthly'}));await screen.findByRole('dialog');authState.owner='owner-b';fireEvent.click(screen.getByRole('button',{name:'Confirm and update plan'}));await waitFor(()=>expect(screen.queryByRole('dialog')).toBeNull());expect(transport).toHaveBeenCalledTimes(1);
  });
  it('discards a prior selection preview after the pricing props change',async()=>{
    let resolve!:(value:unknown)=>void;vi.stubGlobal('fetch',vi.fn(()=>new Promise(done=>{resolve=done;})));const {PlanCheckoutButton}=await import('./pro-checkout-button');const view=render(<PlanCheckoutButton plan="pro" interval="monthly"/>);fireEvent.click(screen.getByRole('button',{name:'Choose Pro monthly'}));await waitFor(()=>expect(resolve).toBeTypeOf('function'));view.rerender(<PlanCheckoutButton plan="business" interval="yearly"/>);await act(async()=>resolve({status:200,ok:true,json:async()=>({confirmationRequired:true})}));expect(screen.queryByRole('dialog')).toBeNull();expect(screen.getByRole('button',{name:'Choose Business yearly'})).toHaveProperty('disabled',false);
  });
  it('does not navigate on a delayed success after a silent owner change',async()=>{
    let resolve!:(value:unknown)=>void;vi.stubGlobal('fetch',vi.fn(()=>new Promise(done=>{resolve=done;})));const {PlanCheckoutButton}=await import('./pro-checkout-button');render(<PlanCheckoutButton plan="pro" interval="monthly"/>);fireEvent.click(screen.getByRole('button',{name:'Choose Pro monthly'}));await waitFor(()=>expect(resolve).toBeTypeOf('function'));authState.owner='owner-b';await act(async()=>resolve({status:200,ok:true,json:async()=>({updated:true})}));expect(push).not.toHaveBeenCalled();expect(refresh).not.toHaveBeenCalled();expect(screen.queryByRole('dialog')).toBeNull();
  });
  it('withholds an uncertain preview and requires explicit recovery after an auth interruption',async()=>{
    let resolve!:(value:unknown)=>void;const transport=vi.fn().mockImplementationOnce(()=>new Promise(done=>{resolve=done;})).mockResolvedValue({status:200,ok:true,json:async()=>({confirmationRequired:true})});vi.stubGlobal('fetch',transport);const {PlanCheckoutButton}=await import('./pro-checkout-button');render(<PlanCheckoutButton plan="pro" interval="monthly"/>);fireEvent.click(screen.getByRole('button',{name:'Choose Pro monthly'}));await waitFor(()=>expect(resolve).toBeTypeOf('function'));authState.error=new Error('private session detail');await act(async()=>resolve({status:200,ok:true,json:async()=>({confirmationRequired:true})}));expect(screen.queryByRole('dialog')).toBeNull();expect(document.body.textContent).not.toContain('private session detail');expect(transport).toHaveBeenCalledTimes(1);authState.error=null;fireEvent.click(screen.getByRole('button',{name:'Choose Pro monthly'}));await screen.findByRole('dialog');expect(transport).toHaveBeenCalledTimes(2);
  });
  it('never opens an obsolete provider transaction after unmount',async()=>{
    let resolve!:(value:unknown)=>void;const open=vi.fn();window.Paddle={Environment:{set:vi.fn()},Initialize:vi.fn(),Checkout:{open}};vi.stubGlobal('fetch',vi.fn(()=>new Promise(done=>{resolve=done;})));const {PlanCheckoutButton}=await import('./pro-checkout-button');const view=render(<PlanCheckoutButton plan="pro" interval="monthly"/>);fireEvent.click(screen.getByRole('button',{name:'Choose Pro monthly'}));await waitFor(()=>expect(resolve).toBeTypeOf('function'));view.unmount();await act(async()=>resolve({status:200,ok:true,json:async()=>({transactionId:'obsolete-transaction'})}));expect(open).not.toHaveBeenCalled();
  });
  it('keeps anonymous checkout sign-in navigation without sending a billing mutation',async()=>{
    const {AuthSessionMissingError}=await import('@supabase/supabase-js');authState.error=new AuthSessionMissingError();const transport=vi.fn();vi.stubGlobal('fetch',transport);const {PlanCheckoutButton}=await import('./pro-checkout-button');render(<PlanCheckoutButton plan="pro" interval="monthly"/>);fireEvent.click(screen.getByRole('button',{name:'Choose Pro monthly'}));await waitFor(()=>expect(push).toHaveBeenCalledWith('/login?next=%2Fpricing'));expect(transport).not.toHaveBeenCalled();
  });
});
