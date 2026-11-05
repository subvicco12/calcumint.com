/** @vitest-environment jsdom */
import React from 'react';
import {act,cleanup,fireEvent,render,screen} from '@testing-library/react';
import {afterEach,expect,it,vi} from 'vitest';
import {AiResultExplanation} from './ai-result-explanation';
const first={calculatorName:'Ratio',formula:'a / b',values:{a:12,b:3},result:{result:4}};
const second={...first,values:{a:6,b:3},result:{result:2}};
afterEach(()=>{cleanup();vi.unstubAllGlobals();});
it('never shows a completed explanation for inputs that have changed',async()=>{
 vi.stubGlobal('fetch',vi.fn().mockResolvedValue({ok:true,json:async()=>({summary:'Twelve divided by three is four.'})}));
 const view=render(<AiResultExplanation {...first}/>);fireEvent.click(screen.getByRole('button',{name:'Explain this result with AI'}));await screen.findByText('Twelve divided by three is four.');
 view.rerender(<AiResultExplanation {...second}/>);expect(screen.queryByText('Twelve divided by three is four.')).toBeNull();
});
it('aborts obsolete requests and ignores their delayed results',async()=>{
 let resolve!:(value:unknown)=>void;let signal:AbortSignal|undefined;
 vi.stubGlobal('fetch',vi.fn((_url:string,init:RequestInit)=>{signal=init.signal as AbortSignal;return new Promise(r=>{resolve=r;});}));
 const view=render(<AiResultExplanation {...first}/>);fireEvent.click(screen.getByRole('button',{name:'Explain this result with AI'}));
 view.rerender(<AiResultExplanation {...second}/>);expect(signal?.aborted).toBe(true);
 await act(async()=>resolve({ok:true,json:async()=>({summary:'Obsolete explanation'})}));expect(screen.queryByText('Obsolete explanation')).toBeNull();expect((screen.getByRole('button',{name:'Explain this result with AI'}) as HTMLButtonElement).disabled).toBe(false);
});
it('retains an explanation for equivalent rerenders',async()=>{
 vi.stubGlobal('fetch',vi.fn().mockResolvedValue({ok:true,json:async()=>({summary:'Current explanation'})}));
 const view=render(<AiResultExplanation {...first}/>);fireEvent.click(screen.getByRole('button',{name:'Explain this result with AI'}));await screen.findByText('Current explanation');view.rerender(<AiResultExplanation {...structuredClone(first)}/>);expect(screen.getByText('Current explanation')).toBeTruthy();
});
