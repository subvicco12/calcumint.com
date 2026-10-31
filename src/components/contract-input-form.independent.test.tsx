// @vitest-environment jsdom
import {it,expect,vi} from 'vitest';
import {render,screen,fireEvent,cleanup} from '@testing-library/react';
import {z} from 'zod';
import {ContractInputForm} from './contract-input-form';
it('does not silently erase unknown raw keys while switching discriminator',()=>{
 const schema=z.discriminatedUnion('operation',[z.object({operation:z.literal('left'),x:z.number()}).strict(),z.object({operation:z.literal('right'),y:z.number()}).strict()]);
 const change=vi.fn();render(<ContractInputForm schema={schema} value={{operation:'left',x:1,unrecognizedUserField:'preserve until explicitly removed'}} onChange={change}/>);
 fireEvent.change(screen.getByRole('combobox',{name:'Operation'}),{target:{value:'1'}});
 expect(change.mock.calls[0][0]).toHaveProperty('unrecognizedUserField','preserve until explicitly removed');cleanup();
});
