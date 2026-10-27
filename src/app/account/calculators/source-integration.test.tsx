import {beforeEach,expect,it,vi} from 'vitest';
import {renderToStaticMarkup} from 'react-dom/server';
const state=vi.hoisted(()=>({allow:true}));
vi.mock('@/lib/draft-account-access',()=>({requireDraftAccountAccess:async()=>{if(!state.allow)throw Error('denied');return{user:{id:'reviewer'}};}}));
vi.mock('@/components/account-session-boundary',()=>({AccountSessionBoundary:({children}:{children:React.ReactNode})=>children}));
import Page from './page';
import Detail from './[slug]/page';
beforeEach(()=>{state.allow=true;});
it.each([81,85,86,126,469,488,516])('links source profile %s from the private directory with pending-scope warnings',async id=>{
 const html=renderToStaticMarkup(await Page({searchParams:Promise.resolve({q:String(id)})}));expect(html).toContain('/account/calculators/private-source-'+id);expect(html).toContain('SOURCE_INFORMED_PRIVATE_CONTRACT_PROPOSAL');expect(html).toContain('source completeness and applicability decisions remain pending');
});
it.each([81,85,86,126,469,488,516])('denies source profile %s before input controls are rendered',async id=>{
 state.allow=false;const html=renderToStaticMarkup(await Detail({params:Promise.resolve({slug:'private-source-'+id})}));expect(html).toContain('Reviewer access required');expect(html).not.toContain('Calculate preview');expect(html).not.toContain('Download reviewer');
});
it('does not manufacture private integrations for unsupported statutory-tax or provider scopes',async()=>{
 for(const id of [125,127,134,198,199]){const html=renderToStaticMarkup(await Page({searchParams:Promise.resolve({q:String(id)})}));expect(html).not.toContain('/account/calculators/private-source-'+id);}
});
