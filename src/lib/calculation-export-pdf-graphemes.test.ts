import {expect,it,vi} from 'vitest';
import {createHash} from 'node:crypto';
import {execFileSync,spawnSync} from 'node:child_process';
import {mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {serializeCalculationPdf} from './calculation-export-pdf';

const snapshot={calculatorSlug:'slope-calculator',calculatorVersion:1,input:{note:'Cafe\u0301',rise:6,run:3},output:{result:1.999}};
const title='a'.repeat(87)+'e\u0301',cell='a'.repeat(18)+'e\u0301';
const options={title,tables:[{title:'Recorded labels',columns:['A','B','C','D'],rows:[[cell,'Cafe\u0301','x\u0301','unchanged']]}]};
const decode=(bytes:Uint8Array)=>new TextDecoder().decode(bytes);
const utf16=(text:string)=>'feff'+Array.from(text,c=>c.charCodeAt(0).toString(16).padStart(4,'0')).join('');
it('wraps supported composed glyphs as one cell and preserves original text replacement',()=>{
 const before=JSON.stringify(snapshot),bytes=serializeCalculationPdf(snapshot,options),pdf=decode(bytes);
 expect(pdf).toContain(`(${'a'.repeat(87)}\\351) Tj ET`);
 expect(pdf).toContain(`(${'a'.repeat(18)}\\351) Tj ET`);
 expect(pdf).toContain(`/ActualText <${utf16(title)}>`);
 expect(pdf).toContain(`/ActualText <${utf16(cell)}>`);
 expect(pdf).toContain('1.999');expect(pdf).toContain('Engine version: 1');
 expect(JSON.stringify(snapshot)).toBe(before);expect(serializeCalculationPdf(snapshot,options)).toEqual(bytes);
});
it('uses explicit escapes for unsupported mark positioning and invisible format controls',()=>{
 const pdf=decode(serializeCalculationPdf({...snapshot,input:{note:'x\u0301\ufeff\u00ad'}}));
 for(const escaped of ['\\\\u0301','\\\\ufeff','\\\\u00ad'])expect(pdf).toContain(escaped);
 expect(pdf).not.toContain('<0301> <0301>');expect(pdf).not.toContain('<feff> <feff>');
});
it('maps the composed glyph rather than the original mark in embedded font resources',()=>{
 const pdf=decode(serializeCalculationPdf({...snapshot,input:{note:'a\u0304'}}));
 expect(pdf).toContain('<0101> <0101>');expect(pdf).not.toContain('<0304> <0304>');
 expect(pdf).toContain(`/ActualText <${utf16('input["note"] = "a\u0304"')}>`);
 const xref=Number(/startxref\n(\d+)/.exec(pdf)![1]);expect(pdf.slice(xref,xref+4)).toBe('xref');
 [...pdf.slice(xref).matchAll(/(\d{10}) 00000 n /g)].forEach((entry,index)=>expect(pdf.slice(Number(entry[1]))).toMatch(new RegExp(`^${index+1} 0 obj\\n`)));
 for(const stream of pdf.matchAll(/\/Length (\d+)(?: [^\n]*)? >>\nstream\n([\s\S]*?)\nendstream/g))expect(stream[2].length).toBe(Number(stream[1]));
});
const popplerAvailable=!spawnSync('pdftotext',['-v']).error;
it.skipIf(!popplerAvailable)('extracts original decomposed text without detached accents at paragraph or cell boundaries',()=>{
 const folder=mkdtempSync(join(tmpdir(),'calcumint-graphemes-'));
 try{
  const file=join(folder,'report.pdf');writeFileSync(file,serializeCalculationPdf(snapshot,options));
  const text=execFileSync('pdftotext',['-layout',file,'-'],{encoding:'utf8'});
  expect(text).toContain(title);expect(text).toContain(cell);expect(text).toContain('Cafe\u0301');
  expect(text).toContain('x\\u0301');expect(text).not.toMatch(/\n\s*\u0301/);
 }finally{rmSync(folder,{recursive:true,force:true});}
});
const rasterAvailable=!spawnSync('pdftoppm',['-v']).error;
it.skipIf(!rasterAvailable)('renders canonically equivalent labels identically through independent Poppler rasterization',()=>{
 const folder=mkdtempSync(join(tmpdir(),'calcumint-grapheme-pixels-'));
 try{
  const normalized={...options,title:title.normalize('NFC'),tables:options.tables.map(table=>({...table,rows:table.rows.map(row=>row.map(value=>value.normalize('NFC')))}))};
  const images=[options,normalized].map((value,index)=>{
   const file=join(folder,`${index}.pdf`);writeFileSync(file,serializeCalculationPdf(snapshot,value));
   return execFileSync('pdftoppm',['-f','1','-l','1','-singlefile','-scale-to','900',file],{maxBuffer:4*1024*1024});
  });
  expect(createHash('sha256').update(images[0]).digest('hex')).toBe(createHash('sha256').update(images[1]).digest('hex'));
 }finally{rmSync(folder,{recursive:true,force:true});}
});
it('retains identical supported output when a browser has no Intl.Segmenter',async()=>{
 const expected=serializeCalculationPdf(snapshot,options);
 vi.resetModules();vi.stubGlobal('Intl',Object.create(Intl,{Segmenter:{value:undefined}}));
 try{const exporter=await import('./calculation-export-pdf');expect(exporter.serializeCalculationPdf(snapshot,options)).toEqual(expected);}
 finally{vi.unstubAllGlobals();vi.resetModules();}
});
it('encodes nonbreaking spaces as Unicode in metadata and visible font mappings',()=>{
 const title='Prix\u00a0EUR',pdf=decode(serializeCalculationPdf(snapshot,{title}));
 expect(pdf).toContain(`/Title <${utf16(title)}>`);
 expect(pdf).toContain('<00a0> <00a0>');
 expect(pdf).toContain('<005000720069007800a0004500550052> Tj ET');
});
const infoAvailable=!spawnSync('pdfinfo',['-v']).error;
it.skipIf(!infoAvailable)('retains the nonbreaking space instead of a euro sign in independent PDF metadata',()=>{
 const folder=mkdtempSync(join(tmpdir(),'calcumint-nbsp-'));
 try{
  const file=join(folder,'report.pdf');writeFileSync(file,serializeCalculationPdf(snapshot,{title:'Prix\u00a0EUR'}));
  expect(execFileSync('pdfinfo',[file],{encoding:'utf8'})).toMatch(/Title:\s+Prix\u00a0EUR/);
 }finally{rmSync(folder,{recursive:true,force:true});}
});
