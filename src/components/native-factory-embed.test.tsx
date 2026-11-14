// @vitest-environment jsdom
import {afterEach,expect,it,vi} from 'vitest';
import {act,cleanup,fireEvent,render,screen} from '@testing-library/react';
import {NativeFactoryEmbed} from './native-factory-embed';
afterEach(()=>{cleanup();vi.unstubAllGlobals();});
const props={grant:'signed-fixture',companyName:'Business owner',title:'Length Converter',engineId:'conversion.length',scope:'International lengths',fields:[{key:'value',label:'Value',defaultValue:'1'},{key:'fromUnit',label:'From unit',options:['m','km'],defaultValue:'m'},{key:'toUnit',label:'To unit',options:['m','km'],defaultValue:'km'}]};
it('submits exact fields without a caller-selected identity and displays native server output',async()=>{
 const fetcher=vi.fn(async()=>new Response(JSON.stringify({output:{result:0.001},methodology:[],sources:[],warnings:[],limitations:'International lengths'})));
 vi.stubGlobal('fetch',fetcher);render(<NativeFactoryEmbed {...props}/>);
 fireEvent.change(screen.getByLabelText('Value'),{target:{value:'001.000'}});
 fireEvent.click(screen.getByRole('button',{name:'Calculate'}));
 expect(await screen.findByRole('status')).toHaveProperty('textContent',expect.stringContaining('{"result":0.001}'));
 expect((fetcher.mock.calls[0] as unknown as [string,RequestInit])[0]).toBe('/api/native-embed/signed-fixture/calculate');
 expect(JSON.parse((fetcher.mock.calls[0] as unknown as [string,RequestInit])[1].body as string)).toEqual({value:'001.000',fromUnit:'m',toUnit:'km'});
});
it('ignores an old response when controls change and shows server denials',async()=>{
 let resolve!:(response:Response)=>void;
 vi.stubGlobal('fetch',vi.fn(()=>new Promise<Response>(done=>{resolve=done;})));
 render(<NativeFactoryEmbed {...props}/>);fireEvent.click(screen.getByRole('button',{name:'Calculate'}));
 fireEvent.change(screen.getByLabelText('To unit'),{target:{value:'m'}});
 await act(async()=>resolve(new Response(JSON.stringify({output:{result:0.001},methodology:[],sources:[],warnings:[]}))));
 expect(screen.queryByRole('status')).toBeNull();
 vi.stubGlobal('fetch',vi.fn(async()=>new Response(JSON.stringify({error:'Grant revoked'}),{status:403})));
 fireEvent.click(screen.getByRole('button',{name:'Calculate'}));
 expect(await screen.findByRole('alert')).toHaveProperty('textContent','Grant revoked');
});

it.each([['MJ',430],['MW',431],['wk',432],['kN',438]])('announces the native numeric result with source-bound %s presentation',async(unit)=>{
 vi.stubGlobal('fetch',vi.fn(async()=>new Response(JSON.stringify({output:{result:2},unit,applicability:'Source scoped meaning',numericalPolicy:'Existing binary64 precision',refusalPolicy:'Refuse unsupported codes',methodology:[],sources:[],warnings:[],limitations:'Scoped units'}))));
 render(<NativeFactoryEmbed {...props}/>);fireEvent.click(screen.getByRole('button',{name:'Calculate'}));
 expect(await screen.findByLabelText('Calculated value')).toHaveProperty('textContent','2 '+unit);
 expect(screen.getByRole('status').textContent).toContain('Source scoped meaning');
 expect(screen.getByRole('status').textContent).toContain('Existing binary64 precision');
 expect(screen.getByRole('status').textContent).toContain('Refuse unsupported codes');
});
