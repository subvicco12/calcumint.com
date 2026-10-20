import {renderToStaticMarkup} from 'react-dom/server';
import {expect,it,vi} from 'vitest';
vi.mock('@/components/auth-panel',()=>({AuthPanel:()=>null}));
import LoginPage from './page';
it('does not render unrecognized query text as an authentication notice',async()=>{
 const html=renderToStaticMarkup(await LoginPage({searchParams:Promise.resolve({error:'synthetic-sensitive-session-detail',message:'synthetic-sensitive-confirmation-detail'})}));
 expect(html).not.toContain('synthetic-sensitive');expect(html).toContain('role="alert"');
});
it('announces the recognized confirmation notice as a status',async()=>{
 const html=renderToStaticMarkup(await LoginPage({searchParams:Promise.resolve({message:'Check your email to confirm your account.'})}));
 expect(html).toContain('role="status"');expect(html).toContain('Check your email to confirm your account.');
});
