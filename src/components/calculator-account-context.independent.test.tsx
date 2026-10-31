// @vitest-environment jsdom
import {cleanup,fireEvent,render,screen,waitFor} from '@testing-library/react';import {afterEach,expect,it,vi} from 'vitest';
const state=vi.hoisted(()=>{process.env.NEXT_PUBLIC_SUPABASE_URL='https://example.invalid';process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY='synthetic-key';return {plan:'pro',authMode:'ok',rpcError:null as unknown,readError:false,count:0 as number|null,writeMode:'ok',pendingWrites:[] as {resolve:(value:unknown)=>void;reject:(error:Error)=>void}[],writes:[] as {table:string;value:Record<string,unknown>}[],auth:[] as {resolve:(value:unknown)=>void;reject:(error:Error)=>void}[]};});
vi.mock('./use-calculator-plan',()=>({useCalculatorPlan:()=>state.plan}));
vi.mock('@/lib/supabase/browser',()=>({createSupabaseBrowserClient:()=>({auth:{getUser:()=>state.authMode==='reject'?Promise.reject(new Error('synthetic auth unavailable')):state.authMode==='defer'?new Promise((resolve,reject)=>state.auth.push({resolve,reject})):Promise.resolve({data:{user:{id:'synthetic-user'}}})},rpc:async(name:string,args:Record<string,unknown>)=>{expect(name).toBe('save_calculation_history_atomic');expect(args.p_expected_owner_id).toBe('synthetic-user');const value={user_id:'synthetic-user',calculator_slug:args.p_calculator_slug,calculator_version:args.p_calculator_version,input_data:args.p_input_data,output_data:args.p_output_data};state.writes.push({table:'calculation_history',value});if(state.writeMode==='defer')return new Promise((resolve,reject)=>state.pendingWrites.push({resolve:result=>resolve({...result as object,data:args.p_request_id}),reject}));if(state.writeMode==='reject')throw new Error('synthetic write transport');return {data:args.p_request_id,error:state.rpcError??(state.writeMode==='error'?{code:'synthetic'}:null)};},from:(table:string)=>{
 const query={select:()=>query,eq:()=>query,maybeSingle:async()=>({data:null,error:state.readError?{code:'synthetic'}:null}),then:(resolve:(value:unknown)=>unknown)=>Promise.resolve({data:null,count:state.count,error:state.readError?{code:'synthetic'}:null}).then(resolve),insert:async()=>{throw new Error('History must use atomic RPC');},upsert:async(value:Record<string,unknown>)=>{state.writes.push({table,value});if(state.writeMode==='defer')return new Promise((resolve,reject)=>state.pendingWrites.push({resolve,reject}));if(state.writeMode==='reject')throw new Error('synthetic write transport');return {error:state.writeMode==='error'?{code:'synthetic'}:null};},delete:()=>query};return query;
}})}));
import {CalculatorAccountActions} from './calculator-account-actions';
afterEach(()=>{cleanup();state.plan='pro';state.rpcError=null;state.authMode='ok';state.readError=false;state.writes=[];state.auth=[];state.count=0;state.writeMode='ok';state.pendingWrites=[];vi.unstubAllGlobals();vi.restoreAllMocks();});
const props={calculatorSlug:'sip-calculator',calculatorVersion:1,input:{rate:0},output:{value:.001}};
it.each(['free','pro','business'])('keeps pending saved A completion from describing current B on %s',async plan=>{
 state.plan=plan;const view=render(<CalculatorAccountActions {...props}/>);
 state.writeMode='defer';fireEvent.click(await screen.findByRole('button',{name:'Save calculation'}));
 await waitFor(()=>expect(state.pendingWrites).toHaveLength(1));
 view.rerender(<CalculatorAccountActions {...props} input={{rate:99}} output={{value:999}}/>);
 state.pendingWrites[0].resolve({error:null});
 await waitFor(()=>expect(screen.getByRole('button',{name:'Save calculation'})).toHaveProperty('disabled',false));
 expect(state.writes).toHaveLength(1);expect(state.writes[0].value).toMatchObject({input_data:props.input,output_data:props.output});
 expect(screen.queryByText('Calculation saved to your history.')).toBeNull();
 expect(screen.queryByText('Saving calculation…')).toBeNull();
});
