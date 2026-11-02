import {beforeAll,afterAll,it,expect} from 'vitest';
import path from 'node:path';
let fixture:{origin:string;authorization:string;close:()=>Promise<void>};
beforeAll(async()=>{const m=await import(/* @vite-ignore */ path.resolve('scripts/statistics-preview.mjs'));fixture=await m.startStatisticsPreview();},30000);
afterAll(async()=>{await fixture?.close();});
it('requires random per-run reviewer credentials for page, source and worker entry',async()=>{
 for(const pathname of ['/tests/statistics-workbench/','/src/components/full-six/statistics-workbench.tsx','/src/lib/full-six/statistics/statistics.worker.ts','/@vite/client']){
  const r=await fetch(fixture.origin+pathname);expect(r.status).toBe(401);expect(r.headers.get('www-authenticate')).toContain('Basic');
 }
});
it('serves only authorized private fixture with no-store and read-only origin controls',async()=>{
 const headers={Authorization:fixture.authorization};
 const r=await fetch(fixture.origin+'/tests/statistics-workbench/?id=282',{headers});expect(r.status).toBe(200);expect(r.headers.get('cache-control')).toBe('no-store');expect(r.headers.get('x-frame-options')).toBe('DENY');expect(await r.text()).toContain('main.tsx');
 expect((await fetch(fixture.origin+'/tests/statistics-workbench/',{headers:{...headers,Origin:'https://untrusted.invalid'}})).status).toBe(403);
 expect((await fetch(fixture.origin+'/tests/statistics-workbench/',{headers,method:'POST'})).status).toBe(405);
 expect((await fetch(fixture.origin+'/tests/statistics-workbench/',{headers:{Authorization:'Basic wrong'}})).status).toBe(401);
});
it('refuses sensitive files even to authorized fixture requests',async()=>{
 for(const pathname of ['/.env','/.git/config','/public/favicon.ico'])expect((await fetch(fixture.origin+pathname,{headers:{Authorization:fixture.authorization}})).status).not.toBe(200);
});
it('supports concurrent independent ephemeral fixtures without credential reuse',async()=>{
 const m=await import(/* @vite-ignore */ path.resolve('scripts/statistics-preview.mjs'));const other=await m.startStatisticsPreview();
 try{expect(other.origin).not.toBe(fixture.origin);expect((await fetch(other.origin+'/tests/statistics-workbench/',{headers:{Authorization:fixture.authorization}})).status).toBe(401);expect((await fetch(other.origin+'/tests/statistics-workbench/',{headers:{Authorization:other.authorization}})).status).toBe(200);}finally{await other.close();}
});
