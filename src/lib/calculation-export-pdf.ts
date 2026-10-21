import type { CalculatorFormula, CalculatorSource } from '@/calculators/types';
import { createCalculationSnapshot, type CalculationSnapshot } from './calculation-snapshot';
import { validateScenarioDisplayMetadata, type ScenarioDisplayMetadata } from './scenario-display-metadata';

export type CalculationPdfOptions = Readonly<{
  title?: string;
  displayMetadata?: ScenarioDisplayMetadata;
  methodology?: string;
  sources?: readonly CalculatorSource[];
  formulas?: readonly CalculatorFormula[];
}>;

type Line = { text: string; heading?: boolean };
const WIDTH = 88;
const PAGE_LINES = 49;

/** The standard PDF fonts cover Latin-1 units. Other characters remain explicit,
 * lossless Unicode escapes, rather than silently disappearing or changing units. */
function printable(text: string): string {
  return Array.from(text, character => {
    const code = character.codePointAt(0)!;
    if ((code >= 32 && code <= 126) || (code >= 160 && code <= 255)) return character;
    return code <= 65535 ? `\\u${code.toString(16).padStart(4, '0')}` : `\\u{${code.toString(16)}}`;
  }).join('');
}

function literal(text: string): string {
  return `(${Array.from(text, character => {
    const code = character.charCodeAt(0);
    if (code > 126) return `\\${code.toString(8).padStart(3, '0')}`;
    return /[\\()]/.test(character) ? `\\${character}` : character;
  }).join('')})`;
}

function valueText(value: unknown): string {
  if (typeof value === 'number') return Object.is(value, -0) ? '-0' : String(value);
  return JSON.stringify(value);
}

/** A local, deterministic PDF artifact from the same immutable raw calculation
 * authority as CSV/JSON. No recalculation, display rounding, sampling or network I/O. */
export function serializeCalculationPdf(snapshot: CalculationSnapshot, options: CalculationPdfOptions = {}): Uint8Array {
  const captured = createCalculationSnapshot(snapshot);
  // Copy and validate the entire options domain before reading any display fields.
  const metadata = createCalculationSnapshot({ ...captured, input: {}, output: options as Record<string, unknown> }).output;
  const display = metadata.displayMetadata === undefined ? undefined : validateScenarioDisplayMetadata(metadata.displayMetadata, captured);
  const optionalText = (value: unknown): string | undefined => {
    if (value === undefined) return undefined;
    if (typeof value !== 'string') throw new Error('Invalid PDF text metadata');
    return value;
  };
  const title = optionalText(metadata.title) || captured.calculatorSlug;
  const methodology = optionalText(metadata.methodology);
  const lines: Line[] = [];
  const add = (text: string, heading = false) => {
    const visible = printable(text);
    if (!visible) lines.push({ text: '', heading });
    for (let start = 0; start < visible.length; start += WIDTH) lines.push({ text: visible.slice(start, start + WIDTH), heading });
  };
  add(title, true);
  add(`Calculator: ${captured.calculatorSlug} | Engine version: ${captured.calculatorVersion}`);
  add('Raw engine values: full numeric precision; no display rounding or sampled rows.');
  add('Units appear only where supplied by the calculation or bound display metadata.');
  add('Characters outside Latin-1 and controls are shown as explicit Unicode escapes.');
  const field = (path: string, value: unknown) => {
    if (value !== null && typeof value === 'object' && Object.keys(value).length) {
      for (const [key, cell] of Object.entries(value)) field(`${path}[${Array.isArray(value) ? key : JSON.stringify(key)}]`, cell);
    } else add(`${path} = ${valueText(value)}`);
  };
  for (const group of ['input', 'output'] as const) {
    add('', true);
    add(group === 'input' ? 'INPUTS' : 'RESULTS', true);
    const mapping = display?.[group === 'input' ? 'inputs' : 'outputs'];
    if (!Object.keys(captured[group]).length) add('(empty record)');
    for (const [key, value] of Object.entries(captured[group])) {
      const label = mapping?.[key];
      if (label) add(`${label.label}${label.unit === undefined ? '' : ` [${label.unit}]`}`, true);
      field(`${group}[${JSON.stringify(key)}]`, value);
    }
  }
  if (methodology) { add(''); add('METHODOLOGY', true); add(methodology); }
  if (metadata.formulas !== undefined) {
    if (!Array.isArray(metadata.formulas)) throw new Error('Invalid PDF formulas');
    if (metadata.formulas.length) { add(''); add('DECLARED FORMULAS', true); }
    for (const formula of metadata.formulas) {
      if (!formula || typeof formula !== 'object' || typeof formula.id !== 'string' || typeof formula.expression !== 'string' || typeof formula.description !== 'string') throw new Error('Invalid PDF formula');
      add(`${formula.id}: ${formula.expression}`); add(formula.description);
    }
  }
  if (metadata.sources !== undefined) {
    if (!Array.isArray(metadata.sources)) throw new Error('Invalid PDF sources');
    if (metadata.sources.length) { add(''); add('SOURCES', true); }
    for (const source of metadata.sources) {
      if (!source || typeof source !== 'object' || typeof source.label !== 'string') throw new Error('Invalid PDF source');
      add(source.label);
      const url = optionalText(source.url), note = optionalText(source.note);
      if (url) add(url);
      if (note) add(note);
    }
  }
  const pages: Line[][] = [];
  for (let start = 0; start < lines.length; start += PAGE_LINES) pages.push(lines.slice(start, start + PAGE_LINES));
  // All syntax and streams are ASCII (Latin-1 glyphs use octal escapes), so
  // string offsets equal byte offsets in the mandatory cross-reference table.
  const objects: string[] = [];
  const reserve = () => { objects.push(''); return objects.length; };
  const catalog = reserve(), pageTree = reserve(), bodyFont = reserve(), headingFont = reserve();
  objects[bodyFont - 1] = '<< /Type /Font /Subtype /Type1 /BaseFont /Courier /Encoding /WinAnsiEncoding >>';
  objects[headingFont - 1] = '<< /Type /Font /Subtype /Type1 /BaseFont /Courier-Bold /Encoding /WinAnsiEncoding >>';
  const pageIds = pages.map((page, index) => {
    const pageId = reserve(), streamId = reserve();
    const commands = [
      '0.12 0.28 0.30 rg',
      `BT /F2 11 Tf 48 798 Td ${literal('CalcuMint | Calculation report')} Tj ET`,
      '0.75 0.82 0.82 RG 48 786 m 547 786 l S',
      ...page.map((line, row) => `BT /${line.heading ? 'F2' : 'F1'} 9 Tf 0.10 0.13 0.15 rg 48 ${763 - row * 14} Td ${literal(line.text)} Tj ET`),
      '0.75 0.82 0.82 RG 48 62 m 547 62 l S',
      `BT /F1 9 Tf 0.30 0.35 0.35 rg 48 45 Td ${literal(`Engine v${captured.calculatorVersion} | Page ${index + 1} of ${pages.length}`)} Tj ET`,
    ].join('\n');
    objects[streamId - 1] = `<< /Length ${commands.length} >>\nstream\n${commands}\nendstream`;
    objects[pageId - 1] = `<< /Type /Page /Parent ${pageTree} 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 ${bodyFont} 0 R /F2 ${headingFont} 0 R >> >> /Contents ${streamId} 0 R >>`;
    return pageId;
  });
  objects[catalog - 1] = `<< /Type /Catalog /Pages ${pageTree} 0 R >>`;
  objects[pageTree - 1] = `<< /Type /Pages /Count ${pages.length} /Kids [${pageIds.map(id => `${id} 0 R`).join(' ')}] >>`;
  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  objects.forEach((object, index) => { offsets.push(pdf.length); pdf += `${index + 1} 0 obj\n${object}\nendobj\n`; });
  const xref = pdf.length;
  pdf += `xref\n0 ${offsets.length}\n0000000000 65535 f \n${offsets.slice(1).map(offset => `${String(offset).padStart(10, '0')} 00000 n \n`).join('')}trailer\n<< /Size ${offsets.length} /Root ${catalog} 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return new TextEncoder().encode(pdf);
}
