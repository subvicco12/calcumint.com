import {calculatorRegistry} from '@/calculators/registry';
import {expect,it,vi} from 'vitest';
import {buildPublicOnlyReadinessReport} from './public-only-readiness';
const env:NodeJS.ProcessEnv={NODE_ENV:'test',CALCUMINT_PRODUCT_MODE:'public-only',NEXT_PUBLIC_SITE_URL:'https://calcumint.com',NEXT_PUBLIC_SUPABASE_URL:'https://synthetic.invalid',NEXT_PUBLIC_SUPABASE_ANON_KEY:'synthetic-anonymous'};
const both={state:'available' as const,slugs:new Set(['percentage-of-value-calculator','unit-conversion-calculator'])};
it('requires observed authority for both calculators independently from configuration',()=>{
 expect(buildPublicOnlyReadinessReport(env,{state:'unavailable',slugs:new Set()}).ready).toBe(false);
 expect(buildPublicOnlyReadinessReport(env,{state:'available',slugs:new Set(['unit-conversion-calculator'])}).ready).toBe(false);
 expect(buildPublicOnlyReadinessReport(env,both)).toMatchObject({scope:'public-only',ready:true,releaseAuthorized:false});
 for(const key of Object.keys(env).filter(key=>key!=="NODE_ENV"))expect(buildPublicOnlyReadinessReport({...env,[key]:''},both).ready).toBe(false);
 expect(buildPublicOnlyReadinessReport({...env,CALCUMINT_PRODUCT_MODE:'full'},both).ready).toBe(false);
 expect(buildPublicOnlyReadinessReport({...env,PADDLE_API_KEY:'synthetic',AI_API_KEY:'synthetic',SUPABASE_SERVICE_ROLE_KEY:'synthetic'},both).ready).toBe(true);
});

it('rejects repository version drift even if a supplied snapshot still names both slugs',()=>{
 const original=calculatorRegistry.list();
 const spy=vi.spyOn(calculatorRegistry,'list').mockReturnValue(original.map(d=>d.id==='core.unit-conversion'?{...d,version:2}:d));
 try {expect(buildPublicOnlyReadinessReport(env,both).ready).toBe(false);} finally {spy.mockRestore();}
});
