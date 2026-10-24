import {expect,it} from 'vitest';
import path from 'node:path';
import {createServer} from 'node:net';
it('serves CIDR only through the explicit private read-only fixture',async()=>{
 const {startDraftPreview}=await import(/* @vite-ignore */ path.resolve('scripts/draft-preview.mjs'));
 const listener=createServer();
 await new Promise<void>(resolve=>listener.listen(0,'127.0.0.1',resolve));
 const port=(listener.address() as {port:number}).port;
 await new Promise<void>((resolve,reject)=>listener.close(error=>error?reject(error):resolve()));
 const server=await startDraftPreview(port,{fixture:'cidr'});
 try {
  const base=`http://127.0.0.1:${server.httpServer.address().port}`;
  const headers={Authorization:`Basic ${Buffer.from(`reviewer:${server.draftPreviewAccessToken}`).toString('base64')}`};
  expect((await fetch(base+'/tests/cidr-review/')).status).toBe(401);
  const root=await fetch(base+'/',{headers,redirect:'manual'});
  expect(root.headers.get('location')).toBe('/tests/cidr-review/');
  const page=await fetch(base+'/tests/cidr-review/',{headers});
  expect(page.status).toBe(200);expect(page.headers.get('cache-control')).toBe('no-store');
  expect(await page.text()).toContain('/tests/cidr-review/main.tsx');
  expect((await fetch(base+'/',{method:'POST',headers})).status).toBe(405);
  expect((await fetch(base+'/',{headers:{...headers,Origin:'https://foreign.invalid'}})).status).toBe(403);
  for(const route of ['/.env','/.env.local','/.git/config','/@fs/etc/passwd'])expect([403,404]).toContain((await fetch(base+route,{headers})).status);
 }finally{await server.close();}
},30000);
