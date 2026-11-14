import {afterEach,describe,expect,it} from 'vitest';
import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import {CatalogEngineeringReview} from '../../src/components/catalog-engineering-review';
import {businessContracts,businessExamples,exportBusinessContract,importBusinessContract} from '../../src/calculators/business-contracts';
import {parsePublicationFactoryInput} from '../../src/lib/publication-factory-contracts-input';
import {parseFinalPrivateSnapshotText} from '../../src/lib/final-private-snapshot-text';

const cohort=[139,140,141,142,143,144,148,149,151,152,153,164,165,166,167,169,171,174,175,176,178,180,182,183,185,186,187,188,189,190,192,193,196,197,202,207];
afterEach(cleanup);
function replay(text:string){
 fireEvent.change(screen.getByLabelText('Snapshot JSON'),{target:{value:text}});
 fireEvent.click(screen.getByRole('button',{name:'Verify and restore snapshot'}));
}
it('pins the existing 36 private business profiles',()=>{
 expect(businessContracts.map(d=>Number(d.id.split('.').at(-1))).sort((a,b)=>a-b)).toEqual(cohort);
});
describe.each(cohort)('private business profile #%i',id=>{
 it('preserves actual-engine mathematical artifacts across plans after strict input parsing',()=>{
  const input=parsePublicationFactoryInput(JSON.stringify(businessExamples[id]));
  const free=exportBusinessContract(id,input,'free').calculation;
  expect(free.input).toEqual(input);
  expect(free.calculatorVersion).toBe(1);
  expect(exportBusinessContract(id,input,'pro').calculation).toEqual(free);
  expect(exportBusinessContract(id,input,'business').calculation).toEqual(free);
 });
 it('restores canonical legacy snapshots with unchanged input and output',()=>{
  const snapshot=exportBusinessContract(id,businessExamples[id]);
  expect(importBusinessContract(parseFinalPrivateSnapshotText(JSON.stringify(snapshot)))).toEqual(snapshot);
  render(<CatalogEngineeringReview/>);
  replay(JSON.stringify(snapshot));
  expect(screen.queryByRole('alert')).toBeNull();
  expect(screen.getByLabelText('Catalog identity')).toHaveProperty('value',String(id));
  expect(screen.getByTestId('business-output').textContent).toBe(JSON.stringify(snapshot.calculation.output,null,2));
 });
 it('rejects lossy revision text, clears stale actions, and recovers the same canonical result',()=>{
  const snapshot=exportBusinessContract(id,businessExamples[id]),text=JSON.stringify(snapshot);
  const forged=text.replace('"calculatorVersion":1','"calculatorVersion":1.0000000000000001');
  expect(forged).not.toBe(text);
  expect(importBusinessContract(JSON.parse(forged))).toEqual(snapshot);
  render(<CatalogEngineeringReview/>);
  replay(text);
  expect(screen.getByRole('button',{name:'Export JSON'})).toBeTruthy();
  replay(forged);
  expect(screen.getByRole('alert')).toBeTruthy();
  expect(screen.queryByRole('button',{name:'Save scenario'})).toBeNull();
  expect(screen.queryByRole('button',{name:'Export JSON'})).toBeNull();
  expect(screen.queryByTestId('business-result')).toBeNull();
  replay(text);
  expect(screen.queryByRole('alert')).toBeNull();
  expect(screen.getByTestId('business-output').textContent).toBe(JSON.stringify(snapshot.calculation.output,null,2));
 });
});
it.each(['1e-400','0.10000000000000001'])('rejects lossy new business scenario token %s',token=>{
 render(<CatalogEngineeringReview/>);
 const text=JSON.stringify(businessExamples[139]).replace('"directCosts":70',`"directCosts":${token}`);
 expect(text).not.toBe(JSON.stringify(businessExamples[139]));
 fireEvent.change(screen.getByLabelText('Scenario JSON'),{target:{value:text}});
 fireEvent.click(screen.getByRole('button',{name:'Calculate'}));
 expect(screen.getByRole('alert')).toBeTruthy();
 expect(screen.queryByRole('button',{name:'Export JSON'})).toBeNull();
});
it('rejects integer-membership digits erased before schema validation',()=>{
 render(<CatalogEngineeringReview/>);
 fireEvent.change(screen.getByLabelText('Catalog identity'),{target:{value:'166'}});
 const text=JSON.stringify(businessExamples[166]).replace('"lostCustomers":5','"lostCustomers":5.0000000000000001');
 fireEvent.change(screen.getByLabelText('Scenario JSON'),{target:{value:text}});
 fireEvent.click(screen.getByRole('button',{name:'Calculate'}));
 expect(screen.getByRole('alert')).toBeTruthy();
 expect(screen.queryByRole('button',{name:'Save scenario'})).toBeNull();
});
it('rejects fractional master identity erased by native parsing',()=>{
 const snapshot=exportBusinessContract(139,businessExamples[139]);
 const text=JSON.stringify(snapshot).replace('"masterId":139','"masterId":139.000000000000001');
 expect(importBusinessContract(JSON.parse(text))).toEqual(snapshot);
 render(<CatalogEngineeringReview/>);replay(text);
 expect(screen.getByRole('alert')).toBeTruthy();
});
it('preserves canonical subnormal business snapshots',()=>{
 const snapshot=exportBusinessContract(182,{...businessExamples[182],entries:[{id:'tiny',amount:5e-324}]});
 const text=JSON.stringify(snapshot);expect(text).toContain('5e-324');
 render(<CatalogEngineeringReview/>);replay(text);
 expect(screen.queryByRole('alert')).toBeNull();
 expect(screen.getByTestId('business-result').textContent).toBe('5e-324');
});
it('keeps the 1 MB scenario and 8 MB snapshot boundaries separate',()=>{
 const snapshot=exportBusinessContract(139,businessExamples[139]);
 render(<CatalogEngineeringReview/>);
 replay(' '.repeat(2_100_000)+JSON.stringify(snapshot));
 expect(screen.getByTestId('business-result').textContent).toBe('30');
 replay(' '.repeat(8_000_001));expect(screen.getByRole('alert')).toBeTruthy();
 fireEvent.change(screen.getByLabelText('Scenario JSON'),{target:{value:' '.repeat(1_000_001)+JSON.stringify(businessExamples[139])}});
 fireEvent.click(screen.getByRole('button',{name:'Calculate'}));expect(screen.getByRole('alert')).toBeTruthy();
});
it('retains the independent (100-70)/100*100=30 golden result through save and restore',()=>{
 render(<CatalogEngineeringReview/>);
 fireEvent.click(screen.getByRole('button',{name:'Calculate'}));
 expect(screen.getByTestId('business-result').textContent).toBe('30');
 fireEvent.click(screen.getByRole('button',{name:'Save scenario'}));
 fireEvent.change(screen.getByLabelText('Scenario JSON'),{target:{value:'{}'}});
 fireEvent.click(screen.getByRole('button',{name:'Restore scenario 1'}));
 expect(screen.getByTestId('business-result').textContent).toBe('30');
});
