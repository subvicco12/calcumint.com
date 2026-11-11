import {beforeAll,afterAll,it,expect} from 'vitest';
import path from 'node:path';
type Fixture={origin:string;authorization:string;close:()=>Promise<void>};
let fixture:Fixture;let other:Fixture;
beforeAll(async()=>{const m=await import(/* @vite-ignore */ path.resolve('scripts/calculator-closure-preview.mjs'));fixture=await m.startCalculatorClosurePreview();other=await m.startCalculatorClosurePreview();for(const server of [fixture,other]){const ready=await fetch(server.origin+'/tests/calculator-first-20261105/',{headers:{Authorization:server.authorization}});expect(ready.status).toBe(200);await ready.text();}},30000);
afterAll(async()=>{const results=await Promise.allSettled([fixture?.close(),other?.close()]);const failures=results.flatMap(result=>result.status==='rejected'?[result.reason]:[]);if(failures.length)throw new AggregateError(failures,'Private fixture cleanup failed');});
it('protects every calculator closure page, source and observer behind reviewer auth',async()=>{
 for(const route of ['/tests/calculator-first-20261105/','/tests/calculator-first-20261105/account-observer.tsx','/src/components/calculator-interactive.tsx'])expect((await fetch(fixture.origin+route)).status).toBe(401);
});
it('enforces private origin, read-only methods and sensitive-file denial',async()=>{
 const headers={Authorization:fixture.authorization};const r=await fetch(fixture.origin+'/tests/calculator-first-20261105/?id=209',{headers});expect(r.status).toBe(200);expect(r.headers.get('cache-control')).toBe('no-store');expect(r.headers.get('x-frame-options')).toBe('DENY');
 expect((await fetch(fixture.origin+'/tests/calculator-first-20261105/',{headers:{...headers,Origin:'https://foreign.invalid'}})).status).toBe(403);
 expect((await fetch(fixture.origin+'/tests/calculator-first-20261105/',{headers,method:'POST'})).status).toBe(405);
 for(const route of ['/.git/config','/.env'])expect((await fetch(fixture.origin+route,{headers})).status).not.toBe(200);
});
it('isolates concurrent ephemeral servers and credentials',async()=>{
 expect(other.origin).not.toBe(fixture.origin);const response=await fetch(other.origin+'/tests/calculator-first-20261105/',{headers:{Authorization:fixture.authorization}});expect(response.status).toBe(401);await response.text();
});
