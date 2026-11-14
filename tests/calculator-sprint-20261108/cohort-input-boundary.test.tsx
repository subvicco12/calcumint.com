import {afterEach,describe,expect,it} from 'vitest';
import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import {FinalPrivateWorkbench} from '../../src/components/final-private-workbench';
import {exportFinalPrivate,finalPrivateExamples,finalPrivateDiscovery,importFinalPrivate} from '../../src/calculators/final-private-workbench';
import {parseFinalPrivateSnapshotText} from '../../src/lib/final-private-snapshot-text';
import {parsePublicationFactoryInput} from '../../src/lib/publication-factory-contracts-input';

const cohort=[21,32,35,36,43,46,49,80,81,82,84,85,86,88,89,90,91,96,125,126,127,133,134,468,469,470,472,488,516];
afterEach(cleanup);
function importText(text:string){
 fireEvent.change(screen.getByLabelText('Snapshot JSON'),{target:{value:text}});
 fireEvent.click(screen.getByRole('button',{name:'Verify and restore snapshot'}));
}
it('pins the 29 available supplied profiles without implying canonical completion',()=>{
 expect(finalPrivateDiscovery.filter(row=>row.available).map(row=>row.masterId).sort((a,b)=>a-b)).toEqual(cohort);
 expect(finalPrivateDiscovery.every(row=>!row.canonicalCompleted)).toBe(true);
});
describe.each(cohort)('private profile #%i',id=>{
 it('preserves actual-engine mathematical artifacts across Free, Pro and Business after strict input parsing',()=>{
  const input=parsePublicationFactoryInput(JSON.stringify(finalPrivateExamples[id]));
  const free=exportFinalPrivate(id,input,'free').payload.calculation;
  const pro=exportFinalPrivate(id,input,'pro').payload.calculation;
  const business=exportFinalPrivate(id,input,'business').payload.calculation;
  expect(free.input).toEqual(input);
  expect(free.calculatorVersion).toBe(1);
  expect(pro).toEqual(free);
  expect(business).toEqual(free);
 });
 it('restores an unmodified snapshot with identical deterministic input and output',()=>{
  const snapshot=exportFinalPrivate(id,finalPrivateExamples[id]);
  expect(importFinalPrivate(JSON.parse(JSON.stringify(snapshot)))).toEqual(snapshot);
  render(<FinalPrivateWorkbench/>);
  importText(JSON.stringify(snapshot));
  expect(screen.queryByRole('alert')).toBeNull();
  expect(screen.getByTestId('workbench-output').textContent).toBe(JSON.stringify(snapshot.payload.calculation.output,null,2));
  expect(screen.getByLabelText('Calculator identity')).toHaveProperty('value',String(id));
 });
 it('rejects raw snapshot revision digits that JSON.parse would silently erase',()=>{
  const text=JSON.stringify(exportFinalPrivate(id,finalPrivateExamples[id]));
  const forged=text.replace('"calculatorVersion":1','"calculatorVersion":1.0000000000000001');
  expect(forged).not.toBe(text);
  // The old parse-then-verify boundary accepts this exact malformed text.
  expect(importFinalPrivate(JSON.parse(forged)).payload.calculation.calculatorVersion).toBe(1);
  render(<FinalPrivateWorkbench/>);
  importText(text);
  expect(screen.getByRole('button',{name:'Export JSON'})).toBeTruthy();
  importText(forged);
  expect(screen.getByRole('alert')).toBeTruthy();
  expect(screen.queryByRole('button',{name:'Export JSON'})).toBeNull();
  expect(screen.queryByTestId('workbench-result')).toBeNull();
 });
});
it.each(['1e-400','9007199254740993','0.10000000000000001'])('rejects lossy new numeric scenario token %s',token=>{
 render(<FinalPrivateWorkbench/>);
 fireEvent.change(screen.getByLabelText('Calculator identity'),{target:{value:'82'}});
 const text=JSON.stringify({...finalPrivateExamples[82],steps:[],initial:0}).replace('"initial":0',`"initial":${token}`);
 fireEvent.change(screen.getByLabelText('Scenario JSON'),{target:{value:text}});
 fireEvent.click(screen.getByRole('button',{name:'Calculate'}));
 expect(screen.getByRole('alert')).toBeTruthy();
 expect(screen.queryByRole('button',{name:'Save scenario'})).toBeNull();
});
it('preserves exact decimal strings and the independently calculable 100*1.1+10=120 result',()=>{
 render(<FinalPrivateWorkbench/>);
 fireEvent.change(screen.getByLabelText('Calculator identity'),{target:{value:'81'}});
 fireEvent.click(screen.getByRole('button',{name:'Calculate'}));
 expect(screen.getByTestId('workbench-result').textContent).toBe('120');
 fireEvent.click(screen.getByRole('button',{name:'Save scenario'}));
 fireEvent.change(screen.getByLabelText('Scenario JSON'),{target:{value:'{}'}});
 fireEvent.click(screen.getByRole('button',{name:'Restore scenario 1'}));
 expect(screen.getByTestId('workbench-result').textContent).toBe('120');
 expect((screen.getByLabelText('Scenario JSON') as HTMLTextAreaElement).value).toContain('"initial": "100"');
});
it('rejects fractional master identity erased by native JSON parsing',()=>{
 const text=JSON.stringify(exportFinalPrivate(81,finalPrivateExamples[81])).replace('"masterId":81','"masterId":81.000000000000001');
 expect(importFinalPrivate(JSON.parse(text)).masterId).toBe(81);
 render(<FinalPrivateWorkbench/>);
 importText(text);
 expect(screen.getByRole('alert')).toBeTruthy();
 expect(screen.queryByRole('button',{name:'Export JSON'})).toBeNull();
});
it('preserves canonical subnormal legacy snapshots, unlike numeric underflow tokens',()=>{
 const snapshot=exportFinalPrivate(82,{...finalPrivateExamples[82],initial:5e-324,steps:[]});
 const text=JSON.stringify(snapshot);
 expect(text).toContain('5e-324');
 expect(importFinalPrivate(parseFinalPrivateSnapshotText(text))).toEqual(snapshot);
 expect(()=>parseFinalPrivateSnapshotText(text.replace('5e-324','1e-400'))).toThrow();
 render(<FinalPrivateWorkbench/>);
 importText(text);
 expect(screen.queryByRole('alert')).toBeNull();
 expect(screen.getByTestId('workbench-result').textContent).toBe('5e-324');
});
it('retains the 8 MB snapshot import limit independently from the 1 MB new-input limit',()=>{
 const snapshot=exportFinalPrivate(81,finalPrivateExamples[81]);
 const text=' '.repeat(2_100_000)+JSON.stringify(snapshot);
 expect(importFinalPrivate(parseFinalPrivateSnapshotText(text))).toEqual(snapshot);
 render(<FinalPrivateWorkbench/>);
 importText(text);
 expect(screen.queryByRole('alert')).toBeNull();
 expect(screen.getByTestId('workbench-result').textContent).toBe('120');
 expect(()=>parseFinalPrivateSnapshotText(' '.repeat(8_000_001))).toThrow('Snapshot size limit');
});
it('does not inspect quoted exact quantities or escaped digit-looking strings',()=>{
 const raw={exact:'9007199254740993',label:'quoted "1e-400" and \\81.000000000000001',value:0.1};
 expect(parseFinalPrivateSnapshotText(JSON.stringify(raw))).toEqual(raw);
 expect(parseFinalPrivateSnapshotText('{"value":0.1000}')).toEqual({value:0.1});
 expect(()=>parseFinalPrivateSnapshotText('{"value":1e400}')).toThrow();
});
it('retains the stricter one-million-character limit for new scenarios',()=>{
 render(<FinalPrivateWorkbench/>);
 fireEvent.change(screen.getByLabelText('Calculator identity'),{target:{value:'82'}});
 fireEvent.change(screen.getByLabelText('Scenario JSON'),{target:{value:' '.repeat(1_000_001)+JSON.stringify(finalPrivateExamples[82])}});
 fireEvent.click(screen.getByRole('button',{name:'Calculate'}));
 expect(screen.getByRole('alert')).toBeTruthy();
 expect(screen.queryByRole('button',{name:'Export JSON'})).toBeNull();
});
