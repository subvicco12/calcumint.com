/** @vitest-environment jsdom */
import {useState} from 'react';
import {afterEach,it,expect} from 'vitest';
import {render,screen,fireEvent,cleanup} from '@testing-library/react';
import {z} from 'zod';
import {ContractInputForm} from './contract-input-form';
const schema=z.object({amount:z.number().finite().nonnegative()});
function Form(){const [value,setValue]=useState<unknown>({amount:1});return <><ContractInputForm schema={schema} value={value} onChange={setValue}/><output data-testid="draft">{JSON.stringify(value)}</output></>;}
afterEach(cleanup);
it.each(['1e-400','100000000000.000001','0.10000000000000001'])('retains unrepresentable form draft %s until explicit correction',text=>{
 render(<Form/>);const field=screen.getByLabelText('Amount');fireEvent.change(field,{target:{value:text}});expect(JSON.parse(screen.getByTestId('draft').textContent!)).toEqual({amount:text});expect(field.getAttribute('aria-invalid')).toBe('true');fireEvent.change(field,{target:{value:'0.5'}});expect(JSON.parse(screen.getByTestId('draft').textContent!)).toEqual({amount:.5});expect(field.hasAttribute('aria-invalid')).toBe(false);
});
it.each(['.5','01','-.5'])('preserves finite native decimal spelling %s as a numeric draft',text=>{
 render(<Form/>);fireEvent.change(screen.getByLabelText('Amount'),{target:{value:text}});expect(JSON.parse(screen.getByTestId('draft').textContent!)).toEqual({amount:Number(text)});
});
