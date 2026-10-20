// @vitest-environment jsdom
import {cleanup,render} from '@testing-library/react';
import {afterEach,expect,it,vi} from 'vitest';
import {draftPreviewDefinitions} from '@/calculators/final-framework/draft-preview-catalog';
import {calculatorRegistry} from '@/calculators/registry';
import {composePublishedCalculatorSlugs} from '@/calculators/publication-authority';
import {buildPublicCalculatorSearchIndex} from '@/calculators/search-index';
import {getPublicCalculatorContent} from '@/calculators/public-content';
const authority=vi.hoisted(()=>({state:'available',slugs:new Set<string>()}));
vi.mock('@/lib/publication-manifest',()=>({getPublicationSnapshot:async()=>authority,getPublishedCalculatorSlugs:async()=>authority.slugs}));
vi.mock('next/navigation',()=>({notFound:()=>{throw new Error('NOT_FOUND');},usePathname:()=>'/calculators'}));
vi.mock('@/components/calculator-interactive',()=>({CalculatorInteractive:()=>null}));
vi.mock('@/components/free-user-ad-slot',()=>({FreeUserAdSlot:()=>null}));
import HomePage from './page';
import DirectoryPage from './calculators/page';
import CategoryPage from './calculators/[category]/page';
import DetailPage,{generateMetadata} from './calculators/[category]/[slug]/page';
import sitemap from './sitemap';
afterEach(cleanup);
it('excludes all fourteen DRAFT identities from registry/manifest even with forged publication claims',()=>{
 const manifest=draftPreviewDefinitions.map(d=>({calculator_key:`unapproved-draft-${d.masterId}`,slug:d.slug,version:d.version}));
 expect(composePublishedCalculatorSlugs(calculatorRegistry.list(),manifest).size).toBe(0);
 for(const d of draftPreviewDefinitions){expect(calculatorRegistry.getBySlug(d.slug)).toBeUndefined();expect(getPublicCalculatorContent(d.slug)).toBeUndefined();}
});
it('excludes all fourteen from actual home/directory/category/related links, search, detail metadata and sitemap',async()=>{
 authority.slugs=new Set(['loan-emi-calculator',...draftPreviewDefinitions.map(d=>d.slug)]);
 const loan=getPublicCalculatorContent('loan-emi-calculator')!;
 const checkLinks=()=>{for(const link of document.querySelectorAll('a'))for(const d of draftPreviewDefinitions)expect(link.getAttribute('href')?.split(/[/?#]/)).not.toContain(d.slug);};
 for(const page of [await HomePage(),await DirectoryPage({}),await CategoryPage({params:Promise.resolve({category:loan.category})}),await DetailPage({params:Promise.resolve({category:loan.category,slug:loan.slug})})]){render(page);checkLinks();cleanup();}
 const search=buildPublicCalculatorSearchIndex(authority.slugs),map=await sitemap();
 for(const d of draftPreviewDefinitions){
  expect(search.some(row=>row.slug===d.slug)).toBe(false);expect(map.some(row=>row.url.split(/[/?#]/).includes(d.slug))).toBe(false);
  const params=Promise.resolve({category:'math',slug:d.slug});expect(await generateMetadata({params})).toEqual({});await expect(DetailPage({params})).rejects.toThrow('NOT_FOUND');
 }
});
