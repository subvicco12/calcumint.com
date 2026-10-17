import {expect,it} from 'vitest';
import {createChunks,stringToBase64URL} from '@supabase/ssr';
import {readableSessionCookies} from './session-cookies';
const url='https://synthetic.invalid';
const key='sb-synthetic-auth-token';
it('preserves valid raw and encoded Unicode transport without assigning session semantics',async()=>{
 for(const raw of ['{"legacy":"value"}','base64-'+stringToBase64URL(JSON.stringify({note:'₹漢字🙂'.repeat(3000)}))]){
  const cookies=createChunks(key,raw);expect(await readableSessionCookies(cookies,url)).toEqual(cookies);
 }
});
it('hides every unreadable session chunk but preserves names for SDK cleanup and all other namespaces',async()=>{
 const bad=createChunks(key,'base64-'+'!'.repeat(8000));
 const other=[{name:key+'-code-verifier',value:'pkce'},{name:key+'-code-verifier.0',value:'chunked-pkce'},{name:'sb-other-auth-token',value:'other-project'},{name:key+'.01',value:'not-an-sdk-chunk'},{name:'preferences',value:'value'}];
 expect(await readableSessionCookies([...bad,...other],url)).toEqual([...bad.map(c=>({...c,value:''})),...other]);
});
it('preserves absent first chunks and lets the SDK decide incomplete JSON/session structure',async()=>{
 for(const cookies of [[{name:key+'.1',value:'orphan'}],[{name:key,value:'base64-'+stringToBase64URL('{')}]] ){
  expect(await readableSessionCookies(cookies,url)).toEqual(cookies);
 }
});
it('does not retain an invalid-cookie decision after a fresh value replaces it',async()=>{
 const cookies=[{name:key,value:'base64-!!!!'}];expect((await readableSessionCookies(cookies,url))[0].value).toBe('');
 cookies[0].value='base64-'+stringToBase64URL('{}');expect(await readableSessionCookies(cookies,url)).toEqual(cookies);
});
