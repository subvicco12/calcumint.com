import {beforeEach,expect,it,vi} from 'vitest';
import {renderToStaticMarkup} from 'react-dom/server';
const state=vi.hoisted(()=>({allow:true}));
vi.mock('@/lib/draft-account-access',()=>({requireDraftAccountAccess:async()=>{if(!state.allow)throw Error('denied');return{user:{id:'reviewer'}};}}));
vi.mock('@/components/account-session-boundary',()=>({AccountSessionBoundary:({children}:{children:React.ReactNode})=>children}));
import Page,{metadata} from './page';
import Detail from './[slug]/page';
beforeEach(()=>{state.allow=true;});
it('denies the calculator directory without exposing engine titles',async()=>{state.allow=false;const html=renderToStaticMarkup(await Page({searchParams:Promise.resolve({})}));expect(html).toContain('Reviewer access required');expect(html).not.toContain('Power Calculator');});
it('provides a private noindex search directory only after reviewer verification',async()=>{const html=renderToStaticMarkup(await Page({searchParams:Promise.resolve({q:'power-calculator'})}));expect(metadata.robots).toEqual({index:false,follow:false});expect(html).toContain('/account/calculators/power-calculator');expect(html).toContain('/account/drafts');});
it('denies detail and unknown slugs without leaking a definition',async()=>{state.allow=false;let html=renderToStaticMarkup(await Detail({params:Promise.resolve({slug:'power-calculator'})}));expect(html).toContain('Reviewer access required');expect(html).not.toContain('P=W/t');state.allow=true;html=renderToStaticMarkup(await Detail({params:Promise.resolve({slug:'not-an-engine'})}));expect(html).toContain('Preview unavailable');});

it('shows unresolved master entries as decisions rather than fabricated calculator links',async()=>{const html=renderToStaticMarkup(await Page({searchParams:Promise.resolve({q:'APR Calculator'})}));expect(html).toContain('APR Calculator');expect(html).toContain('Engine linkage unresolved');expect(html).not.toContain('/account/calculators/apr-calculator');});
it('exposes source-backed bounded proposals while retaining explicit approval warnings',async()=>{const html=renderToStaticMarkup(await Page({searchParams:Promise.resolve({q:'Loan EMI Calculator'})}));expect(html).toContain('/account/calculators/loan-emi-calculator');expect(html).toContain('Engineering bounded reuse proposal');expect(html).toContain('approval pending');});
it('shows effective owner-approved scope status separately from historical mapping evidence',async()=>{const html=renderToStaticMarkup(await Page({searchParams:Promise.resolve({q:'Vacancy Impact Calculator'})}));expect(html).toContain('OWNER_APPROVED_BOUNDED_SCOPE_IMPLEMENTED_PRIVATE');expect(html).toContain('/account/calculators/private-owner-44');expect(html).toContain('Owner-approved bounded scope implemented for private review');});
