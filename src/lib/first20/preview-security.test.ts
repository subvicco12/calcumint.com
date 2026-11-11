import {beforeAll,afterAll,it,expect} from 'vitest';
import path from 'node:path';
type Fixture={origin:string;authorization:string;close:()=>Promise<void>};
let fixture:Fixture;let other:Fixture;
beforeAll(async()=>{const m=await import(/* @vite-ignore */ path.resolve('scripts/first20-preview.mjs'));fixture=await m.startFirst20Preview();other=await m.startFirst20Preview();for(const server of [fixture,other]){const ready=await fetch(server.origin+'/tests/first20-publication/',{headers:{Authorization:server.authorization}});expect(ready.status).toBe(200);await ready.text();}},30000);
afterAll(async()=>{const results=await Promise.allSettled([fixture?.close(),other?.close()]);const failures=results.flatMap(result=>result.status==='rejected'?[result.reason]:[]);if(failures.length)throw new AggregateError(failures,'Private fixture cleanup failed');});
it('protects every first20 page, source and observer behind reviewer auth',async()=>{
 for(const route of ['/tests/first20-publication/','/tests/first20-publication/account-observer.tsx','/src/components/calculator-interactive.tsx'])expect((await fetch(fixture.origin+route)).status).toBe(401);
});
it('enforces private origin, read-only methods and sensitive-file denial',async()=>{
 const headers={Authorization:fixture.authorization};const r=await fetch(fixture.origin+'/tests/first20-publication/?id=209',{headers});expect(r.status).toBe(200);expect(r.headers.get('cache-control')).toBe('no-store');expect(r.headers.get('x-frame-options')).toBe('DENY');
 expect((await fetch(fixture.origin+'/tests/first20-publication/',{headers:{...headers,Origin:'https://foreign.invalid'}})).status).toBe(403);
 expect((await fetch(fixture.origin+'/tests/first20-publication/',{headers,method:'POST'})).status).toBe(405);
 for(const route of ['/.git/config','/.env'])expect((await fetch(fixture.origin+route,{headers})).status).not.toBe(200);
});
it('isolates concurrent ephemeral servers and credentials',async()=>{
 expect(other.origin).not.toBe(fixture.origin);const response=await fetch(other.origin+'/tests/first20-publication/',{headers:{Authorization:fixture.authorization}});expect(response.status).toBe(401);await response.text();
});
