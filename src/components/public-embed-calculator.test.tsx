// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
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
  it("keeps SSR controls inert until handlers attach and uses a private POST fallback", () => {
    const html = renderToStaticMarkup(<PublicEmbedCalculator {...props} definition={{...props.definition,fields:[{key:"x",label:"Quantity",defaultValue:2}] } as typeof props.definition}/>);
    const container = document.createElement("div"); container.innerHTML = html;
    expect(container.querySelector<HTMLInputElement>('input[type="number"]')?.disabled).toBe(true);
    expect(container.querySelector<HTMLFieldSetElement>('.embed-lead-form fieldset')?.disabled).toBe(true);
    expect(container.querySelector<HTMLButtonElement>('.embed-lead-form button[type="submit"]')?.disabled).toBe(true);
    expect(container.querySelector('form')?.getAttribute('method')).toBe('post');
    expect(container.querySelector('.public-embed')?.getAttribute('aria-busy')).toBe('true');
  });
  it("enables the existing controls only after client handlers attach", () => {
    vi.stubGlobal("fetch",vi.fn().mockResolvedValue({ok:true}));
    const {container} = render(<PublicEmbedCalculator {...props}/>);
    expect(container.querySelector<HTMLFieldSetElement>('.embed-lead-form fieldset')?.disabled).toBe(false);
    expect(container.querySelector('.public-embed')?.getAttribute('aria-busy')).toBe('false');
  });
  it("renews on focus and visibility resume with a single in-flight request", async () => {
    let finishRenewal!: (response: unknown) => void;
    const pending = new Promise<unknown>((resolve) => { finishRenewal = resolve; });
    const fetchMock = vi.fn((url: string, _options?: RequestInit) => url.endsWith("/session") ? pending : Promise.resolve({ ok: true }));
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
    const fetchMock = vi.fn((url: string) => Promise.resolve(url.endsWith("/session") ? { ok: false } : { ok: true, json: async()=>({ok:true}) }));
    vi.stubGlobal("fetch", fetchMock);
    const { getByRole } = render(<PublicEmbedCalculator {...props} />);
    await act(async () => { window.dispatchEvent(new Event("focus")); });
    await waitFor(() => expect((getByRole("button", { name: "Submit" }) as HTMLButtonElement).disabled).toBe(true));
    expect(getByRole("alert").textContent).toContain("Reload");
  });
  it("uses the renewed token when submitting a legitimate iframe lead", async () => {
    const fetchMock = vi.fn((url: string) => Promise.resolve(
      url.endsWith("/session")
        ? { ok: true, json: async () => ({ sessionToken: "renewed-token" }) }
        : { ok: true, json: async()=>({ok:true}) }
    ));
    vi.stubGlobal("fetch", fetchMock);
    const { getByRole, getByLabelText, getByText } = render(<PublicEmbedCalculator {...props} />);
    await act(async () => { window.dispatchEvent(new Event("focus")); });
    await waitFor(() => expect(fetchMock.mock.calls.some(([url]) => url.endsWith("/session"))).toBe(true));
    fireEvent.change(getByLabelText("Email"), { target: { value: "valid@example.com" } });
    fireEvent.click(getByRole("checkbox"));
    await act(async () => { fireEvent.click(getByRole("button", { name: "Submit" })); });
    await waitFor(() => expect(getByText("Thanks — your details were submitted.")).toBeTruthy());
    const leadCall = fetchMock.mock.calls.find(([url]) => url.endsWith("/leads"));
    expect(leadCall).toBeDefined();
    const leadOptions = (leadCall as unknown as [string, RequestInit] | undefined)?.[1];
    expect(leadOptions?.headers).toMatchObject({ "X-Embed-Session": "renewed-token" });
  });

  it("fails closed after a suspended iframe resumes with an expired capability", async () => {
    const fetchMock = vi.fn((url: string) => Promise.resolve(
      url.endsWith("/session") ? { ok: false, status: 403 } : { ok: true, json: async()=>({ok:true}) }
    ));
    vi.stubGlobal("fetch", fetchMock);
    const { getByRole, getByText } = render(<PublicEmbedCalculator {...props} />);
    await act(async () => {
      document.dispatchEvent(new Event("visibilitychange"));
      window.dispatchEvent(new Event("focus"));
    });
    await waitFor(() => expect((getByRole("button", { name: "Submit" }) as HTMLButtonElement).disabled).toBe(true));
    expect(getByRole("alert").textContent).toContain("Reload");
    fireEvent.click(getByRole("button", { name: "Submit" }));
    // A disabled control is not the only boundary: direct submit events must also fail closed.
    await act(async () => { fireEvent.submit(getByRole("button", { name: "Submit" }).closest("form")!); });
    expect(fetchMock.mock.calls.some(([url]) => url.endsWith("/leads"))).toBe(false);
    expect(getByText("Embed session expired. Reload this calculator to continue submitting events or leads.")).toBeTruthy();
  });

  it("retains one capture and request ID after a lost response, blocks overlap and retries only explicitly",async()=>{
    let rejectLead!:(error:Error)=>void;
    const pending=new Promise<never>((_,reject)=>{rejectLead=reject;});
    let leadCalls=0;
    const fetchMock=vi.fn((url:string,options?:RequestInit)=>{void options;return url.endsWith('/leads')?(++leadCalls===1?pending:Promise.resolve({ok:true,json:async()=>({ok:true,duplicate:true})})):Promise.resolve({ok:true});});
    vi.stubGlobal('fetch',fetchMock);
    const {getByRole,getByLabelText,getByText}=render(<PublicEmbedCalculator {...props}/>);
    fireEvent.change(getByLabelText('Email'),{target:{value:'original@example.com'}});fireEvent.click(getByRole('checkbox'));
    const form=getByRole('button',{name:'Submit'}).closest('form')!;
    await act(async()=>{fireEvent.submit(form);fireEvent.submit(form);});
    expect(fetchMock.mock.calls.filter(([u])=>u.endsWith('/leads'))).toHaveLength(1);
    expect((getByRole('button',{name:'Submitting…'}) as HTMLButtonElement).disabled).toBe(true);
    await act(async()=>{rejectLead(new Error('lost reply'));});
    expect(getByText(/outcome is unconfirmed/)).toBeTruthy();
    fireEvent.change(getByLabelText('Email'),{target:{value:'changed@example.com'}});
    await act(async()=>{fireEvent.click(getByRole('button',{name:'Retry original submission'}));});
    const calls=fetchMock.mock.calls.filter(([u])=>u.endsWith('/leads'));expect(calls).toHaveLength(2);
    expect(calls[0][1]?.body).toBe(calls[1][1]?.body);expect(calls[0][1]?.headers).toMatchObject({'Idempotency-Key':expect.any(String)});
    expect((calls[0][1]?.headers as Record<string,string>)['Idempotency-Key']).toBe((calls[1][1]?.headers as Record<string,string>)['Idempotency-Key']);
    expect((getByLabelText('Email') as HTMLInputElement).value).toBe('changed@example.com');
  });

  it("does not render an old capture completion in a new embed scope",async()=>{
    let complete!:(value:unknown)=>void;
    const pending=new Promise(resolve=>{complete=resolve;});
    vi.stubGlobal('fetch',vi.fn((url:string)=>url.endsWith('/leads')?pending:Promise.resolve({ok:true})));
    const view=render(<PublicEmbedCalculator {...props}/>);
    fireEvent.change(view.getByLabelText('Email'),{target:{value:'previous@example.invalid'}});fireEvent.click(view.getByRole('checkbox'));
    await act(async()=>{fireEvent.submit(view.getByRole('button',{name:'Submit'}).closest('form')!);});
    view.rerender(<PublicEmbedCalculator {...props} publicKey="different-scope" sessionToken="different-token"/>);
    await act(async()=>{complete({ok:true,json:async()=>({ok:true})});await pending;});
    expect(view.queryByText('Thanks — your details were submitted.')).toBeNull();
    expect((view.getByLabelText('Email') as HTMLInputElement).value).toBe('');
  });

  it("binds displayed terms and privacy URL and requires reload when they change remotely",async()=>{
    const fetchMock=vi.fn((url:string,options?:RequestInit)=>{void options;return Promise.resolve(url.endsWith('/leads')?{ok:false,status:409,json:async()=>({code:'CONSENT_CHANGED'})}:{ok:true});});
    vi.stubGlobal('fetch',fetchMock);
    const view=render(<PublicEmbedCalculator {...props} privacyUrl="https://example.invalid/privacy"/>);
    fireEvent.change(view.getByLabelText('Email'),{target:{value:'synthetic@example.invalid'}});fireEvent.click(view.getByRole('checkbox'));
    await act(async()=>{fireEvent.submit(view.getByRole('button',{name:'Submit'}).closest('form')!);});
    expect(view.getByRole('alert').textContent).toContain('Consent information changed');
    expect((view.getByRole('button',{name:'Submit'}) as HTMLButtonElement).disabled).toBe(true);
    const capture=fetchMock.mock.calls.find(([url])=>url.endsWith('/leads'))!;
    expect(JSON.parse(String(capture[1]?.body))).toMatchObject({consentText:'I consent',privacyUrl:'https://example.invalid/privacy'});
  });
  it("drops a previous sensitive retry when the displayed definition or consent scope changes",async()=>{
    const fetchMock=vi.fn((url:string,options?:RequestInit)=>{void options;return url.endsWith('/leads')?Promise.reject(new Error('Lost reply')):Promise.resolve({ok:true});});
    vi.stubGlobal('fetch',fetchMock);
    const view=render(<PublicEmbedCalculator {...props}/>);
    fireEvent.change(view.getByLabelText('Email'),{target:{value:'previous@example.invalid'}});fireEvent.click(view.getByRole('checkbox'));
    await act(async()=>{fireEvent.submit(view.getByRole('button',{name:'Submit'}).closest('form')!);});
    expect(view.getByRole('button',{name:'Retry original submission'})).toBeTruthy();
    view.rerender(<PublicEmbedCalculator {...props} consentText="New displayed terms"/>);
    expect((view.getByLabelText('Email') as HTMLInputElement).value).toBe('');
    expect(view.queryByRole('button',{name:'Retry original submission'})).toBeNull();
  });

  it("preserves same-version token renewal drafts but isolates identical definitions at a new version",()=>{
    vi.stubGlobal('fetch',vi.fn(()=>Promise.resolve({ok:true})));
    const token=(version:number,expiresAt:number)=>`${btoa(JSON.stringify({configId:'config',calculatorId:'calculator',organizationId:'org',version,expiresAt}))}.synthetic`;
    const view=render(<PublicEmbedCalculator {...props} sessionToken={token(1,100)}/>);
    fireEvent.change(view.getByLabelText('Email'),{target:{value:'current@example.invalid'}});
    view.rerender(<PublicEmbedCalculator {...props} sessionToken={token(1,200)}/>);
    expect((view.getByLabelText('Email') as HTMLInputElement).value).toBe('current@example.invalid');
    view.rerender(<PublicEmbedCalculator {...props} sessionToken={token(2,300)}/>);
    expect((view.getByLabelText('Email') as HTMLInputElement).value).toBe('');
  });

});
