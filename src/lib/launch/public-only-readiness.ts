import {capabilitiesForMode,resolveProductMode} from '../product-mode';
import type {PublicationSnapshot} from '../publication-manifest';
import type {ReadinessCheck,ReadinessReport} from './readiness';
import {calculatorRegistry} from '@/calculators/registry';
import {restrictPublishedSlugs,PUBLIC_ONLY_IDENTITIES} from '@/calculators/public-only-scope';
import {resolvePublicCalculatorRoute} from '@/calculators/public-route-readiness';
/** Technical scoped evidence only. The caller must obtain the protected snapshot. */
export function buildPublicOnlyReadinessReport(env: NodeJS.ProcessEnv, publication: PublicationSnapshot): ReadinessReport & {scope:'public-only';releaseAuthorized:false} {
 const mode=resolveProductMode(env.CALCUMINT_PRODUCT_MODE);
 const capabilities=capabilitiesForMode(mode);
 const exact=restrictPublishedSlugs('public-only',calculatorRegistry.list(),publication.slugs);
 const checks:ReadinessCheck[]=[
  {id:'scope:public-only',ok:mode==='public-only',message:'Explicit public-only mode required'},
  {id:'site:canonical-host',ok:/^https:\/\/calcumint\.com\/?$/i.test(env.NEXT_PUBLIC_SITE_URL??''),message:'Canonical HTTPS origin required'},
  ...(['NEXT_PUBLIC_SUPABASE_URL','NEXT_PUBLIC_SUPABASE_ANON_KEY'] as const).map(key=>({id:`env:${key}`,ok:Boolean(env[key]?.trim()),message:`${key} configured`})),
  {id:'publication:available',ok:publication.state==='available',message:'Protected publication authority must be observed'},
  {id:'capabilities:excluded',ok:Object.entries(capabilities).every(([key,on])=>key==='calculatorEngine'||!on),message:'Excluded capabilities must be disabled'},
  ...PUBLIC_ONLY_IDENTITIES.map(identity=>({id:`publication:${identity.id}:v${identity.version}`,ok:exact.has(identity.slug)&&resolvePublicCalculatorRoute(identity.category,identity.slug,publication).state==='ready',message:`Exact governed route required: ${identity.slug}`})),
  {id:'publication:scope',ok:[...publication.slugs].every(slug=>PUBLIC_ONLY_IDENTITIES.some(identity=>identity.slug===slug)),message:'Observed public set must remain within the approved two identities'}
 ];
 return {scope:'public-only',releaseAuthorized:false,ready:checks.every(check=>check.ok),checks};
}
