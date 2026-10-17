// @vitest-environment jsdom
import {cleanup,fireEvent,render,screen,within} from '@testing-library/react';
import {afterEach,expect,it} from 'vitest';
import {FinalCalculatorRenderer} from './final-calculator-renderer';
import {FinalResultPresentation} from './final-result-presentation';
import {displayFinalValue} from '@/calculators/final-framework/renderer-display';
import {referencePresentations} from '@/calculators/final-framework/reference-presentations';
import type {StructuredCalculationResult} from '@/calculators/final-framework/types';
afterEach(cleanup);
const result:StructuredCalculationResult={primaryResult:{id:'v',label:'Value',value:0},series:[{id:'trend',label:'Projected value',unit:'units',points:[{x:'First',y:-.001},{x:'Zero',y:-0},{x:'Last',y:1e-12}]}]};
it.each(['free','pro','business'] as const)('exposes exact signed chart/table data in both result renderers on %s',plan=>{
 for(const Renderer of [FinalCalculatorRenderer,FinalResultPresentation]){render(<Renderer result={result} plan={plan}/>);expect(screen.queryByRole('img')).toBeNull();const meters=screen.getAllByRole('meter');expect(meters).toHaveLength(3);expect(meters[0].getAttribute('value')).toBe('-0.001');expect(meters[0].getAttribute('aria-valuetext')).toBe('-0.001 units');expect(meters[0].getAttribute('min')).toBe('-0.001');
 const table=screen.getByRole('table',{name:'Trend data: Projected value'});expect(within(table).getAllByRole('rowheader').map(e=>e.textContent)).toEqual(['First','Zero','Last']);expect(table.textContent).toContain('-0 units');expect(table.textContent).toContain(displayFinalValue(1e-12,'units'));cleanup();}
});
it('bounds complete trend data and resets after invalid/replacement result data',()=>{
 const rows=Array.from({length:51},(_,x)=>({x,y:x===50?-1e-12:x}));for(const Renderer of [FinalCalculatorRenderer,FinalResultPresentation]){const original={...result,series:[{...result.series![0],points:rows}]};const view=render(<Renderer result={original} plan="business"/>);expect(screen.getAllByRole('meter')).toHaveLength(25);fireEvent.click(screen.getByRole('button',{name:'Next trend page'}));expect(screen.getAllByRole('status').some(e=>e.textContent?.includes('26–50 of 51'))).toBe(true);
 view.rerender(<Renderer result={{...original,series:[{...original.series[0],points:[{x:0,y:Infinity}]}]}} plan="business"/>);expect(screen.getByRole('alert')).toBeTruthy();expect(screen.queryByRole('meter')).toBeNull();view.rerender(<Renderer result={original} plan="business"/>);expect(screen.getAllByRole('status').some(e=>e.textContent?.includes('1–25 of 51'))).toBe(true);expect(rows).toHaveLength(51);cleanup();}
});
it('gives both legacy schedule scroll surfaces keyboard access and scoped row/column headers',()=>{
 const schedule={...result,series:undefined,schedule:[{id:'r',period:0,values:{first:0,second:-1}}]};for(const Renderer of [FinalCalculatorRenderer,FinalResultPresentation]){render(<Renderer result={schedule} plan="pro" presentation={referencePresentations.loanEmi}/>);const region=screen.getByRole('region',{name:'Detailed calculation schedule data'});expect(region.tabIndex).toBe(0);const table=within(region).getByRole('table');expect(within(table).getAllByRole('columnheader').every(e=>e.getAttribute('scope')==='col')).toBe(true);expect(within(table).getByRole('rowheader',{name:'0'}).getAttribute('scope')).toBe('row');cleanup();}
});

it('keeps exact fractional position identities distinct instead of rounding chart/table labels',()=>{
 const points=[{x:4/365,y:1},{x:5/365,y:2}];for(const Renderer of [FinalCalculatorRenderer,FinalResultPresentation]){render(<Renderer result={{...result,series:[{...result.series![0],points}]}}/>);expect(screen.getAllByRole('rowheader').map(e=>e.textContent)).toEqual(points.map(p=>String(p.x)));expect(screen.getAllByRole('meter')[0].getAttribute('aria-label')).toContain(String(points[0].x));cleanup();}
});
