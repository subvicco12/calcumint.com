import {it,expect} from 'vitest';
import {execFileSync,spawnSync} from 'node:child_process';
import {mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {serializeCalculationPdf} from './calculation-export-pdf';

const snapshot={calculatorSlug:'sip-calculator',calculatorVersion:1,input:{currency:'₹'},output:{amount:123.456789}};
const options={title:'Savings ₹ and resistance Ω',tables:[{title:'Declared units',columns:['Amount ₹','Resistance Ω','Temperature °C','Length µm'],rows:[['123.456789 ₹','5 Ω','20 °C','2 µm']]}]};
it('embeds deterministic mapped BMP glyphs without changing raw precision, tags or PDF byte offsets',()=>{
 const bytes=serializeCalculationPdf(snapshot,options);
 expect(serializeCalculationPdf(snapshot,options)).toEqual(bytes);
 const pdf=new TextDecoder().decode(bytes);
 for(const text of ['/FontFile2','/ToUnicode','/CIDToGIDMap','<20b9> <20b9>','<03a9> <03a9>','/StructTreeRoot','/Scope /Column','123.456789'])expect(pdf).toContain(text);
 const xref=Number(/startxref\n(\d+)/.exec(pdf)![1]);
 expect(pdf.slice(xref,xref+4)).toBe('xref');
 [...pdf.slice(xref).matchAll(/(\d{10}) 00000 n /g)].forEach((entry,index)=>expect(pdf.slice(Number(entry[1]))).toMatch(new RegExp(`^${index+1} 0 obj\\n`)));
 for(const stream of pdf.matchAll(/\/Length (\d+)(?: [^\n]*)? >>\nstream\n([\s\S]*?)\nendstream/g))expect(stream[2].length).toBe(Number(stream[1]));
});

// Optional independent integration proof. Core font/mapping/offset assertions above
// always run; npm test does not require an undeclared system Poppler installation.
const popplerAvailable=!spawnSync('pdftotext',['-v']).error&&!spawnSync('pdffonts',['-v']).error;
it.skipIf(!popplerAvailable)('exports readable supported INR and scientific units through independent Poppler extraction',()=>{
 const folder=mkdtempSync(join(tmpdir(),'calcumint-unicode-'));
 try {
  const path=join(folder,'report.pdf');
  const bytes=serializeCalculationPdf(snapshot,options);
  writeFileSync(path,bytes);
  const text=execFileSync('pdftotext',['-layout',path,'-'],{encoding:'utf8'});
  for(const label of ['Savings ₹ and resistance Ω','Amount ₹','Resistance Ω','Temperature °C','Length µm','123.456789 ₹','5 Ω','20 °C','2 µm'])expect(text).toContain(label);
  expect(text).not.toContain('\\u20b9');
  const fonts=execFileSync('pdffonts',[path],{encoding:'utf8'});
  expect(fonts).toMatch(/CalcuMintUnicode.*yes\s+yes\s+yes/);
  expect(text).toContain('PDF/UA conformance: UNVERIFIED');
 } finally {rmSync(folder,{recursive:true,force:true});}
});
