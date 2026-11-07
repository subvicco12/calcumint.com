import {expect,it} from 'vitest';
import {n1PublicationMethodology} from './n1-publication-methodology';
import {serializeCalculationPdf} from './calculation-export-pdf';
import {createCalculationSnapshot} from './calculation-snapshot';
import {captureScenario,scenarioSetPayload} from './scenario-set';
it('limits added conventions to exact v1 identities and retains existing scope/methodology',()=>{
 for(const id of [430,434]){const text=n1PublicationMethodology(id,1,'Existing formula','Existing scope');expect(text).toContain('Existing formula');expect(text).toContain('Existing scope');expect(n1PublicationMethodology(id,2,'Existing formula','scope')).toBe('Existing formula');}
 expect(n1PublicationMethodology(438,1,'Existing formula','scope')).toBe('Existing formula');
});
it('retains convention in new scenario payloads without changing raw captured codes or results',()=>{
 const snapshot=createCalculationSnapshot({calculatorSlug:'data-storage-converter',calculatorVersion:1,input:{value:1,fromUnit:'KB',toUnit:'B'},output:{result:1000}});
 const methodology=n1PublicationMethodology(434,1,'Existing formula','Existing scope');
 const row=scenarioSetPayload(captureScenario([],'A',snapshot,'',undefined,methodology)).scenarios[0];
 expect(row.methodology).toContain('SI symbol is kB');expect(row.input.fromUnit).toBe('KB');expect(row.output.result).toBe(1000);
});

it('includes energy convention in generated PDF methodology while retaining stored result',()=>{
 const snapshot=createCalculationSnapshot({calculatorSlug:'energy-converter',calculatorVersion:1,input:{value:1,fromUnit:'cal',toUnit:'j'},output:{result:4.184}});
 const methodology=n1PublicationMethodology(430,1,'Existing formula','Existing scope');
 const pdf=new TextDecoder().decode(serializeCalculationPdf(snapshot,{methodology}));
 const text=[...pdf.matchAll(/\(([^\n]*)\) Tj ET/g)].map(match=>match[1]).join('');
 expect(text).toContain('thermochemical');expect(text).toContain('4.184 J');expect(snapshot.output.result).toBe(4.184);
});
