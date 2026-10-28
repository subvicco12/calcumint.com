// @vitest-environment jsdom
import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import {afterEach,describe,expect,it} from 'vitest';
import {SourceProfileReview} from './source-profile-review';
afterEach(cleanup);
describe('source-bound private review',()=>{
 it('shows exact GPA, source/applicability limits and all-plan parity',()=>{
  render(<SourceProfileReview/>);
  fireEvent.click(screen.getByRole('button',{name:'Calculate'}));
  expect(screen.getByTestId('exact-result').textContent).toBe('3.28');
  const original=screen.getByTestId('profile-output').textContent;
  for(const plan of ['pro','business','free']){
   fireEvent.change(screen.getByLabelText('Review plan'),{target:{value:plan}});
   expect(screen.getByTestId('profile-output').textContent).toBe(original);
  }
  expect(screen.getByText(/No canonical acceptance/)).toBeTruthy();
 });
 it('detaches saved snapshots, invalidates changed input and recovers errors',()=>{
  render(<SourceProfileReview/>);
  fireEvent.click(screen.getByRole('button',{name:'Calculate'}));
  fireEvent.click(screen.getByRole('button',{name:'Save local snapshot'}));
  fireEvent.change(screen.getByLabelText('Scenario JSON'),{target:{value:'{}'}});
  expect(screen.queryByTestId('profile-output')).toBeNull();
  expect(screen.queryByRole('button',{name:'Export JSON'})).toBeNull();
  expect(screen.getByTestId('source-history').textContent).toContain('82');
  fireEvent.click(screen.getByRole('button',{name:'Calculate'}));expect(screen.getByRole('alert')).toBeTruthy();
  fireEvent.click(screen.getByRole('button',{name:'Load example'}));
  fireEvent.click(screen.getByRole('button',{name:'Calculate'}));expect(screen.getByTestId('exact-result').textContent).toBe('3.28');
 });
 it('switches between complete private profiles without retaining a stale export',()=>{
  render(<SourceProfileReview/>);fireEvent.click(screen.getByRole('button',{name:'Calculate'}));
  fireEvent.change(screen.getByLabelText('Profile'),{target:{value:'private.profile.nz-gst-prices'}});
  expect(screen.queryByTestId('profile-output')).toBeNull();
  fireEvent.click(screen.getByRole('button',{name:'Calculate'}));expect(screen.getByTestId('exact-result').textContent).toBe('15');
  fireEvent.change(screen.getByLabelText('Profile'),{target:{value:'private.profile.assessment-levies'}});
  fireEvent.click(screen.getByRole('button',{name:'Calculate'}));expect(screen.getByTestId('exact-result').textContent).toBe('7500');
 });
});
