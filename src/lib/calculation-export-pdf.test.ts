import { describe, expect, it } from 'vitest';
import { serializeCalculationPdf } from './calculation-export';
import { createCalculationSnapshot } from './calculation-snapshot';

const snapshot = createCalculationSnapshot({ calculatorSlug: 'test-calculator', calculatorVersion: 7, input: { amount: -0, tiny: -1e-20 }, output: { value: 123.45678901234567, missing: null, empty: [], nested: { value: true } } });
const decode = (bytes: Uint8Array) => new TextDecoder().decode(bytes);

describe('deterministic calculation PDF', () => {
  it('writes an actual PDF with correct byte offsets and stream lengths', () => {
    const bytes = serializeCalculationPdf(snapshot, { title: 'Area (m²)', sources: [{ label: 'Source', url: 'https://example.test/ref', note: 'Declared reference' }], formulas: [{ id: 'area', expression: 'a × b', description: 'Declared formula' }], methodology: 'Existing method' });
    expect(serializeCalculationPdf(snapshot, { title: 'Area (m²)', sources: [{ label: 'Source', url: 'https://example.test/ref', note: 'Declared reference' }], formulas: [{ id: 'area', expression: 'a × b', description: 'Declared formula' }], methodology: 'Existing method' })).toEqual(bytes);
    const pdf = decode(bytes);
    expect(pdf.startsWith('%PDF-1.7\n')).toBe(true);
    expect(pdf.endsWith('%%EOF\n')).toBe(true);
    const xrefOffset = Number(/startxref\n(\d+)/.exec(pdf)![1]);
    expect(pdf.slice(xrefOffset, xrefOffset + 4)).toBe('xref');
    const entries = [...pdf.slice(xrefOffset).matchAll(/(\d{10}) 00000 n /g)];
    entries.forEach((entry, index) => expect(pdf.slice(Number(entry[1]))).toMatch(new RegExp(`^${index + 1} 0 obj\\n`)));
    for (const stream of pdf.matchAll(/\/Length (\d+) >>\nstream\n([\s\S]*?)\nendstream/g)) expect(stream[2].length).toBe(Number(stream[1]));
    expect(pdf).toContain('Area \\(m\\262\\)');
    expect(pdf).toContain('Existing method');
    expect(pdf).toContain('https://example.test/ref');
    expect(pdf).toContain('Declared formula');
  });

  it('preserves raw signs, precision, complete nested fields and explicitly bound units', () => {
    const pdf = decode(serializeCalculationPdf(snapshot, { displayMetadata: { schemaVersion: 1, calculatorSlug: snapshot.calculatorSlug, calculatorVersion: 7, inputs: {}, outputs: { value: { label: 'Area', unit: 'm²' } } } }));
    for (const text of ['input["amount"] = -0', 'input["tiny"] = -1e-20', 'output["value"] = 123.45678901234567', 'output["missing"] = null', 'output["empty"] = []', 'output["nested"]["value"] = true', 'Area [m\\262]', 'Engine version: 7']) expect(pdf).toContain(text);
    expect(snapshot.output.value).toBe(123.45678901234567);
    expect(Object.is(snapshot.input.amount, -0)).toBe(true);
  });

  it('paginates every schedule row without sampling and numbers every page', () => {
    const rows = Array.from({ length: 1200 }, (_, index) => ({ period: index + 1, value: (index + 1) / 7 }));
    const pdf = decode(serializeCalculationPdf({ ...snapshot, output: { rows } }));
    expect(pdf).toContain('output["rows"][1199]["value"] = 171.42857142857142');
    expect([...pdf.matchAll(/output\["rows"\]\[\d+\]\["period"\]/g)]).toHaveLength(1200);
    const count = Number(/\/Type \/Pages \/Count (\d+)/.exec(pdf)![1]);
    expect(count).toBeGreaterThan(40);
    for (let page = 1; page <= count; page++) expect(pdf).toContain(`Page ${page} of ${count}`);
  });

  it('escapes PDF commands, controls and unsupported Unicode without silently changing the text', () => {
    const pdf = decode(serializeCalculationPdf({ ...snapshot, input: { text: ') Tj ET /evil (\\\nΩ😀' } }, { title: 'Ω\nReport' }));
    expect(pdf).toContain('\\u03a9');
    expect(pdf).toContain('\\u{1f600}');
    expect(pdf).toContain('\\) Tj ET /evil \\(');
    expect(pdf).not.toContain('Ω');
    expect(pdf).toContain('explicit Unicode escapes');
  });

  it('wraps long fields without dropping their tail', () => {
    const text = 'a'.repeat(2000) + 'END-OF-LONG-VALUE';
    const pdf = decode(serializeCalculationPdf({ ...snapshot, output: { text } }));
    const renderedLines = [...pdf.matchAll(/BT \/F[12] 9 Tf.*?\((.*)\) Tj ET/g)];
    expect(renderedLines.map(match => match[1]).join('')).toContain(text);
    expect(renderedLines.every(match => match[1].length <= 110)).toBe(true);
  });

  it.each([NaN, Infinity, undefined, new Date(), Array(1)])('rejects unsupported raw values before producing bytes: %s', value => {
    expect(() => serializeCalculationPdf({ ...snapshot, output: { value } })).toThrow();
  });

  it('rejects mismatched bound metadata and malformed trust data', () => {
    expect(() => serializeCalculationPdf(snapshot, { displayMetadata: { schemaVersion: 1, calculatorSlug: snapshot.calculatorSlug, calculatorVersion: 8, inputs: {}, outputs: {} } })).toThrow(/identity mismatch/);
    expect(() => serializeCalculationPdf(snapshot, { sources: [{ label: 1 }] } as never)).toThrow(/PDF source/);
    expect(() => serializeCalculationPdf(snapshot, { methodology: 1 } as never)).toThrow(/PDF text/);
    expect(() => serializeCalculationPdf(snapshot, { formulas: [{ expression: 'invented' }] } as never)).toThrow(/PDF formula/);
  });
  it('renders vector charts with exact signed values and declared units', () => {
    const pdf = decode(serializeCalculationPdf(snapshot, { charts: [{ title: 'Signed chart', unit: 'm', points: [{ label: 'negative', value: -3 }, { label: 'zero', value: -0 }, { label: 'tiny', value: 1e-300 }] }] }));
    for (const text of ['Signed chart', 'negative = -3 [m]', 'zero = -0 [m]', 'tiny = 1e-300 [m]', 'Linear scale', ' re f']) expect(pdf).toContain(text);
    expect(pdf).not.toContain('NaN');
    expect(pdf).not.toMatch(/\d[eE][-+]\d+ 6 re f/);
  });

  it('renders complete wrapped tables with repeated headings on continuation pages', () => {
    const rows = Array.from({ length: 130 }, (_, index) => [String(index), `row-${index}-` + 'x'.repeat(100)]);
    const pdf = decode(serializeCalculationPdf(snapshot, { tables: [{ title: 'Schedule', columns: ['Period', 'Detail'], rows }] }));
    expect(pdf).toContain('row-129-');
    expect([...pdf.matchAll(/Schedule/g)].length).toBeGreaterThan(2);
    expect([...pdf.matchAll(/Period/g)].length).toBeGreaterThan(2);
    expect(pdf).toContain(' | ');
  });

  it('declares document title and language with real tagging without claiming PDF/UA conformance', () => {
    const pdf = decode(serializeCalculationPdf(snapshot, { title: 'Declared title', language: 'en-GB' }));
    expect(pdf).toContain('/Lang (en-GB)');
    expect(pdf).toContain('/Title (Declared title)');
    expect(pdf).toContain('PDF/UA conformance: UNVERIFIED');
    expect(pdf).toContain('/MarkInfo << /Marked true >>');
    expect(pdf).toContain('/StructTreeRoot');
  });

  it.each([
    { charts: [{ title: 'Bad', points: [{ label: 'a', value: '1' }] }] },
    { charts: [{ title: 'Bad', unit: 3, points: [] }] },
    { tables: [{ title: 'Bad', columns: ['a'], rows: [['a', 'b']] }] },
    { tables: [{ title: 'Bad', columns: [], rows: [] }] },
    { language: 'not a language!' },
  ])('rejects invalid report sections: %s', options => {
    expect(() => serializeCalculationPdf(snapshot, options as never)).toThrow();
  });

  it('places report and trust sections before a complete raw appendix', () => {
    const pdf = decode(serializeCalculationPdf({ ...snapshot, output: { rows: Array.from({ length: 500 }, (_, i) => ({ value: i })) } }, { methodology: 'Trust method first', sources: [{ label: 'Trust source first' }], tables: [{ title: 'Comparison first', columns: ['Result'], rows: [['Summary']] }], charts: [{ title: 'Chart first', points: [{ label: 'result', value: 1 }] }] }));
    const raw = pdf.indexOf('output["rows"][0]');
    for (const text of ['Trust method first', 'Trust source first', 'Comparison first', 'Chart first', 'COMPLETE RAW APPENDIX']) expect(pdf.indexOf(text)).toBeLessThan(raw);
    expect(pdf).toContain('output["rows"][499]["value"] = 499');
    expect([...pdf.matchAll(/output\["rows"\]\[\d+\]\["value"\]/g)]).toHaveLength(500);
  });

  it('keeps continuation headings bounded for very long titles and column labels', () => {
    const long = 'LONG'.repeat(1320);
    const pdf = decode(serializeCalculationPdf(snapshot, { tables: [{ title: long, columns: [long + 'COLUMNTAIL', 'Second'], rows: Array.from({ length: 100 }, (_, i) => [String(i), `LAST-${i}`]) }], charts: [{ title: long + 'CHARTTAIL', points: Array.from({ length: 100 }, (_, i) => ({ label: `POINT-${i}`, value: i })) }] }));
    const count = Number(/\/Type \/Pages \/Count (\d+)/.exec(pdf)![1]);
    expect(count).toBeLessThan(20);
    expect(pdf).toContain('COLUMNTAIL');
    expect(pdf).toContain('CHARTTAIL');
    expect(pdf).toContain('LAST-99');
    expect(pdf).toContain('POINT-99 = 99');
  });

});

describe('PDF logical structure', () => {
  it('maps every MCID to its owning structure element on every page', () => {
    const pdf = decode(serializeCalculationPdf(snapshot, { tables: [{ title: 'Long table', columns: ['Period', 'Detail'], rows: [['1', 'x'.repeat(10000)], ['2', 'tail']] }, { title: 'Empty', columns: ['Value'], rows: [] }], charts: [{ title: 'Chart', points: [{ label: 'Exact', value: 1e-20 }] }] }));
    const objects = new Map([...pdf.matchAll(/(\d+) 0 obj\n([\s\S]*?)\nendobj/g)].map(match => [Number(match[1]), match[2]]));
    const tree = [...objects.values()].find(value => value.includes('/Nums ['))!;
    const parents = new Map([...tree.matchAll(/(\d+) \[([\d R]*)\]/g)].map(match => [Number(match[1]), [...match[2].matchAll(/(\d+) 0 R/g)].map(ref => Number(ref[1]))]));
    const pages = [...objects.entries()].filter(([, value]) => value.includes('/Type /Page '));
    expect(pages.length).toBeGreaterThan(4);
    for (const [pageId, page] of pages) {
      const key = Number(/\/StructParents (\d+)/.exec(page)![1]);
      const stream = objects.get(Number(/\/Contents (\d+) 0 R/.exec(page)![1]))!;
      const ids = [...stream.matchAll(/\/MCID (\d+)/g)].map(match => Number(match[1]));
      expect(ids).toEqual(Array.from({ length: ids.length }, (_, i) => i));
      expect(parents.get(key)).toHaveLength(ids.length);
      for (const id of ids) expect(objects.get(parents.get(key)![id])).toContain(`/Pg ${pageId} 0 R /MCID ${id}`);
      expect(stream).toContain('/Artifact << /Type /Pagination /Subtype /Header >> BDC');
      expect(stream).toContain('/Artifact << /Type /Pagination /Subtype /Footer >> BDC');
      expect([...stream.matchAll(/\b(?:BDC|BMC)\b/g)]).toHaveLength([...stream.matchAll(/\bEMC\b/g)].length);
    }
    for (const role of ['Document', 'H1', 'H2', 'P', 'Table', 'TR', 'TH', 'TD', 'Figure']) expect(pdf).toContain(`/S /${role} `);
    // Backlinks and logical children agree independently of visual row fragments.
    const elements = [...objects.entries()].filter(([, value]) => value.includes('/Type /StructElem '));
    for (const [id, element] of elements) {
      const parent = objects.get(Number(/\/P (\d+) 0 R/.exec(element)![1]))!;
      expect(parent).toMatch(new RegExp(`/K \\[([^\\]]* )?${id} 0 R(?: |\\])`));
      for (const ref of element.matchAll(/\/Pg (\d+) 0 R \/MCID (\d+)/g)) {
        const page = objects.get(Number(ref[1]))!;
        const key = Number(/\/StructParents (\d+)/.exec(page)![1]);
        expect(parents.get(key)![Number(ref[2])]).toBe(id);
      }
    }
    // A cell spanning many pages remains one TD in its original TR.
    const longCell = elements.find(([, value]) => value.includes('/S /TD ') && [...value.matchAll(/\/MCID /g)].length > 100)!;
    expect(longCell).toBeDefined();
    expect(pdf).toContain('/IDTree ');
    expect(pdf).toContain('/Scope /Column');
    expect(pdf).toMatch(/\/Headers \[\(table-0-column-0\)\]/);
    expect(pdf).toContain('/Alt (Chart; Exact = 1e-20)');
    expect(pdf).toContain('no rows');
    expect(pdf).not.toContain('Untagged PDF');
  });
});
