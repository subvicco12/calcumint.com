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
it('retries an uncertain history save with the same owner/packet request identity',async()=>{
 transport.save.mockRejectedValueOnce(Error('Lost confirmation')).mockResolvedValueOnce('saved');
 render(<CalculatorFactoryPortal ownerId="verified-owner" plan="pro"/>);fireEvent.click(screen.getByText('Calculate'));fireEvent.click(screen.getByText('Save calculation'));
 await waitFor(()=>expect(screen.getByRole('alert').textContent).toContain('Lost confirmation'));
 fireEvent.click(screen.getByText('Save calculation'));await waitFor(()=>expect(transport.save).toHaveBeenCalledTimes(2));
 expect(transport.save.mock.calls[0][0].requestId).toBe(transport.save.mock.calls[1][0].requestId);
 fireEvent.change(document.querySelector('input[name=old]')!,{target:{value:'200'}});fireEvent.click(screen.getByText('Calculate'));fireEvent.click(screen.getByText('Save calculation'));
 await waitFor(()=>expect(transport.save).toHaveBeenCalledTimes(3));expect(transport.save.mock.calls[2][0].requestId).not.toBe(transport.save.mock.calls[0][0].requestId);
});

it('enables direction swap for the queued converters and retains exact v1 save identity',async()=>{
 transport.save.mockResolvedValue('saved');
 render(<CalculatorFactoryPortal ownerId="verified-owner" plan="pro"/>);
 const chooser=screen.getByLabelText('Engineering contract');
 for(const id of [423,424,425,427,428,429,430,431,433,434,436,437,438,439]){
  fireEvent.change(chooser,{target:{value:String(id)}});
  const from=screen.getByLabelText('From unit') as HTMLSelectElement;
  const to=screen.getByLabelText('To unit') as HTMLSelectElement;
  const original=[from.value,to.value];
  fireEvent.click(screen.getByRole('button',{name:'Swap units'}));
  expect([from.value,to.value]).toEqual(original.toReversed());
 }
 fireEvent.change(chooser,{target:{value:'423'}});
 fireEvent.click(screen.getByRole('button',{name:'Swap units'}));
 fireEvent.click(screen.getByText('Calculate'));
 fireEvent.click(screen.getByText('Save calculation'));
 await waitFor(()=>expect(transport.save).toHaveBeenCalledTimes(1));
 expect(transport.save.mock.calls[0][0]).toMatchObject({
  calculatorSlug:'length-converter',calculatorVersion:1,input:{value:1,fromUnit:'km',toUnit:'m'},output:{result:1000},expectedOwnerId:'verified-owner',
 });
 fireEvent.change(chooser,{target:{value:'440'}});
 expect(screen.queryByRole('button',{name:'Swap units'})).toBeNull();
});
