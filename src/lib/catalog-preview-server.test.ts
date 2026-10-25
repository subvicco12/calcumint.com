import {afterAll,beforeAll,expect,it} from 'vitest';
import path from 'node:path';
import {createServer} from 'node:http';
async function unusedPort(){const s=createServer();await new Promise<void>(r=>s.listen(0,'127.0.0.1',r));const {port}=s.address() as {port:number};await new Promise<void>(r=>s.close(()=>r()));return port;}
let server:{httpServer:{address:()=>{port:number}};close:()=>Promise<void>;draftPreviewAccessToken:string},base:string,authorization:string;
beforeAll(async()=>{const {startDraftPreview}=await import(/* @vite-ignore */ path.resolve('scripts/draft-preview.mjs'));server=await startDraftPreview(await unusedPort(),{fixture:'catalog'});base=`http://127.0.0.1:${server.httpServer.address().port}`;authorization=`Basic ${Buffer.from('reviewer:'+server.draftPreviewAccessToken).toString('base64')}`;},30000);
afterAll(async()=>{await server?.close();});
it('requires per-run reviewer authorization for entry and source',async()=>{for(const url of ['/tests/catalog-preview/','/src/components/calculator-review-workbench.tsx'])expect((await fetch(base+url)).status).toBe(401);});
it('serves only a private read-only catalog fixture without production credentials',async()=>{const headers={Authorization:authorization};const root=await fetch(base+'/',{headers,redirect:'manual'});expect(root.headers.get('location')).toBe('/tests/catalog-preview/');const r=await fetch(base+'/tests/catalog-preview/',{headers});expect(r.status).toBe(200);expect(r.headers.get('cache-control')).toBe('no-store');expect((await fetch(base+'/',{headers,method:'POST'})).status).toBe(405);expect((await fetch(base+'/',{headers:{...headers,Origin:'https://foreign.invalid'}})).status).toBe(403);expect([403,404]).toContain((await fetch(base+'/.env',{headers})).status);});
