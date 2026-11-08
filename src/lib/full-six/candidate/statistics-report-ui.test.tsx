// @vitest-environment jsdom
import {webcrypto} from 'node:crypto';
import {afterEach,it,expect,vi} from 'vitest';
import {act,cleanup,render,screen,fireEvent,waitFor} from '@testing-library/react';
import {CandidateWorkbench} from '@/components/full-six/candidate-workbench';
import {calculateCandidate,replayCandidateSnapshot} from './workflow';
import type {CandidateRunner} from './runner';
afterEach(()=>{cleanup();vi.unstubAllGlobals();});
const runner=():CandidateRunner=>({run:vi.fn(async(id,input)=>calculateCandidate(id,input)),replay:vi.fn(async(id,text)=>(await replayCandidateSnapshot(text,id)).artifact),cancel:vi.fn(),dispose:vi.fn()});
it('downloads a native CSV Blob with correct MIME, name and complete verified contents',async()=>{
 vi.stubGlobal('crypto',webcrypto);
 const blobs:Blob[]=[],create=vi.fn((b:Blob)=>{blobs.push(b);return 'blob:statistics';}),revoke=vi.fn();
 vi.stubGlobal('URL',Object.assign(URL,{createObjectURL:create,revokeObjectURL:revoke}));
 const click=vi.spyOn(HTMLAnchorElement.prototype,'click').mockImplementation(function(this:HTMLAnchorElement){expect(this.download).toBe('private-282-statistics.csv');expect(this.href).toBe('blob:statistics');});
 render(<CandidateWorkbench catalogId={282} plan="pro" createRunner={runner}/>);
 fireEvent.click(screen.getByRole('button',{name:'Use example'}));fireEvent.click(screen.getByRole('button',{name:'Calculate'}));await screen.findByRole('heading',{name:'Current result'});
 fireEvent.click(screen.getByRole('button',{name:'Export statistics CSV'}));await waitFor(()=>expect(click).toHaveBeenCalledOnce());
 expect(blobs[0].type).toBe('text/csv;charset=utf-8');
 const text=await new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result));reader.onerror=reject;reader.readAsText(blobs[0]);});
 expect(text).toContain('"summary","/output/summary/metrics/standardDeviation","string","1"');
 expect(text).toContain('/output/contributions/2/weightedSquaredDeviation/numerator');expect(revoke).toHaveBeenCalledWith('blob:statistics');click.mockRestore();
});
it('blocks stale CSV and removes CSV controls after entitlement loss',async()=>{
 vi.stubGlobal('crypto',webcrypto);const save=vi.fn(),view=render(<CandidateWorkbench catalogId={283} plan="pro" createRunner={runner} download={save}/>);
 fireEvent.click(screen.getByRole('button',{name:'Use example'}));fireEvent.click(screen.getByRole('button',{name:'Calculate'}));await screen.findByRole('heading',{name:'Current result'});
 fireEvent.change(screen.getByLabelText('Observation unit'),{target:{value:'cm'}});
 expect(screen.getByRole('button',{name:'Export statistics CSV'}).hasAttribute('disabled')).toBe(true);
 fireEvent.click(screen.getByRole('button',{name:'Export statistics CSV'}));expect(save).not.toHaveBeenCalled();
 view.rerender(<CandidateWorkbench catalogId={283} plan="free" createRunner={runner} download={save}/>);expect(screen.queryByRole('button',{name:'Export statistics CSV'})).toBeNull();
});

it.each(['edit','cancel','recalculate','entitlement-loss'] as const)('does not start obsolete CSV replay after a deferred digest and %s',async action=>{
 const r=runner(),save=vi.fn();
 const view=render(<CandidateWorkbench catalogId={283} plan="pro" createRunner={()=>r} download={save}/>);
 fireEvent.click(screen.getByRole('button',{name:'Use example'}));fireEvent.click(screen.getByRole('button',{name:'Calculate'}));await screen.findByRole('heading',{name:'Current result'});
 let release!:()=>void;
 const digest=vi.fn(()=>new Promise<ArrayBuffer>(resolve=>{release=()=>resolve(new ArrayBuffer(32));}));
 vi.stubGlobal('crypto',{subtle:{digest}});
 // Model the real runner contract: starting replay cancels any active calculation.
 r.replay=vi.fn(async()=>{r.cancel();throw Error('Obsolete replay must never start');});
 fireEvent.click(screen.getByRole('button',{name:'Export statistics CSV'}));
 expect(digest).toHaveBeenCalledOnce();
 if(action==='edit'||action==='recalculate')fireEvent.change(screen.getByLabelText('Observation unit'),{target:{value:'cm'}});
 if(action==='cancel')fireEvent.click(screen.getByRole('button',{name:'Cancel'}));
 if(action==='entitlement-loss')view.rerender(<CandidateWorkbench catalogId={283} plan="free" createRunner={()=>r} download={save}/>);
 let complete:((a:ReturnType<typeof calculateCandidate>)=>void)|undefined;
 if(action==='recalculate'){
  r.run=vi.fn(()=>new Promise(resolve=>{complete=resolve;}));
  fireEvent.click(screen.getByRole('button',{name:'Calculate'}));
  expect(r.run).toHaveBeenCalledOnce();
 }
 const cancellations=vi.mocked(r.cancel).mock.calls.length;
 await act(async()=>{release();await Promise.resolve();});
 expect(r.replay).not.toHaveBeenCalled();expect(r.cancel).toHaveBeenCalledTimes(cancellations);expect(save).not.toHaveBeenCalled();
 if(complete){
  expect(screen.getByRole('button',{name:'Cancel'})).toBeTruthy();
  await act(async()=>{complete!(calculateCandidate(283,{dataset:{mode:'sample',encoding:'raw',rows:[{value:'1'},{value:'2'},{value:'3'}],unit:'cm',missingPolicy:'reject'},bins:3}));});
  expect(screen.getByRole('heading',{name:'Current result'})).toBeTruthy();
 }
});
