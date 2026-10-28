// @vitest-environment jsdom
import {cleanup, fireEvent, render, screen} from '@testing-library/react';
import {afterEach, describe, expect, it, vi} from 'vitest';
import {PrivateWorkflowReview} from './private-workflow-review';

afterEach(()=>{cleanup();vi.useRealTimers();vi.restoreAllMocks();});
describe('private workflow reviewer',()=>{
 it('labels private limitations and runs the selected actual-engine profile',()=>{
  render(<PrivateWorkflowReview/>);
  expect(screen.getByText(/not canonical calculator acceptance/i)).toBeTruthy();
  fireEvent.click(screen.getByRole('button',{name:'Calculate'}));
  expect(screen.getByTestId('workflow-output').textContent).toContain('256.9375');
  expect(screen.getByRole('button',{name:'Save local snapshot'})).toBeTruthy();
 });
 it('invalidates a displayed result on input edits and preserves detached local history',()=>{
  render(<PrivateWorkflowReview/>);
  fireEvent.click(screen.getByRole('button',{name:'Calculate'}));
  fireEvent.click(screen.getByRole('button',{name:'Save local snapshot'}));
  fireEvent.change(screen.getByLabelText('Scenario JSON'),{target:{value:'{}'}});
  expect(screen.queryByTestId('workflow-output')).toBeNull();
  expect(screen.queryByRole('button',{name:'Export JSON'})).toBeNull();
  expect(screen.getByTestId('local-history').textContent).toContain('256.9375');
  fireEvent.click(screen.getByRole('button',{name:'Calculate'}));
  expect(screen.getByRole('alert').textContent).toContain('Check the scenario');
  expect(screen.getByTestId('local-history').textContent).toContain('256.9375');
 });
 it('switches profiles, clears stale results and recovers after malformed JSON',()=>{
  render(<PrivateWorkflowReview/>);
  fireEvent.click(screen.getByRole('button',{name:'Calculate'}));
  fireEvent.change(screen.getByLabelText('Workflow'),{target:{value:'private.workflow.heat-costs'}});
  expect(screen.queryByTestId('workflow-output')).toBeNull();
  fireEvent.change(screen.getByLabelText('Scenario JSON'),{target:{value:'{'}});
  fireEvent.click(screen.getByRole('button',{name:'Calculate'}));
  expect(screen.getByRole('alert')).toBeTruthy();
  fireEvent.click(screen.getByRole('button',{name:'Load example'}));
  expect(screen.queryByRole('alert')).toBeNull();
  fireEvent.click(screen.getByRole('button',{name:'Calculate'}));
  expect(screen.getByTestId('workflow-output').textContent).toContain('"savings": 220');
 });
 it('clears saved history and caps the session at 20 snapshots',()=>{
  render(<PrivateWorkflowReview/>);
  fireEvent.click(screen.getByRole('button',{name:'Calculate'}));
  for(let i=0;i<21;i++)fireEvent.click(screen.getByRole('button',{name:'Save local snapshot'}));
  expect(screen.getByTestId('local-history').querySelectorAll('li')).toHaveLength(20);
  fireEvent.click(screen.getByRole('button',{name:'Clear local history'}));
  expect(screen.getByTestId('local-history').querySelectorAll('li')).toHaveLength(0);
 });
 it('downloads the version-bound snapshot and releases the temporary object URL',()=>{
  vi.useFakeTimers();
  const create=vi.fn(()=> 'blob:private-review'),revoke=vi.fn(),click=vi.spyOn(HTMLAnchorElement.prototype,'click').mockImplementation(()=>{});
  Object.defineProperty(URL,'createObjectURL',{value:create,configurable:true});
  Object.defineProperty(URL,'revokeObjectURL',{value:revoke,configurable:true});
  render(<PrivateWorkflowReview/>);
  fireEvent.click(screen.getByRole('button',{name:'Calculate'}));
  fireEvent.click(screen.getByRole('button',{name:'Export JSON'}));
  expect(create).toHaveBeenCalledOnce();expect(click).toHaveBeenCalledOnce();
  expect(revoke).not.toHaveBeenCalled();
  vi.advanceTimersByTime(1000);
  expect(revoke).toHaveBeenCalledExactlyOnceWith('blob:private-review');
  // Browser acceptance verifies the actual downloaded bytes and replay.
 });
});
