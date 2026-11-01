/** @vitest-environment jsdom */
import {afterEach,it,expect} from 'vitest';
import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import Decimal from 'decimal.js';
import {ScaledContractReview} from './scaled-contract-review';
import {allContractAdapters,allContractVectors} from '@/calculators/scaled-contract-adapters';
const cohort=allContractAdapters.filter(a=>a.key.startsWith('private.component.')||a.key.startsWith('private.remaining.'));
afterEach(()=>{cleanup();localStorage.clear();});
function firstNumber(value:unknown,path:(string|number)[]=[]):{path:(string|number)[];value:number}|undefined{
 if(typeof value==='number'&&value!==0&&Number.isFinite(value))return {path,value};
 if(value&&typeof value==='object')for(const [key,child]of Object.entries(value)){const found=firstNumber(child,[...path,Array.isArray(value)?Number(key):key]);if(found)return found;}
}
it('pins the exact76 shared-workflow cohort without calculus or family transfer',()=>{expect(cohort).toHaveLength(76);expect(new Set(cohort.map(a=>a.catalogId)).size).toBe(76);});
it.each(cohort)('$key refuses lossy new input while retaining original history and recovery',adapter=>{
 render(<ScaledContractReview/>);fireEvent.change(screen.getByLabelText('Related calculator and immutable adapter'),{target:{value:adapter.key}});
 const raw=screen.getByLabelText('Complete contract input JSON') as HTMLTextAreaElement;
 const original=raw.value;fireEvent.click(screen.getByRole('button',{name:'Run contract'}));expect(screen.getByTestId('cv-value')).toBeTruthy();
 fireEvent.click(screen.getByRole('button',{name:'Save review history'}));const history=localStorage.getItem('calcumint-private-contract-validation-scaled-v2');expect(history).not.toBeNull();
 const witness=allContractVectors.find(v=>v.id===adapter.catalogId)!.witnesses[0].input,number=firstNumber(witness)!;expect(number).toBeTruthy();
 const clone=structuredClone(witness) as Record<string,unknown>;let parent:Record<string,unknown>=clone;
 for(const key of number.path.slice(0,-1))parent=parent[key] as Record<string,unknown>;
 parent[number.path.at(-1)!]='__LOSSY_NUMERIC_TOKEN__';const decimal=new Decimal(number.value).toFixed();const token=(decimal.includes('.')?decimal:decimal+'.')+'0'.repeat(40)+'1';expect(Number(token)).toBe(number.value);
 const lossy=JSON.stringify(clone).replace('"__LOSSY_NUMERIC_TOKEN__"',token);
 fireEvent.change(raw,{target:{value:lossy}});fireEvent.click(screen.getByRole('button',{name:'Run contract'}));
 expect(screen.queryByTestId('cv-value')).toBeNull();expect((screen.getByRole('button',{name:'Save review history'}) as HTMLButtonElement).disabled).toBe(true);expect(raw.value).toBe(lossy);expect(localStorage.getItem('calcumint-private-contract-validation-scaled-v2')).toBe(history);
 fireEvent.change(raw,{target:{value:original}});fireEvent.click(screen.getByRole('button',{name:'Run contract'}));expect(screen.getByTestId('cv-value')).toBeTruthy();expect(localStorage.getItem('calcumint-private-contract-validation-scaled-v2')).toBe(history);
});
