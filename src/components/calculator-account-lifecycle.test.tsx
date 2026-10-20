// @vitest-environment jsdom
import {Blob as NodeBlob} from 'node:buffer';
import {cleanup,fireEvent,render,screen,waitFor} from '@testing-library/react';import {afterEach,expect,it,vi} from 'vitest';
const state=vi.hoisted(()=>{process.env.NEXT_PUBLIC_SUPABASE_URL='https://example.invalid';process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY='synthetic-key';return {plan:'pro',authMode:'ok',rpcError:null as unknown,readError:false,count:0 as number|null,writeMode:'ok',pendingWrites:[] as {resolve:(value:unknown)=>void;reject:(error:Error)=>void}[],writes:[] as {table:string;value:Record<string,unknown>}[],auth:[] as {resolve:(value:unknown)=>void;reject:(error:Error)=>void}[]};});
vi.mock('./use-calculator-plan',()=>({useCalculatorPlan:()=>state.plan}));
vi.mock('@/lib/supabase/browser',()=>({createSupabaseBrowserClient:()=>({auth:{getUser:()=>state.authMode==='reject'?Promise.reject(new Error('synthetic auth unavailable')):state.authMode==='defer'?new Promise((resolve,reject)=>state.auth.push({resolve,reject})):Promise.resolve({data:{user:{id:'synthetic-user'}}})},rpc:async(name:string,args:Record<string,unknown>)=>{expect(name).toBe('save_calculation_history_atomic');expect(args.p_expected_owner_id).toBe('synthetic-user');const value={user_id:'synthetic-user',calculator_slug:args.p_calculator_slug,calculator_version:args.p_calculator_version,input_data:args.p_input_data,output_data:args.p_output_data};state.writes.push({table:'calculation_history',value});if(state.writeMode==='defer')return new Promise((resolve,reject)=>state.pendingWrites.push({resolve:result=>resolve({...result as object,data:args.p_request_id}),reject}));if(state.writeMode==='reject')throw new Error('synthetic write transport');return {data:args.p_request_id,error:state.rpcError??(state.writeMode==='error'?{code:'synthetic'}:null)};},from:(table:string)=>{
 const query={select:()=>query,eq:()=>query,maybeSingle:async()=>({data:null,error:state.readError?{code:'synthetic'}:null}),then:(resolve:(value:unknown)=>unknown)=>Promise.resolve({data:null,count:state.count,error:state.readError?{code:'synthetic'}:null}).then(resolve),insert:async()=>{throw new Error('History must use atomic RPC');},upsert:async(value:Record<string,unknown>)=>{state.writes.push({table,value});if(state.writeMode==='defer')return new Promise((resolve,reject)=>state.pendingWrites.push({resolve,reject}));if(state.writeMode==='reject')throw new Error('synthetic write transport');return {error:state.writeMode==='error'?{code:'synthetic'}:null};},delete:()=>query};return query;
}})}));
import {CalculatorAccountActions} from './calculator-account-actions';
afterEach(()=>{cleanup();state.plan='pro';state.rpcError=null;state.authMode='ok';state.readError=false;state.writes=[];state.auth=[];state.count=0;state.writeMode='ok';state.pendingWrites=[];vi.unstubAllGlobals();vi.restoreAllMocks();});
const props={calculatorSlug:'sip-calculator',calculatorVersion:1,input:{rate:0},output:{value:.001}};
const user={data:{user:{id:'synthetic-user'}}};
it.each(['free','pro','business'])('excludes duplicate save/favorite requests immediately and restores controls on %s',async plan=>{
 state.plan=plan;render(<CalculatorAccountActions {...props}/>);const save=await screen.findByRole('button',{name:'Save calculation'});state.authMode='defer';fireEvent.click(save);fireEvent.click(save);expect(state.auth).toHaveLength(1);expect((save as HTMLButtonElement).disabled).toBe(true);expect(save.getAttribute('aria-busy')).toBe('true');state.auth[0].resolve(user);await waitFor(()=>expect(state.writes).toHaveLength(1));await waitFor(()=>expect((save as HTMLButtonElement).disabled).toBe(false));
 const favorite=screen.getByRole('button',{name:'☆ Favorite'});fireEvent.click(favorite);fireEvent.click(favorite);expect(state.auth).toHaveLength(2);expect((favorite as HTMLButtonElement).disabled).toBe(true);state.auth[1].resolve(user);await waitFor(()=>expect(state.writes).toHaveLength(2));expect(await screen.findByRole('button',{name:'★ Favorited'})).toBeTruthy();
});
it('reports read/auth failure with keyboard-retry control and rejects unknown quota reads',async()=>{
 state.readError=true;render(<CalculatorAccountActions {...props}/>);expect(await screen.findByRole('alert')).toBeTruthy();expect(screen.queryByRole('button',{name:'Save calculation'})).toBeNull();state.readError=false;fireEvent.click(screen.getByRole('button',{name:'Retry account actions'}));expect(await screen.findByRole('button',{name:'Save calculation'})).toBeTruthy();
});
it('handles rejected operation auth, releases exclusion and supports retry without unhandled rejection',async()=>{
 render(<CalculatorAccountActions {...props}/>);const save=await screen.findByRole('button',{name:'Save calculation'});state.authMode='defer';fireEvent.click(save);state.auth[0].reject(new Error('synthetic transport failure'));expect(await screen.findByRole('alert')).toBeTruthy();expect((save as HTMLButtonElement).disabled).toBe(false);state.authMode='ok';fireEvent.click(save);await waitFor(()=>expect(state.writes).toHaveLength(1));
});
it.each(['slug','version'])('does not apply old favorite/save completion to a changed calculator %s',async changed=>{
 const view=render(<CalculatorAccountActions {...props}/>);const favorite=await screen.findByRole('button',{name:'☆ Favorite'});state.authMode='defer';fireEvent.click(favorite);state.authMode='ok';view.rerender(<CalculatorAccountActions {...props} calculatorSlug={changed==='slug'?'compound-interest-calculator':props.calculatorSlug} calculatorVersion={changed==='version'?2:1}/>);expect(await screen.findByRole('button',{name:'☆ Favorite'})).toBeTruthy();state.auth[0].resolve(user);await waitFor(()=>expect(state.writes).toHaveLength(1));expect(screen.queryByRole('button',{name:'★ Favorited'})).toBeNull();expect(screen.queryByText('Added to favorites.')).toBeNull();
});

it('keeps exclusion during the write await, handles write failure and permits a later deliberate retry',async()=>{
 render(<CalculatorAccountActions {...props}/>);const save=await screen.findByRole('button',{name:'Save calculation'});state.writeMode='defer';fireEvent.click(save);await waitFor(()=>expect(state.pendingWrites).toHaveLength(1));fireEvent.click(save);expect(state.writes).toHaveLength(1);expect((save as HTMLButtonElement).disabled).toBe(true);state.pendingWrites[0].reject(new Error('synthetic write unavailable'));expect(await screen.findByRole('alert')).toBeTruthy();expect((save as HTMLButtonElement).disabled).toBe(false);
 state.writeMode='error';fireEvent.click(save);await waitFor(()=>expect(state.writes).toHaveLength(2));await waitFor(()=>expect((save as HTMLButtonElement).disabled).toBe(false));state.writeMode='ok';fireEvent.click(save);await waitFor(()=>expect(state.writes).toHaveLength(3));expect(await screen.findByRole('status')).toHaveProperty('textContent','Calculation saved to your history.');
});
it('rejects unavailable counts instead of assuming zero, and preserves existing Free limits',async()=>{
 state.count=null;const view=render(<CalculatorAccountActions {...props}/>);expect(await screen.findByRole('alert')).toBeTruthy();expect(screen.queryByRole('button',{name:'Save calculation'})).toBeNull();cleanup();state.count=20;state.plan='free';state.rpcError={code:'P0001',message:'Free accounts can keep up to 20 calculations.'};render(<CalculatorAccountActions {...props}/>);fireEvent.click(await screen.findByRole('button',{name:'Save calculation'}));expect(await screen.findByRole('alert')).toHaveProperty('textContent','Could not save. Free accounts can keep up to 20 calculations.');expect(state.writes).toHaveLength(1);fireEvent.click(screen.getByRole('button',{name:'☆ Favorite'}));await waitFor(()=>expect(screen.getByRole('alert').textContent).toContain('up to 10 favorites'));expect(state.writes).toHaveLength(1);view.unmount();
});
it('handles initial rejected authentication with retry and keeps old save completion scoped to its captured identity',async()=>{
 state.authMode='reject';const view=render(<CalculatorAccountActions {...props}/>);expect(await screen.findByRole('alert')).toBeTruthy();state.authMode='ok';fireEvent.click(screen.getByRole('button',{name:'Retry account actions'}));const save=await screen.findByRole('button',{name:'Save calculation'});state.writeMode='defer';fireEvent.click(save);await waitFor(()=>expect(state.pendingWrites).toHaveLength(1));view.rerender(<CalculatorAccountActions {...props} calculatorSlug="compound-interest-calculator" calculatorVersion={2}/>);expect(await screen.findByRole('button',{name:'Save calculation'})).toBeTruthy();state.pendingWrites[0].resolve({error:null});await waitFor(()=>expect(state.writes).toHaveLength(1));expect(state.writes[0].value).toMatchObject({calculator_slug:'sip-calculator',calculator_version:1,input_data:props.input,output_data:props.output});expect(screen.queryByText('Calculation saved to your history.')).toBeNull();
});

it('excludes repeated read retries and exposes the pending read before keyboard recovery',async()=>{
 state.readError=true;render(<CalculatorAccountActions {...props}/>);const retry=await screen.findByRole('button',{name:'Retry account actions'});state.readError=false;state.authMode='defer';fireEvent.click(retry);fireEvent.click(retry);expect(screen.queryByRole('alert')).toBeNull();expect(screen.getByRole('status').textContent).toBe('Loading account actions…');expect(screen.getByRole('status').getAttribute('aria-busy')).toBe('true');await waitFor(()=>expect(state.auth).toHaveLength(1));state.auth[0].resolve(user);expect(await screen.findByRole('button',{name:'Save calculation'})).toBeTruthy();
});

it.each(['free','pro','business'])('keeps local scenario workspace available during account failure and retry on %s',async plan=>{
 state.plan=plan;state.readError=true;
 render(<CalculatorAccountActions {...props}/>);
 expect(await screen.findByRole('button',{name:'Retry account actions'})).toBeTruthy();
 const capture=screen.getByRole('button',{name:'Capture baseline A'}) as HTMLButtonElement;
 expect(capture.disabled).toBe(plan==='free');
 if(plan!=='free')fireEvent.click(capture);
 state.readError=false;state.authMode='defer';fireEvent.click(screen.getByRole('button',{name:'Retry account actions'}));
 expect(screen.getByText('Loading account actions…')).toBeTruthy();
 if(plan!=='free')expect(screen.getByRole('button',{name:'Replace baseline A'})).toBeTruthy();
 else expect(screen.getByRole('button',{name:'Capture baseline A'})).toHaveProperty('disabled',true);
 await waitFor(()=>expect(state.auth).toHaveLength(1));state.auth[0].resolve(user);
 expect(await screen.findByRole('button',{name:'Save calculation'})).toBeTruthy();
 if(plan!=='free'){
  expect(screen.getByRole('button',{name:'Replace baseline A'})).toBeTruthy();
  expect(screen.getByText('Complete snapshot A (baseline)')).toBeTruthy();
 }
 expect(state.writes).toHaveLength(0);
});

it.each(['pro','business'])('preserves exact captured exports through initial auth rejection and invalid current data on %s',async plan=>{
 state.plan=plan;state.authMode='defer';let blob:NodeBlob|undefined;
 vi.stubGlobal('Blob',NodeBlob);vi.stubGlobal('URL',{createObjectURL:(value:NodeBlob)=>{blob=value;return 'blob:synthetic';},revokeObjectURL:()=>{}});
 vi.spyOn(HTMLAnchorElement.prototype,'click').mockImplementation(()=>{});
 const view=render(<CalculatorAccountActions {...props}/>);
 fireEvent.click(screen.getByRole('button',{name:'Capture baseline A'}));
 await waitFor(()=>expect(state.auth).toHaveLength(1));state.auth[0].reject(new Error('synthetic auth failure'));
 expect(await screen.findByRole('button',{name:'Retry account actions'})).toBeTruthy();
 view.rerender(<CalculatorAccountActions {...props} output={{value:Infinity}}/>);
 expect(screen.getByRole('button',{name:'Replace baseline A'})).toHaveProperty('disabled',true);
 fireEvent.click(screen.getByRole('button',{name:'Export scenario set JSON'}));
 const exported=JSON.parse(await blob!.text());
 expect(exported.scenarios[0].output).toEqual(props.output);
 fireEvent.click(screen.getByRole('button',{name:'Export scenario set CSV'}));
 expect(await blob!.text()).toContain('0.001');
 expect(screen.queryByRole('button',{name:'Save calculation'})).toBeNull();
 expect(state.writes).toHaveLength(0);
});

const actionCases=[{name:'history',button:'Save calculation',limit:20,table:'calculation_history'},{name:'favorite',button:'☆ Favorite',limit:10,table:'favorites'}];
it.each(actionCases)('uses capacity freed in another tab before $name save',async item=>{
 state.plan='free';state.count=item.limit;render(<CalculatorAccountActions {...props}/>);
 const button=await screen.findByRole('button',{name:item.button});state.count=item.limit-1;fireEvent.click(button);
 await waitFor(()=>expect(state.writes).toHaveLength(1));expect(state.writes[0].table).toBe(item.table);
});
it.each(actionCases)('rejects capacity consumed in another tab before $name save',async item=>{
 state.plan='free';render(<CalculatorAccountActions {...props}/>);const button=await screen.findByRole('button',{name:item.button});
 state.count=item.limit;if(item.name==='history')state.rpcError={code:'P0001',message:'Free accounts can keep up to 20 calculations.'};fireEvent.click(button);await screen.findByRole('alert');expect(state.writes).toHaveLength(item.name==='history'?1:0);
});
it.each(actionCases.flatMap(item=>[null,-1,1.5,Infinity].map(count=>({...item,count}))))('uses authoritative $name capacity handling for changed client quota $count',async item=>{
 state.plan='free';render(<CalculatorAccountActions {...props}/>);const button=await screen.findByRole('button',{name:item.button});
 state.count=item.count;fireEvent.click(button);if(item.name==='history'){await waitFor(()=>expect(state.writes).toHaveLength(1));expect(await screen.findByRole('status')).toHaveProperty('textContent','Calculation saved to your history.');}else{await screen.findByRole('alert');expect(state.writes).toHaveLength(0);}
});
it.each(actionCases)('recovers a failed $name capacity check without losing valid current output',async item=>{
 state.plan='free';render(<CalculatorAccountActions {...props}/>);const button=await screen.findByRole('button',{name:item.button});
 state.readError=true;if(item.name==='history')state.rpcError={code:'synthetic'};fireEvent.click(button);await screen.findByRole('alert');expect(state.writes).toHaveLength(item.name==='history'?1:0);
 state.readError=false;state.rpcError=null;fireEvent.click(button);await waitFor(()=>expect(state.writes).toHaveLength(item.name==='history'?2:1));
 if(item.name==='history')expect(state.writes[0].value.output_data).toEqual(props.output);
});
it('uses the atomic history RPC for Free saves when a client quota read becomes unavailable',async()=>{
 state.plan='free';render(<CalculatorAccountActions {...props}/>);const save=await screen.findByRole('button',{name:'Save calculation'});
 state.readError=true;state.count=null;fireEvent.click(save);await waitFor(()=>expect(state.writes).toHaveLength(1));
 expect(state.writes[0]).toMatchObject({table:'calculation_history',value:{output_data:props.output}});expect(await screen.findByRole('status')).toHaveProperty('textContent','Calculation saved to your history.');
});
it.each(['pro','business'])('retains unlimited %s saves without adding a quota availability dependency',async plan=>{
 state.plan=plan;render(<CalculatorAccountActions {...props}/>);const save=await screen.findByRole('button',{name:'Save calculation'});
 state.readError=true;state.count=null;fireEvent.click(save);await waitFor(()=>expect(state.writes).toHaveLength(1));
 expect(state.writes[0].value.output_data).toEqual(props.output);
 fireEvent.click(screen.getByRole('button',{name:'☆ Favorite'}));await waitFor(()=>expect(state.writes).toHaveLength(2));
});

it.each(['pro','business'].flatMap(plan=>['JSON','CSV'].flatMap(format=>['url','click'].map(stage=>({plan,format,stage})))))('recovers $plan $format download failure at $stage without invalidating the snapshot',async({plan,format,stage})=>{
 state.plan=plan;
 const create=vi.fn((blob:NodeBlob):string=>{void blob;if(stage==='url'&&create.mock.calls.length===1)throw new Error('synthetic URL failure');return 'blob:synthetic';});
 const revoke=vi.fn();vi.stubGlobal('URL',{createObjectURL:create,revokeObjectURL:revoke});vi.stubGlobal('Blob',NodeBlob);
 const click=vi.spyOn(HTMLAnchorElement.prototype,'click');
 if(stage==='click')click.mockImplementationOnce(()=>{throw new Error('synthetic browser rejection');});
 click.mockImplementation(()=>{});
 render(<CalculatorAccountActions {...props}/>);await screen.findByRole('button',{name:'Save calculation'});
 fireEvent.click(screen.getByRole('button',{name:`Export ${format}`}));
 expect(await screen.findByRole('alert')).toHaveProperty('textContent','Could not download calculation. Try again.');
 expect(revoke).toHaveBeenCalledTimes(stage==='click'?1:0);
 fireEvent.click(screen.getByRole('button',{name:`Export ${format}`}));expect(screen.queryByRole('alert')).toBeNull();
 expect(revoke).toHaveBeenCalledTimes(stage==='click'?2:1);expect(state.writes).toHaveLength(0);
 const blob=create.mock.calls[1][0] as NodeBlob;
 const content=await blob.text();if(format==='JSON')expect(JSON.parse(content).output).toEqual(props.output);else expect(content).toContain('0.001');
});

it.each(['pro','business'])('retains captured scenario exports and releases failed download URLs on %s',async plan=>{
 state.plan=plan;let latest:NodeBlob|undefined;const revoke=vi.fn();
 vi.stubGlobal('Blob',NodeBlob);vi.stubGlobal('URL',{createObjectURL:(blob:NodeBlob)=>{latest=blob;return 'blob:scenario';},revokeObjectURL:revoke});
 vi.spyOn(HTMLAnchorElement.prototype,'click').mockImplementationOnce(()=>{throw new Error('synthetic blocked download');}).mockImplementation(()=>{});
 render(<CalculatorAccountActions {...props}/>);await screen.findByRole('button',{name:'Save calculation'});
 fireEvent.click(screen.getByRole('button',{name:'Capture baseline A'}));fireEvent.click(screen.getByRole('button',{name:'Export scenario set JSON'}));
 await screen.findByRole('alert');expect(revoke).toHaveBeenCalledTimes(1);expect(screen.getByRole('button',{name:'Replace baseline A'})).toBeTruthy();
 fireEvent.click(screen.getByRole('button',{name:'Export scenario set JSON'}));expect(revoke).toHaveBeenCalledTimes(2);
 expect(JSON.parse(await latest!.text()).scenarios[0].output).toEqual(props.output);expect(state.writes).toHaveLength(0);
});
it.each(['free','pro','business'])('keeps a newer favorite failure visible when an older save completes later on %s',async plan=>{
 state.plan=plan;
 render(<CalculatorAccountActions {...props}/>);await screen.findByRole('button',{name:'Save calculation'});
 state.writeMode='defer';fireEvent.click(screen.getByRole('button',{name:'Save calculation'}));await waitFor(()=>expect(state.pendingWrites).toHaveLength(1));
 state.writeMode='error';fireEvent.click(screen.getByRole('button',{name:'☆ Favorite'}));await screen.findByRole('alert');
 state.pendingWrites[0].resolve({error:null});await waitFor(()=>expect(screen.getByRole('button',{name:'Save calculation'})).toHaveProperty('disabled',false));
 expect(screen.getByRole('alert').textContent).toContain('Could not update favorite.');expect(screen.queryByText('Calculation saved to your history.')).toBeNull();
});
it.each(['free','pro','business'])('retains a newer save failure while an older favorite succeeds without losing favorite state on %s',async plan=>{
 state.plan=plan;
 render(<CalculatorAccountActions {...props}/>);await screen.findByRole('button',{name:'Save calculation'});
 state.writeMode='defer';fireEvent.click(screen.getByRole('button',{name:'☆ Favorite'}));await waitFor(()=>expect(state.pendingWrites).toHaveLength(1));
 state.writeMode='error';fireEvent.click(screen.getByRole('button',{name:'Save calculation'}));await screen.findByRole('alert');
 state.pendingWrites[0].resolve({error:null});await screen.findByRole('button',{name:'★ Favorited'});
 expect(screen.getByRole('alert').textContent).toContain('Could not save');expect(screen.queryByText('Added to favorites.')).toBeNull();
});

it.each(['free','pro','business'])('keeps the newer success and both write locks when an older action fails on %s',async plan=>{
 state.plan=plan;render(<CalculatorAccountActions {...props}/>);await screen.findByRole('button',{name:'Save calculation'});
 if(plan!=='free')fireEvent.click(screen.getByRole('button',{name:'Capture baseline A'}));
 state.writeMode='defer';const save=screen.getByRole('button',{name:'Save calculation'}),favorite=screen.getByRole('button',{name:'☆ Favorite'});
 fireEvent.click(save);await waitFor(()=>expect(state.pendingWrites).toHaveLength(1));fireEvent.click(favorite);await waitFor(()=>expect(state.pendingWrites).toHaveLength(2));
 fireEvent.click(save);fireEvent.click(favorite);expect(state.writes).toHaveLength(2);
 state.pendingWrites[1].resolve({error:null});await screen.findByRole('button',{name:'★ Favorited'});
 state.pendingWrites[0].reject(new Error('private interrupted write'));await waitFor(()=>expect(save).toHaveProperty('disabled',false));
 expect(screen.getByText('Added to favorites.').getAttribute('role')).toBe('status');expect(screen.queryByRole('alert')).toBeNull();expect(state.writes).toHaveLength(2);
 if(plan!=='free')expect(screen.getByRole('table',{name:'Captured engine outputs'}).textContent).toContain('0.001');
});
it.each(['pro','business'].flatMap(plan=>['JSON','CSV'].map(format=>({plan,format}))))('retains the newer $plan $format download error when an older save succeeds',async({plan,format})=>{
 state.plan=plan;vi.stubGlobal('URL',{createObjectURL:()=>{throw new Error('private download failure');},revokeObjectURL:vi.fn()});
 render(<CalculatorAccountActions {...props}/>);await screen.findByRole('button',{name:'Save calculation'});fireEvent.click(screen.getByRole('button',{name:'Capture baseline A'}));
 state.writeMode='defer';fireEvent.click(screen.getByRole('button',{name:'Save calculation'}));await waitFor(()=>expect(state.pendingWrites).toHaveLength(1));
 fireEvent.click(screen.getByRole('button',{name:`Export ${format}`}));await screen.findByRole('alert');
 state.pendingWrites[0].resolve({error:null});await waitFor(()=>expect(screen.getByRole('button',{name:'Save calculation'})).toHaveProperty('disabled',false));
 expect(screen.getByRole('alert').textContent).toBe('Could not download calculation. Try again.');expect(screen.getByRole('table',{name:'Captured engine outputs'}).textContent).toContain('0.001');expect(state.writes).toHaveLength(1);
});
it.each(['slug','version'])('ignores a rejected recovery response after navigation changes calculator %s',async changed=>{
 state.authMode='reject';const view=render(<CalculatorAccountActions {...props}/>);await screen.findByRole('button',{name:'Retry account actions'});
 fireEvent.click(screen.getByRole('button',{name:'Capture baseline A'}));state.authMode='defer';fireEvent.click(screen.getByRole('button',{name:'Retry account actions'}));await waitFor(()=>expect(state.auth).toHaveLength(1));
 state.authMode='ok';view.rerender(<CalculatorAccountActions {...props} calculatorSlug={changed==='slug'?'compound-interest-calculator':props.calculatorSlug} calculatorVersion={changed==='version'?2:1}/>);await screen.findByRole('button',{name:'Save calculation'});
 state.auth[0].reject(new Error('private delayed recovery failure'));await waitFor(()=>expect(screen.queryByRole('alert')).toBeNull());
 expect(screen.queryByRole('button',{name:'Retry account actions'})).toBeNull();expect(screen.queryByRole('table',{name:'Captured engine outputs'})).toBeNull();expect(state.writes).toHaveLength(0);
});
