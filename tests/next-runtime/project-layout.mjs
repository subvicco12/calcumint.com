import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';

/** Valid maximum-length metadata must remain readable without horizontal scrolling. */
export async function verifyProjectLayout({db,auth,browser}){
 const id=randomUUID(),name='x'.repeat(120),description='D'.repeat(1000);
 await db.sql(`SET request.jwt.claim.sub='${db.users.owner.id}';
 UPDATE public.profiles SET plan='business' WHERE id='${db.users.owner.id}';
 INSERT INTO public.calculation_projects(id,user_id,name,description,created_at) VALUES('${id}','${db.users.owner.id}','${name}','${description}',now()+interval '1 second');
 INSERT INTO public.calculation_projects(user_id,name) SELECT '${db.users.owner.id}','Layout auxiliary '||i FROM generate_series(1,21) i;
 INSERT INTO public.saved_scenarios(user_id,project_id,name,calculator_slug,calculator_version,input_data,output_data) VALUES('${db.users.owner.id}','${id}','${'Y'.repeat(120)}','slope-calculator',1,'{"rise":6,"run":3}','{"result":1.999}');`);
 await browser.identity(auth.cookie(db.users.owner));
 const measurements=[];
 for(const width of [320,1280]){
  await browser.send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width===320});
  for(const route of ['/account/projects',`/account/projects/${id}`]){
   await browser.visit(route);await browser.until(`document.body.innerText.includes(${JSON.stringify(name)}) && !document.body.innerText.includes('Verifying account session')`);
   const measurement=await browser.js(`({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,unlabeled:[...document.querySelectorAll('input:not([type=hidden]),select,textarea')].filter(e=>!e.labels?.length).length})`);
   measurements.push({route:route.includes(id)?'detail':'list',...measurement});
   assert(measurement.scrollWidth<=measurement.width+1,`Project ${route.includes(id)?'detail':'list'} overflow at ${width}: ${measurement.scrollWidth}`);
   assert.equal(measurement.unlabeled,0,'Project controls need accessible labels');
  }
 }
 await browser.visit('/account/projects');await browser.until(`!!document.querySelector('nav[aria-label="Project pagination"]') && !document.body.innerText.includes('Verifying account session')`);
 const next=await browser.js(`(()=>{const a=[...document.querySelectorAll('nav[aria-label="Project pagination"] a')].find(e=>e.textContent==='Next page');a.focus();return {href:a.getAttribute('href'),focused:document.activeElement===a}})()`);
 assert(next.focused,'Pagination link must accept keyboard focus');
 await browser.send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});
 await browser.send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});
 await browser.until(`location.pathname+location.search===${JSON.stringify(next.href)} && [...document.querySelectorAll('nav[aria-label="Project pagination"] a')].some(a=>a.textContent==='First page') && !document.body.innerText.includes('Verifying account session')`);
 return {measurements,keyboardNextPage:true};
}
