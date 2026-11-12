/** Observe genuine native login events without reading credential contents. */
export async function installLoginDiagnostics(browser){
 await browser.js(`(()=>{
  window.__gotrueLoginDiagnostics={startedAt:performance.now(),events:[]};
  for(const type of ['pointerdown','click','submit','invalid'])document.addEventListener(type,event=>{
   const target=event.target;
   if(!(target instanceof Element)||!target.closest('form'))return;
   const row={type,trusted:event.isTrusted,tag:target.tagName,name:target.getAttribute('name'),at:performance.now(),defaultPrevented:event.defaultPrevented};
   window.__gotrueLoginDiagnostics.events.push(row);
   queueMicrotask(()=>row.defaultPrevented=event.defaultPrevented);
  },true);
 })()`);
}
export async function loginDiagnostics(browser){
 return browser.js(`(()=>{
  const password=document.querySelector('input[name="password"]'),form=password?.form,button=form?.querySelector('button[type="submit"]'),rect=button?.getBoundingClientRect();
  const hit=rect&&document.elementFromPoint(rect.x+rect.width/2,rect.y+rect.height/2);
  return {pathname:location.pathname,readyState:document.readyState,events:window.__gotrueLoginDiagnostics?.events||[],
   controls:form?[...form.elements].map(e=>({tag:e.tagName,name:e.name,type:e.type,disabled:e.disabled,valueLength:typeof e.value==='string'?e.value.length:null,valid:e.validity?.valid,valueMissing:e.validity?.valueMissing,typeMismatch:e.validity?.typeMismatch})):[],
   button:rect?{rect:{x:rect.x,y:rect.y,width:rect.width,height:rect.height},visible:!!button.getClientRects().length,hitIsButton:hit===button||button.contains(hit),hitTag:hit?.tagName,hitRole:hit?.getAttribute('role'),hydrated:Object.keys(button).some(k=>k.startsWith('__reactProps$'))}:null};
 })()`);
}

/** Strict allowlist: no URLs, request bodies, headers, cookies or error text. */
export function summarizeLoginNetwork(network=[]){
 const counts={loginPosts:0,accountRequests:0};
 for(const request of network){let pathname;try{pathname=new URL(request.url).pathname;}catch{continue;}
  if(pathname==='/login'&&request.method==='POST')counts.loginPosts++;
  if(pathname==='/account')counts.accountRequests++;
 }
 return counts;
}

export function summarizeLoginAuth(requests=[]){
 return {tokenStatuses:requests.filter(r=>r.method==='POST'&&r.path==='/auth/v1/token'&&Number.isInteger(r.status)&&r.status>=100&&r.status<=599).map(r=>r.status)};
}
