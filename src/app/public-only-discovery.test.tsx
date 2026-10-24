import {afterEach,expect,it,vi} from 'vitest';
import {renderToStaticMarkup} from 'react-dom/server';
const publication=vi.hoisted(()=>({state:'available',slugs:new Set(['percentage-of-value-calculator','unit-conversion-calculator'])}));
vi.mock('@/lib/publication-manifest',()=>({getPublicationSnapshot:async()=>publication,getPublishedCalculatorSlugs:async()=>publication.slugs}));
vi.mock('@/lib/supabase/server',()=>({createSupabaseServerClient:()=>{throw new Error('Unexpected account lookup');}}));
import Home from './page';
import sitemap from './sitemap';
import {SiteHeader} from '@/components/site-header';
afterEach(()=>vi.unstubAllEnvs());
it('public discovery and header advertise only current scope without account reads',async()=>{
 vi.stubEnv('CALCUMINT_PRODUCT_MODE','public-only');
 const html=renderToStaticMarkup(await Home())+renderToStaticMarkup(await SiteHeader());
 expect(html).toContain('percentage-of-value-calculator');expect(html).toContain('unit-conversion-calculator');
 for(const link of ['/login','/pricing','/ai','/business-platform'])expect(html).not.toContain(`href="${link}`);
 const urls=(await sitemap()).map(x=>x.url);
 expect(urls.some(u=>u.endsWith('/pricing')||u.endsWith('/business-platform'))).toBe(false);
 expect(urls.filter(u=>u.includes('-calculator'))).toHaveLength(2);
});
it('qualifies company and legal descriptions of excluded full-product features',async()=>{
 vi.stubEnv('CALCUMINT_PRODUCT_MODE','public-only');
 for(const page of [await import('./about/page'),await import('./terms/page'),await import('./privacy/page')]){
  expect(renderToStaticMarkup(page.default())).toContain('References below to these features describe the full product');
 }
});
