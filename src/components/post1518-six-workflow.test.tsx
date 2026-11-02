/** @vitest-environment jsdom */
import React from 'react';
import {afterEach,expect,it,vi} from 'vitest';
import {cleanup,fireEvent,render,screen,within} from '@testing-library/react';
const state=vi.hoisted(()=>({props:null as Record<string,unknown>|null}));
vi.mock('@/components/use-calculator-plan',()=>({useCalculatorPlan:()=> 'pro'}));
// Synthetic account transport only; the actual account actions and exports remain mounted.
vi.mock('@/lib/supabase/browser',()=>({createSupabaseBrowserClient:()=>{
 const q={select:()=>q,eq:()=>q,maybeSingle:async()=>({data:null,error:null}),then:(resolve:(v:unknown)=>unknown)=>Promise.resolve({data:null,count:0,error:null}).then(resolve)};
 return {auth:{getUser:async()=>({data:{user:{id:'synthetic-graph-reviewer'}},error:null}),onAuthStateChange:()=>({data:{subscription:{unsubscribe:()=>{}}}})},from:()=>q};
}}));
vi.mock('@/components/calculator-account-actions',async importOriginal=>{
 const original=await importOriginal<typeof import('./calculator-account-actions')>();
 return {...original,CalculatorAccountActions:(props:React.ComponentProps<typeof original.CalculatorAccountActions>)=>{state.props=props;return <original.CalculatorAccountActions {...props}/>;}};
});
import {CalculatorInteractive} from './calculator-interactive';
afterEach(()=>{cleanup();state.props=null;});
it.each(['graphing-calculator','function-plotter-2d'])('%s preserves subnormal raw samples, discloses unavailable chart, permits raw exports and recovers',async slug=>{
 const {container}=render(<CalculatorInteractive slug={slug}/>);
 fireEvent.change(screen.getByLabelText('f(x)'),{target:{value:'x'}});
 fireEvent.change(screen.getByLabelText('Minimum x'),{target:{value:'0'}});
 fireEvent.change(screen.getByLabelText('Maximum x'),{target:{value:String(Number.MIN_VALUE)}});
 const output=state.props!.output as {points:{x:number;y:number}[]};
 expect(state.props).toMatchObject({calculatorSlug:slug,calculatorVersion:1,input:{expression:'x',minX:0,maxX:Number.MIN_VALUE}});
 expect(output.points).toHaveLength(81);
 expect(new Set(output.points.map(p=>p.x)).size).toBe(2);
 expect(output.points.every(p=>p.y===p.x)).toBe(true);
 expect(screen.getByText(/sample positions cannot be distinguished/)).toBeTruthy();
 expect(container.querySelectorAll('path[data-sampled-segment]')).toHaveLength(0);
 expect(screen.queryByRole('img',{name:'Function curve across the selected x range'})).toBeNull();
 const table=screen.getByRole('table',{name:'Engine sampled function values'});
 expect(within(table).getAllByRole('row')).toHaveLength(82);
 // Exports describe the valid raw artifact, so chart unavailability does not disable them.
 for(const label of ['Export CSV','Export JSON','Export PDF'])expect((await screen.findByRole('button',{name:label}) as HTMLButtonElement).disabled).toBe(false);
 fireEvent.change(screen.getByLabelText('Maximum x'),{target:{value:'1'}});
 expect(screen.queryByText(/sample positions cannot be distinguished/)).toBeNull();
 expect(container.querySelectorAll('path[data-sampled-segment]')).toHaveLength(1);
 expect(state.props).toMatchObject({calculatorSlug:slug,calculatorVersion:1});
 const recovered=state.props!.output as {points:{x:number;y:number}[]};
 expect(recovered.points).toHaveLength(81);expect(new Set(recovered.points.map(p=>p.x)).size).toBe(81);
 expect(recovered.points[0]).toEqual({x:0,y:0});expect(recovered.points[80]).toEqual({x:1,y:1});
});
