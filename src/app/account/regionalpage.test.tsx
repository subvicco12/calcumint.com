import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
const state = vi.hoisted(() => ({ tables: {} as Record<string, {data: unknown; error: unknown}>, authError: null as unknown, thrownTable: "", signedOut:false, authReject:false }));
vi.mock("@/lib/supabase/server", () => ({createSupabaseServerClient: async () => ({auth: {getUser: async () => {if(state.authReject) throw new Error("transport");return {data: {user: state.signedOut?null:{id:"user-a",email:"a@example.invalid"}}, error:state.authError}}},from: (table:string) => {const result = {then: (resolve: (value: unknown) => unknown, reject: (reason: unknown) => unknown) => state.thrownTable === table ? Promise.reject(new Error("transport")).then(resolve,reject) : Promise.resolve(state.tables[table] ?? {data:[],error:null}).then(resolve,reject),select:()=>result,eq:()=>result,order:()=>result,limit:()=>result,maybeSingle:()=>result};return result;}})}));
vi.mock("next/navigation", () => ({redirect:vi.fn(()=>{throw new Error("REDIRECT_LOGIN")})}));
vi.mock("./actions", () => ({updatePreferences:vi.fn(),createCalculationProject:vi.fn(),deleteCalculationProject:vi.fn(),saveProjectScenario:vi.fn(),updateProjectScenarioName:vi.fn(),deleteProjectScenario:vi.fn()}));
vi.mock("@/app/login/actions", () => ({signOut:vi.fn()}));
vi.mock("@/components/billing-sync-status", () => ({BillingSyncStatus:()=>null}));
vi.mock("@/components/billing-portal-button", () => ({BillingPortalButton:()=>null}));
import AccountPage from "./page";
const render = async () => renderToStaticMarkup(await AccountPage({searchParams:Promise.resolve({})}));
beforeEach(()=>{state.tables={profiles:{data:{plan:"pro"},error:null},user_preferences:{data:{currency:"EUR"},error:null}};state.authError=null;state.thrownTable="";state.signedOut=false;state.authReject=false;});
describe("account regional locale presentation", () => {
 it.each(["CA", "AU"])("represents the stored %s country locale without falling back", async code => {
  const {getCountryProfile}=await import("@/calculators/country-intelligence");
  const profile=getCountryProfile(code)!;
  expect(profile).toMatchObject(code==="CA"?{locale:"en-CA",currency:"CAD",unitSystem:"metric"}:{locale:"en-AU",currency:"AUD",unitSystem:"metric"});
  state.tables.user_preferences={data:{country_code:code,locale:profile.locale,currency:profile.currency,unit_system:profile.unitSystem},error:null};
  const html=await render();
  expect(html).toContain(`<option value="${profile.locale}" selected="">`);
  expect(html).toContain(`<option value="${profile.currency}" selected="">`);
  expect(html).toContain('<option value="metric" selected="">');
  expect(html).toContain("Regional locale<select");
  expect(html).not.toContain("Language &amp; locale");
 });
 it("preserves configured locale choices and English default", async()=>{
  const html=await render();
  for(const locale of ["en","en-US","en-GB","en-IN","de-DE","fr-FR"])expect(html).toContain(`value="${locale}"`);
  expect(html).toContain('<option value="en" selected="">English (default)</option>');
 });
 it.each(["free","pro","business"])("offers owned project browsing on %s",async plan=>{
  state.tables.profiles={data:{plan},error:null};
  expect(await render()).toContain('href="/account/projects">Browse all projects</a>');
 });
 it("keeps generic and private draft record links",async()=>{
  const {draftAccountRecordHref}=await import("@/lib/draft-persistence-contract");
  const {draftPreviewDefinitions}=await import("@/calculators/final-framework/draft-preview-catalog");
  const draftSlug=draftPreviewDefinitions[0].slug;
  state.tables.calculation_history={data:[{id:"ordinary",calculator_slug:"slope-calculator",created_at:"2026-01-01"},{id:"draft",calculator_slug:draftSlug,created_at:"2026-01-01"}],error:null};
  const html=await render();
  expect(html).toContain('/account/saved?source=history&amp;id=ordinary');
  const expected=draftAccountRecordHref(draftSlug,"draft","history");
  expect(expected).toBeTruthy();
  expect(html).toContain(expected!.replaceAll("&","&amp;"));
 });
});
