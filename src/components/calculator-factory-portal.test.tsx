// @vitest-environment jsdom
import {afterEach,describe,it,expect,vi} from 'vitest';
import {render,screen,fireEvent,cleanup,waitFor} from '@testing-library/react';
import {CalculatorFactoryPortal} from './calculator-factory-portal';
import {factoryContracts} from '@/lib/calculator-factory/registry';
const transport=vi.hoisted(()=>({save:vi.fn()}));
vi.mock('@/app/account/actions',()=>({saveCalculationHistory:transport.save}));
afterEach(()=>{cleanup();vi.resetAllMocks();});
describe('portal client integration (mock action transport, not application authentication)',()=>{
 it('uses the real Final renderer and sends exact snapshot plus owner/request bindings to the existing server action',async()=>{
  transport.save.mockResolvedValue('saved');render(<CalculatorFactoryPortal ownerId="verified-owner" plan="pro"/>);
  fireEvent.click(screen.getByText('Calculate'));
  expect(screen.getByLabelText('Calculation result').textContent).toContain('25');
  expect(screen.queryByLabelText('Exact result')).toBeNull();
  fireEvent.click(screen.getByText('Save calculation'));
  await waitFor(()=>expect(transport.save).toHaveBeenCalledTimes(1));
  expect(transport.save.mock.calls[0][0]).toMatchObject({calculatorSlug:'percentage-change-calculator',calculatorVersion:1,input:{old:100,next:125},output:{result:25},expectedOwnerId:'verified-owner'});
  expect(transport.save.mock.calls[0][0].requestId).toMatch(/^[a-f0-9-]{36}$/);
  await waitFor(()=>expect(screen.getByText('Saved to your authenticated calculation history.')).toBeTruthy());
 });
 it('clears the previous result when choosing another immutable engine',()=>{
  render(<CalculatorFactoryPortal ownerId="verified-owner" plan="free"/>);fireEvent.click(screen.getByText('Calculate'));expect(screen.getByLabelText('Calculation result')).toBeTruthy();
  fireEvent.change(screen.getByLabelText('Engineering contract'),{target:{value:String(factoryContracts[1].catalogId)}});
  expect(screen.queryByLabelText('Calculation result')).toBeNull();expect(transport.save).not.toHaveBeenCalled();
 });
 it('does not expose a save callback for private unadopted revisions',()=>{
  render(<CalculatorFactoryPortal ownerId="verified-owner" plan="business"/>);
  const privateContract=factoryContracts.find(row=>!row.registered)!;
  fireEvent.change(screen.getByLabelText('Engineering contract'),{target:{value:String(privateContract.catalogId)}});
  expect(screen.getByText(/requires separately reviewed immutable-version adoption/)).toBeTruthy();expect(screen.queryByText('Save calculation')).toBeNull();expect(transport.save).not.toHaveBeenCalled();
 });
});
