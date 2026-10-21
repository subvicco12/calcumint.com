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
    expect(pdf.startsWith('%PDF-1.4\n')).toBe(true);
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
});
