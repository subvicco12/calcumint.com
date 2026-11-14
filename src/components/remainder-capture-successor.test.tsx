// @vitest-environment jsdom
import {afterEach,expect,it} from 'vitest';
import {cleanup,fireEvent,render,screen,waitFor} from '@testing-library/react';
import {RemainderCaptureSuccessor} from './remainder-capture-successor';
afterEach(cleanup);
it('exposes labeled signed-remainder inputs and recovers from zero-divisor refusal',()=>{
 render(<RemainderCaptureSuccessor/>);
 fireEvent.change(screen.getByLabelText('Dividend'),{target:{value:'1.5'}});
 fireEvent.change(screen.getByLabelText('Divisor'),{target:{value:'0'}});
 fireEvent.click(screen.getByRole('button',{name:'Calculate'}));expect(screen.getByRole('alert')).toBeTruthy();
 fireEvent.change(screen.getByLabelText('Divisor'),{target:{value:'.5'}});
 fireEvent.click(screen.getByRole('button',{name:'Calculate'}));
 expect(screen.queryByRole('alert')).toBeNull();expect(screen.getByRole('table',{name:'Exact signed remainder'}).textContent).toContain('0');
 expect(screen.getByText(/not Euclidean modulo/)).toBeTruthy();
 fireEvent.click(screen.getByRole('button',{name:'Export JSON'}));expect(screen.getByRole('alert').textContent).toContain('Pro');
});

it('keeps host save failure recoverable and captures source-bound scenarios and replay',async()=>{
 let allow=false;const saved:unknown[]=[];
 render(<RemainderCaptureSuccessor plan="business" onSave={async packet=>{if(!allow)throw Error('Workspace authorization refused');saved.push(packet);return 'Saved by authorized host';}}/>);
 fireEvent.click(screen.getByRole('button',{name:'Calculate'}));
 fireEvent.click(screen.getByRole('button',{name:'Save calculation'}));
 await waitFor(()=>expect(screen.getByRole('alert').textContent).toContain('authorization refused'));
 allow=true;fireEvent.click(screen.getByRole('button',{name:'Save calculation'}));
 await waitFor(()=>expect(screen.getByRole('status').textContent).toContain('Saved by authorized host'));
 expect(saved).toHaveLength(1);
 fireEvent.click(screen.getByRole('button',{name:'Capture scenario A'}));
 expect(screen.getByRole('list',{name:'Captured scenarios'}).textContent).toContain('Scenario A');
 fireEvent.click(screen.getByRole('button',{name:'Export JSON'}));
 const exported=(screen.getByLabelText('Exported data') as HTMLTextAreaElement).value;
 expect(JSON.parse(exported).identity.sourceVersion).toContain('private.remainder-exact-zero');
 fireEvent.change(screen.getByLabelText('Dividend'),{target:{value:'17'}});
 fireEvent.change(screen.getByLabelText('Packet JSON to replay'),{target:{value:exported}});
 fireEvent.click(screen.getByRole('button',{name:'Replay packet'}));
 expect((screen.getByLabelText('Dividend') as HTMLInputElement).value).toBe('1.5');
 expect(screen.getByRole('table',{name:'Exact signed remainder'}).textContent).toContain('0');
});
