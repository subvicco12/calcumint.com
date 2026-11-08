// @vitest-environment jsdom
import {webcrypto} from 'node:crypto';
import {afterEach,it,expect,vi} from 'vitest';
import {act,cleanup,render,screen,fireEvent,waitFor} from '@testing-library/react';
import {CandidateWorkbench} from '@/components/full-six/candidate-workbench';
import {calculateCandidate,replayCandidateSnapshot} from './workflow';
import type {CandidateRunner} from './runner';
afterEach(()=>{cleanup();vi.restoreAllMocks();vi.unstubAllGlobals();});
const runner=():CandidateRunner=>({run:vi.fn(async(id,input)=>calculateCandidate(id,input)),replay:vi.fn(async(id,text)=>(await replayCandidateSnapshot(text,id)).artifact),cancel:vi.fn(),dispose:vi.fn()});
async function example(){fireEvent.click(screen.getByRole('button',{name:'Use example'}));fireEvent.click(screen.getByRole('button',{name:'Calculate'}));await screen.findByRole('heading',{name:'Current result'});}
it('downloads actual PDF bytes through the native production Blob helper',async()=>{
 vi.stubGlobal('crypto',webcrypto);const blobs:Blob[]=[];vi.stubGlobal('URL',{createObjectURL:vi.fn((blob:Blob)=>{blobs.push(blob);return 'blob:statistics-pdf';}),revokeObjectURL:vi.fn()});
 const click=vi.spyOn(HTMLAnchorElement.prototype,'click').mockImplementation(function(this:HTMLAnchorElement){expect(this.download).toBe('private-283-statistics.pdf');expect(this.href).toBe('blob:statistics-pdf');expect(document.body.contains(this)).toBe(true);});
 render(<CandidateWorkbench catalogId={283} plan="pro" createRunner={runner}/>);await example();fireEvent.click(screen.getByRole('button',{name:'Export statistics PDF'}));await waitFor(()=>expect(click).toHaveBeenCalledOnce());
 expect(blobs[0].type).toBe('application/pdf');
 const bytes=await new Promise<ArrayBuffer>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result as ArrayBuffer);reader.onerror=reject;reader.readAsArrayBuffer(blobs[0]);});
 const text=new TextDecoder().decode(bytes);expect(text.startsWith('%PDF-1.7')).toBe(true);expect(text).toContain('PRIVATE EXPERIMENTAL STATISTICS');expect(text).toContain('/StructTreeRoot');
 expect(document.querySelector('a[download="private-283-statistics.pdf"]')).toBeNull();
});
it('rejects worker replay failures, focuses error, preserves inputs and recovers on recalculation',async()=>{
 vi.stubGlobal('crypto',webcrypto);const r=runner(),save=vi.fn();vi.mocked(r.replay).mockRejectedValueOnce(Error('Statistics worker verification failed'));
 render(<CandidateWorkbench catalogId={282} plan="business" createRunner={()=>r} downloadPdf={save}/>);await example();fireEvent.click(screen.getByRole('button',{name:'Export statistics PDF'}));
 const alert=await screen.findByRole('alert');expect(alert.textContent).toBe('Statistics worker verification failed');await waitFor(()=>expect(document.activeElement).toBe(alert));
 expect((screen.getByLabelText('Observation unit') as HTMLInputElement).value).toBe('m');expect(save).not.toHaveBeenCalled();
 fireEvent.click(screen.getByRole('button',{name:'Calculate'}));await screen.findByRole('heading',{name:'Current result'});fireEvent.click(screen.getByRole('button',{name:'Export statistics PDF'}));await waitFor(()=>expect(save).toHaveBeenCalledOnce());expect(save.mock.calls[0][0]).toBe('private-282-statistics.pdf');
});
it.each(['edit','cancel','recalculate','entitlement-loss'] as const)('prevents obsolete PDF export from starting replay after deferred digest and %s',async action=>{
 const r=runner(),save=vi.fn(),view=render(<CandidateWorkbench catalogId={283} plan="pro" createRunner={()=>r} downloadPdf={save}/>);await example();
 let release!:()=>void;const digest=vi.fn(()=>new Promise<ArrayBuffer>(resolve=>{release=()=>resolve(new ArrayBuffer(32));}));vi.stubGlobal('crypto',{subtle:{digest}});
 r.replay=vi.fn(async()=>{r.cancel();throw Error('Obsolete replay must never start');});
 fireEvent.click(screen.getByRole('button',{name:'Export statistics PDF'}));expect(digest).toHaveBeenCalledOnce();
 if(action==='edit'||action==='recalculate')fireEvent.change(screen.getByLabelText('Observation unit'),{target:{value:'cm'}});
 if(action==='cancel')fireEvent.click(screen.getByRole('button',{name:'Cancel'}));
 if(action==='entitlement-loss')view.rerender(<CandidateWorkbench catalogId={283} plan="free" createRunner={()=>r} downloadPdf={save}/>);
 let complete:((a:ReturnType<typeof calculateCandidate>)=>void)|undefined;
 if(action==='recalculate'){r.run=vi.fn(()=>new Promise<ReturnType<typeof calculateCandidate>>(resolve=>{complete=resolve;}));fireEvent.click(screen.getByRole('button',{name:'Calculate'}));expect(r.run).toHaveBeenCalledOnce();}
 const cancellations=vi.mocked(r.cancel).mock.calls.length;await act(async()=>{release();await Promise.resolve();});
 expect(r.replay).not.toHaveBeenCalled();expect(r.cancel).toHaveBeenCalledTimes(cancellations);expect(save).not.toHaveBeenCalled();
 if(complete){expect(screen.getByRole('button',{name:'Cancel'})).toBeTruthy();await act(async()=>{complete!(calculateCandidate(283,{dataset:{mode:'sample',encoding:'raw',rows:[{value:'1'},{value:'2'},{value:'3'}],unit:'cm',missingPolicy:'reject'},bins:3}));});expect(screen.getByRole('heading',{name:'Current result'})).toBeTruthy();}
 if(action==='edit')expect(screen.getByRole('button',{name:'Export statistics PDF'}).hasAttribute('disabled')).toBe(true);
 if(action==='entitlement-loss')expect(screen.queryByRole('button',{name:'Export statistics PDF'})).toBeNull();
});
