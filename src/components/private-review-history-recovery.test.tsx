// @vitest-environment jsdom
import {afterEach,describe,expect,it} from 'vitest';
import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import {PrivateWorkflowReview} from './private-workflow-review';
import {SourceProfileReview} from './source-profile-review';
import {FinancialContractReview} from './financial-contract-review';
import {privateWorkflowDefinitions} from '../calculators/private-scenario-workflows';
import {sourceBoundProfiles} from '../calculators/source-bound-profiles';
import {financialContracts} from '../calculators/financial-contracts';
afterEach(cleanup);
const change=(label:string,value:string)=>fireEvent.change(screen.getByLabelText(label),{target:{value}});
const click=(name:string)=>fireEvent.click(screen.getByRole('button',{name}));
const groups=[
 {name:'workflow',Component:PrivateWorkflowReview,definitions:privateWorkflowDefinitions,select:'Workflow',output:'workflow-output',history:'local-history'},
 {name:'source',Component:SourceProfileReview,definitions:sourceBoundProfiles,select:'Profile',output:'profile-output',history:'source-history'},
 {name:'financial',Component:FinancialContractReview,definitions:financialContracts,select:'Calculator contract',output:'financial-output',history:'financial-history'},
];
for(const group of groups)describe(group.name+' saved history recovery',()=>{
 it.each(group.definitions.map(d=>d.id))('restores saved identity, exact input and result after profile switch for %s',id=>{
  const Component=group.Component;render(<Component/>);change(group.select,id);
  const draft=JSON.parse((screen.getByLabelText('Scenario JSON') as HTMLTextAreaElement).value);
  // Preserve the offered domain, but distinguish saved data from a fresh example.
  if(group.name==='workflow'){draft.currency='SAVED-USD';const key='capitalized' in draft?'capitalized':'usefulHeatKWh' in draft?'usefulHeatKWh':'initial';draft[key]+=100;}
  else if(group.name==='financial'){draft.currency='SAVED-USD';draft.discountRate=0.01;}
  else if(draft.rows){draft.rows[0].recordId='saved-row';draft.rows[0].units='2.5';}
  else if(draft.lines){draft.lines[0].id='saved-line';draft.lines[0].amount='123.45';}
  else {draft.levies[0].id='saved-levy';draft.levies[0].assessedValue='176000';}
  change('Scenario JSON',JSON.stringify(draft));click('Calculate');
  const originalOutput=screen.getByTestId(group.output).textContent;
  click('Save local snapshot');
  const originalPacket=JSON.parse(screen.getByTestId(group.history).querySelector('pre')!.textContent!);
  change(group.select,group.definitions.find(d=>d.id!==id)!.id);
  if(group.name!=='workflow')change('Review plan','business');
  change('Scenario JSON','{}');click('Calculate');expect(screen.getByRole('alert')).toBeTruthy();
  expect(screen.queryByTestId(group.output)).toBeNull();
  click('Restore snapshot 1');
  expect((screen.getByLabelText(group.select) as HTMLSelectElement).value).toBe(id);
  expect(JSON.parse((screen.getByLabelText('Scenario JSON') as HTMLTextAreaElement).value)).toEqual(originalPacket.calculation.input);
  expect(screen.getByTestId(group.output).textContent).toBe(originalOutput);
  expect(screen.queryByRole('alert')).toBeNull();expect(screen.getByRole('button',{name:'Export JSON'})).toBeTruthy();
  if(group.name!=='workflow')expect((screen.getByLabelText('Review plan') as HTMLSelectElement).value).toBe('business');
  expect(JSON.parse(screen.getByTestId(group.history).querySelector('pre')!.textContent!)).toEqual(originalPacket);
  expect(screen.getByTestId(group.history).querySelectorAll('li')).toHaveLength(1);
 });
});
