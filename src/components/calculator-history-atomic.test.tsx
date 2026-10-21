// @vitest-environment jsdom
import {cleanup,fireEvent,render,screen,waitFor} from '@testing-library/react';
import {afterEach,expect,it,vi} from 'vitest';
const m=vi.hoisted(()=>{process.env.NEXT_PUBLIC_SUPABASE_URL='https://synthetic.invalid';process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY='synthetic';return {rpc:vi.fn(),insert:vi.fn()};});
vi.mock('./use-calculator-plan',()=>({useCalculatorPlan:()=> 'pro'}));
vi.mock('@/lib/supabase/browser',()=>({createSupabaseBrowserClient:()=>({auth:{getUser:async()=>({data:{user:{id:'owner-a'}},error:null}),onAuthStateChange:()=>({data:{subscription:{unsubscribe:()=>{}}}})},rpc:m.rpc,from:()=>{const q={select:()=>q,eq:()=>q,maybeSingle:async()=>({data:null,error:null}),then:(resolve:(value:unknown)=>unknown)=>Promise.resolve({count:0,error:null}).then(resolve),insert:m.insert};return q;}})}));
import {CalculatorAccountActions} from './calculator-account-actions';
afterEach(()=>{cleanup();m.rpc.mockReset();m.insert.mockReset();});
const props={calculatorSlug:'slope-calculator',calculatorVersion:1,input:{rise:6,run:3},output:{result:1.999}};
it('keeps one owner-bound UUID across uncertain saves and never falls back to REST',async()=>{
 m.rpc.mockResolvedValueOnce({data:null,error:{code:'PGRST202'}}).mockImplementation(async(_name,args)=>({data:args.p_request_id,error:null}));
 render(<CalculatorAccountActions {...props}/>);fireEvent.click(await screen.findByRole('button',{name:'Save calculation'}));await screen.findByRole('alert');fireEvent.click(screen.getByRole('button',{name:'Save calculation'}));await screen.findByText('Calculation saved to your history.');
 expect(m.rpc).toHaveBeenCalledTimes(2);expect(m.rpc.mock.calls[0][1].p_request_id).toBe(m.rpc.mock.calls[1][1].p_request_id);expect(m.rpc.mock.calls[0][1].p_expected_owner_id).toBe('owner-a');expect(m.insert).not.toHaveBeenCalled();
});
it('uses a new request for a changed capture while retaining historical Slope v1 values',async()=>{
 m.rpc.mockImplementation(async(_name,args)=>({data:args.p_request_id,error:null}));const view=render(<CalculatorAccountActions {...props}/>);
 fireEvent.click(await screen.findByRole('button',{name:'Save calculation'}));await screen.findByText('Calculation saved to your history.');
 view.rerender(<CalculatorAccountActions {...props} output={{result:7}}/>);fireEvent.click(screen.getByRole('button',{name:'Save calculation'}));await waitFor(()=>expect(m.rpc).toHaveBeenCalledTimes(2));expect(m.rpc.mock.calls[0][1].p_output_data).toEqual({result:1.999});expect(m.rpc.mock.calls[0][1].p_request_id).not.toBe(m.rpc.mock.calls[1][1].p_request_id);
});
