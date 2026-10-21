// @vitest-environment jsdom
import {createElement} from 'react';
import {cleanup,render,screen} from '@testing-library/react';
import {afterEach,expect,it} from 'vitest';
import {FinalResultPresentation} from '@/components/final-result-presentation';
afterEach(cleanup);
it('keeps actual compatibility table semantics and source-link safety after component reuse',()=>{
 render(createElement(FinalResultPresentation,{plan:'pro',result:{primaryResult:{id:'total',label:'Total',value:3},schedule:[{id:'one',period:1,values:{amount:3}}],sources:[{label:'Authority reference',url:'https://example.org/reference'}]}}));
 const table=screen.getByRole('table',{name:'Detailed calculation schedule',hidden:true});expect(table.closest('.schedule-scroll')?.getAttribute('tabindex')).toBe('0');
 const source=screen.getByRole('link',{name:'Authority reference',hidden:true});expect(source.getAttribute('target')).toBe('_blank');expect(source.getAttribute('rel')).toBe('noopener noreferrer');
});
