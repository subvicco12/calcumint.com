import {createServer} from 'vite';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
export async function startDraftPreview(port = 4179) {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const server = await createServer({configFile:false,envFile:false,root,
    appType:'spa',publicDir:false,resolve:{alias:{'@':path.join(root,'src')}},
    esbuild:{jsx:'automatic'},server:{hmr:false,host:'127.0.0.1',port,strictPort:true,cors:false,
      fs:{strict:true,allow:[root],deny:['**/.env','**/.env.*','**/.git/**','**/.aws/**','**/.codex/**']}},
    plugins:[{name:'private-draft-entry',configureServer(s){s.middlewares.use((req,res,next)=>{
      if(req.url==='/'||req.url==='/?'){res.statusCode=302;res.setHeader('Location','/tests/draft-preview/');res.end();return;}next();
    });}}]});
  await server.listen(); return server;
}
if(process.argv[1]===fileURLToPath(import.meta.url)) {
  await startDraftPreview();
  console.log('Private synthetic reviewer preview: http://127.0.0.1:4179/tests/draft-preview/');
}
