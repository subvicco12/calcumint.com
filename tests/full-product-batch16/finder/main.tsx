import {createRoot} from 'react-dom/client';
import {AiFinder} from '../../../src/components/ai-finder';
import '../../../src/app/globals.css';
import '../../../src/app/ai.css';

type Pending={query:string;signal?:AbortSignal|null;resolve:(response:Response)=>void};
const pending:Pending[]=[];
const originalFetch=window.fetch.bind(window);
// Only the finder transport is synthetic. Deliberately ignore abort at this
// boundary so an obsolete response tests the actual component's stale guard.
window.fetch=(input,init)=>{
 if(input!=='/api/ai/find')return originalFetch(input,init);
 return new Promise<Response>(resolve=>pending.push({query:JSON.parse(String(init?.body)).query,signal:init?.signal,resolve}));
};
Object.assign(window,{__finderFixture:{
 requests:()=>pending.map(request=>({query:request.query,aborted:request.signal?.aborted??false})),
 respond:(index:number,payload:unknown,status=200)=>pending[index].resolve(new Response(JSON.stringify(payload),{status,headers:{'content-type':'application/json'}})),
}});
createRoot(document.getElementById('root')!).render(<main style={{maxWidth:900,margin:'auto',padding:12,overflowWrap:'anywhere'}}><h1>Private finder workflow acceptance</h1><p>Synthetic finder endpoint only. No provider, account, publication or production acceptance.</p><AiFinder/></main>);
