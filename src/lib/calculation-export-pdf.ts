import type { CalculatorFormula, CalculatorSource } from '@/calculators/types';
import { createCalculationSnapshot, type CalculationSnapshot } from './calculation-snapshot';
import { validateScenarioDisplayMetadata, type ScenarioDisplayMetadata } from './scenario-display-metadata';
import {fontData,fontByteLength,unicodeGlyphs} from './pdf-font/dejavu-mono';

export type CalculationPdfOptions = Readonly<{
  title?: string;
  language?: string;
  tables?: readonly Readonly<{ title: string; columns: readonly string[]; rows: readonly (readonly string[])[] }>[];
  charts?: readonly Readonly<{ title: string; unit?: string; points: readonly Readonly<{ label: string; value: number }>[] }>[];
  displayMetadata?: ScenarioDisplayMetadata;
  methodology?: string;
  sources?: readonly CalculatorSource[];
  formulas?: readonly CalculatorFormula[];
}>;

type PdfTable = NonNullable<CalculationPdfOptions['tables']>[number];
type PdfChart = NonNullable<CalculationPdfOptions['charts']>[number];
const isRecord = (value: unknown): value is Record<string, unknown> => value !== null && typeof value === 'object' && !Array.isArray(value);
const isStringArray = (value: unknown): value is string[] => Array.isArray(value) && value.every((cell: unknown) => typeof cell === 'string');
function isTable(value: unknown): value is PdfTable {
  if (!isRecord(value) || typeof value.title !== 'string' || !isStringArray(value.columns) || !value.columns.length || !Array.isArray(value.rows)) return false;
  const columnCount = value.columns.length;
  return value.rows.every((row: unknown) => isStringArray(row) && row.length === columnCount);
}
function isChart(value: unknown): value is PdfChart {
  return isRecord(value) && typeof value.title === 'string' && (value.unit === undefined || typeof value.unit === 'string') && Array.isArray(value.points) && value.points.every((point: unknown) => isRecord(point) && typeof point.label === 'string' && typeof point.value === 'number' && Number.isFinite(point.value));
}

/** Logical nodes survive wrapping and page breaks; MCIDs are allocated per page. */
type Structure = { role: string; parent?: Structure; children: Structure[]; attributes?: string; alt?: string; id?: string; objectId?: number; content: string[] };
type Line = { text: string; heading?: boolean; node?: Structure; cells?: { text: string; node: Structure }[]; cellWidth?: number; bar?: { ratio: number; negative: boolean } };
const WIDTH = 88;
const PAGE_LINES = 49;

/** Embedded BMP glyphs retain readable currency/scientific labels. Characters
 * absent from the bundled font remain explicit escapes instead of disappearing. */
function printable(text: string): string {
  return Array.from(text, character => {
    const code = character.codePointAt(0)!;
    if ((code >= 32 && code <= 126) || (code >= 160 && code <= 255) || (code > 255 && unicodeGlyphs[code])) return character;
    return code <= 65535 ? `\\u${code.toString(16).padStart(4, '0')}` : `\\u{${code.toString(16)}}`;
  }).join('');
}

function literal(text: string): string {
  if (Array.from(text).some(character => character.charCodeAt(0)>255)) return `<feff${Array.from(text,character=>character.charCodeAt(0).toString(16).padStart(4,'0')).join('')}>`;
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
  const language = optionalText(metadata.language) ?? 'en';
  if (!/^[a-zA-Z]{2,8}(?:-[a-zA-Z0-9]{1,8})*$/.test(language)) throw new Error('Invalid PDF language');
  const lines: Line[] = [];
  const document: Structure = { role: 'Document', children: [], content: [] };
  const structure = (role: string, parent = document, attributes?: string): Structure => {
    const node: Structure = { role, parent, children: [], content: [], attributes };
    parent.children.push(node);
    return node;
  };
  const add = (text: string, heading = false, artifact = false) => {
    const node = text && !artifact ? structure(heading ? (document.children.length ? 'H2' : 'H1') : 'P') : undefined;
    const visible = printable(text);
    if (!visible) lines.push({ text: '', heading, node });
    for (let start = 0; start < visible.length; start += WIDTH) lines.push({ text: visible.slice(start, start + WIDTH), heading, node });
  };
  add(title, true);
  add(`Calculator: ${captured.calculatorSlug} | Engine version: ${captured.calculatorVersion}`);
  add('Raw engine values: full numeric precision; no display rounding or sampled rows.');
  add('Units appear only where supplied by the calculation or bound display metadata.');
  add('Embedded Unicode glyphs are readable.');
  add('Unsupported characters and controls use explicit Unicode escapes.');
  add('Tagged PDF; PDF/UA conformance: UNVERIFIED.');
  add('Text follows document order; charts include complete numeric text alternatives.');
  const field = (path: string, value: unknown) => {
    if (value !== null && typeof value === 'object' && Object.keys(value).length) {
      for (const [key, cell] of Object.entries(value)) field(`${path}[${Array.isArray(value) ? key : JSON.stringify(key)}]`, cell);
    } else add(`${path} = ${valueText(value)}`);
  };
  const hasSections = (Array.isArray(metadata.tables) && metadata.tables.length > 0) || (Array.isArray(metadata.charts) && metadata.charts.length > 0);
  const appendRaw = () => {
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
  };
  if (!hasSections) appendRaw();
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
  // Report sections precede, and never replace, the complete raw appendix.
  // Each table panel has at most four columns, retaining every column and row.
  const pageBreak = () => { while (lines.length % PAGE_LINES) lines.push({ text: '' }); };
  if (metadata.tables !== undefined) {
    if (!Array.isArray(metadata.tables)) throw new Error('Invalid PDF tables');
    let tableIndex = 0;
    for (const table of metadata.tables) {
      if (!isTable(table)) throw new Error('Invalid PDF table');
      for (let column = 0; column < table.columns.length; column += 4) {
        const columns = table.columns.slice(column, column + 4);
        const width = Math.floor((WIDTH - 3 * (columns.length - 1)) / columns.length);
        const tableLine = (cells: readonly string[], heading = false, nodes?: Structure[]) => {
          const wrapped = cells.map(cell => {
            const visible = printable(cell);
            return Array.from({ length: Math.max(1, Math.ceil(visible.length / width)) }, (_, index) => visible.slice(index * width, (index + 1) * width));
          });
          return Array.from({ length: Math.max(...wrapped.map(cell => cell.length)) }, (_, index) => ({ text: wrapped.map(cell => (cell[index] ?? '').padEnd(width)).join(' | '), heading, cells: nodes?.map((node, cell) => ({ node, text: wrapped[cell][index] ?? '' })), cellWidth: width }));
        };

        // Very long column labels remain complete but cannot consume the whole page.
        pageBreak();
        add(table.title, true);
        add(`Columns ${column + 1}-${column + columns.length} of ${table.columns.length}`);
        const tableNode = structure('Table');
        const headerRow = structure('TR', tableNode);
        const headerNodes = columns.map((_, index) => {
          const node = structure('TH', headerRow, '/O /Table /Scope /Column');
          node.id = `table-${tableIndex}-column-${column + index}`;
          return node;
        });
        lines.push(...tableLine(columns, true, headerNodes));
        const repeat = () => {
          pageBreak(); add(printable(table.title).slice(0, 60) + ' (continued)', true, true);
          // Full labels remain at panel start; bounded continuation labels leave room for data.
          add('Columns continue in the same order as the full headings above.', false, true);
          for (const header of tableLine(columns.map(label => printable(label).slice(0, width)), true)) add(header.text, true, true);
        };
        if (!table.rows.length) add('(no rows)');
        table.rows.forEach(row => {
          const rowNode = structure('TR', tableNode);
          const cells = columns.map((_, index) => structure('TD', rowNode, `/O /Table /Headers [${literal(headerNodes[index].id!)}]`));
          const rendered = tableLine(row.slice(column, column + 4), false, cells);
          for (const line of rendered) {
            if (lines.length % PAGE_LINES === 0) repeat();
            lines.push(line);
          }
        });
      }
      tableIndex++;
    }
  }
  if (metadata.charts !== undefined) {
    if (!Array.isArray(metadata.charts)) throw new Error('Invalid PDF charts');
    for (const chart of metadata.charts) {
      if (!isChart(chart)) throw new Error('Invalid PDF chart');
      const scale = chart.points.reduce((maximum, point) => Math.max(maximum, Math.abs(point.value)), 0);
      const header = (continued = false) => {
        add(continued ? printable(chart.title).slice(0, 60) + ' (continued)' : chart.title, true, continued);
        add(continued ? `Linear scale unchanged: zero at center; full span +/-${valueText(scale)}.` : `Linear scale: zero at center; full span +/-${valueText(scale)}${chart.unit === undefined ? '' : ` [${chart.unit}]`}.`, false, continued);
        add('Bars use one shared scale. Tiny values may be invisible; exact values follow.', false, continued);
      };
      pageBreak(); header();
      const figure = chart.points.length ? structure('Figure') : undefined;
      if (figure) figure.alt = `${chart.title}; ${chart.points.map(point => `${point.label} = ${valueText(point.value)}${chart.unit === undefined ? '' : ` [${chart.unit}]`}`).join('; ')}`;
      if (!chart.points.length) add('(no points)');
      for (const point of chart.points) {
        if (PAGE_LINES - lines.length % PAGE_LINES < 5 || lines.length % PAGE_LINES === 0) { pageBreak(); header(true); }
        add(`${point.label} = ${valueText(point.value)}${chart.unit === undefined ? '' : ` [${chart.unit}]`}`);
        if (lines.length % PAGE_LINES === 0) { pageBreak(); header(true); }
        lines.push({ text: '', node: figure, bar: { ratio: scale === 0 ? 0 : Math.abs(point.value) / scale, negative: point.value < 0 } });
      }
    }
  }
  if (hasSections) { pageBreak(); add('COMPLETE RAW APPENDIX', true); appendRaw(); }
  const pages: Line[][] = [];
  for (let start = 0; start < lines.length; start += PAGE_LINES) pages.push(lines.slice(start, start + PAGE_LINES));
  // All syntax and streams are ASCII (Latin-1 glyphs use octal escapes), so
  // string offsets equal byte offsets in the mandatory cross-reference table.
  const objects: string[] = [];
  const reserve = () => { objects.push(''); return objects.length; };
  const unicodeCharacters = [...new Set(lines.flatMap(line => Array.from(line.text + (line.cells?.map(cell=>cell.text).join('')??''))))];
  const needsUnicode = unicodeCharacters.some(character=>character.charCodeAt(0)>255);
  let unicodeFont: number | undefined;
  if(needsUnicode){
    const font=reserve(), descendant=reserve(), descriptor=reserve(), file=reserve(), mapping=reserve(), toUnicode=reserve();
    unicodeFont=font;
    const hex=(value:number)=>value.toString(16).padStart(4,'0');
    const used=unicodeCharacters.map(character=>character.charCodeAt(0)).sort((a,b)=>a-b);
    const gids=Array.from({length:used.at(-1)!+1},(_,code)=>hex(unicodeGlyphs[code]??0)).join('');
    const fontHex=Array.from(atob(fontData),character=>character.charCodeAt(0).toString(16).padStart(2,'0')).join('')+'>';
    objects[file-1]=`<< /Length ${fontHex.length} /Length1 ${fontByteLength} /Filter [/ASCIIHexDecode /FlateDecode] >>\nstream\n${fontHex}\nendstream`;
    objects[mapping-1]=`<< /Length ${gids.length+1} /Filter /ASCIIHexDecode >>\nstream\n${gids}>\nendstream`;
    const chunks=[];
    for(let start=0;start<used.length;start+=100){const codes=used.slice(start,start+100);chunks.push(`${codes.length} beginbfchar\n${codes.map(code=>`<${hex(code)}> <${hex(code)}>`).join('\n')}\nendbfchar`);}
    const cmap=`/CIDInit /ProcSet findresource begin\n12 dict begin\nbegincmap\n/CIDSystemInfo << /Registry (Adobe) /Ordering (UCS) /Supplement 0 >> def\n/CMapName /CalcuMintUnicode def\n/CMapType 2 def\n1 begincodespacerange\n<0000> <ffff>\nendcodespacerange\n${chunks.join('\n')}\nendcmap\nCMapName currentdict /CMap defineresource pop\nend\nend`;
    objects[toUnicode-1]=`<< /Length ${cmap.length} >>\nstream\n${cmap}\nendstream`;
    objects[descriptor-1]=`<< /Type /FontDescriptor /FontName /CMUNIV+CalcuMintUnicode /Flags 33 /FontBBox [-559 -375 718 1028] /ItalicAngle 0 /Ascent 929 /Descent -236 /CapHeight 729 /StemV 80 /FontFile2 ${file} 0 R >>`;
    objects[descendant-1]=`<< /Type /Font /Subtype /CIDFontType2 /BaseFont /CMUNIV+CalcuMintUnicode /CIDSystemInfo << /Registry (Adobe) /Ordering (Identity) /Supplement 0 >> /FontDescriptor ${descriptor} 0 R /DW 602 /CIDToGIDMap ${mapping} 0 R >>`;
    objects[font-1]=`<< /Type /Font /Subtype /Type0 /BaseFont /CMUNIV+CalcuMintUnicode /Encoding /Identity-H /DescendantFonts [${descendant} 0 R] /ToUnicode ${toUnicode} 0 R >>`;
  }
  const catalog = reserve(), pageTree = reserve(), bodyFont = reserve(), headingFont = reserve(), info = reserve();
  objects[info - 1] = `<< /Title ${literal(printable(title))} /Creator (CalcuMint deterministic calculation report) >>`;
  objects[bodyFont - 1] = '<< /Type /Font /Subtype /Type1 /BaseFont /Courier /Encoding /WinAnsiEncoding >>';
  objects[headingFont - 1] = '<< /Type /Font /Subtype /Type1 /BaseFont /Courier-Bold /Encoding /WinAnsiEncoding >>';
  const structureRoot = reserve(), parentTree = reserve();
  const nodes: Structure[] = [];
  const allocate = (node: Structure) => { node.objectId = reserve(); nodes.push(node); node.children.forEach(allocate); };
  allocate(document);
  const parentEntries: string[] = [];
  const pageIds = pages.map((page, index) => {
    const pageId = reserve(), streamId = reserve();
    const owners: number[] = [];
    const marked = (command: string, node?: Structure) => {
      if (!node) return `/Artifact BMC\n${command}\nEMC`;
      const mcid = owners.length;
      owners.push(node.objectId!);
      node.content.push(`<< /Type /MCR /Pg ${pageId} 0 R /MCID ${mcid} >>`);
      return `/${node.role} << /MCID ${mcid} >> BDC\n${command}\nEMC`;
    };
    const commands = [
      '/Artifact << /Type /Pagination /Subtype /Header >> BDC',
      '0.12 0.28 0.30 rg',
      `BT /F2 11 Tf 48 798 Td ${literal('CalcuMint | Calculation report')} Tj ET`,
      '0.75 0.82 0.82 RG 48 786 m 547 786 l S',
      'EMC',
      ...page.map((line, row) => {
        const text = (value: string, x = 48) => {
          const unicode=Array.from(value).some(character=>character.charCodeAt(0)>255);
          const encoded=unicode?`<${Array.from(value,character=>character.charCodeAt(0).toString(16).padStart(4,'0')).join('')}>`:literal(value);
          return `BT /${unicode?'F3':line.heading ? 'F2' : 'F1'} 9 Tf 0.10 0.13 0.15 rg ${x} ${763 - row * 14} Td ${encoded} Tj ET`;
        };
        if (line.cells) return line.cells.map((cell, column) => {
          const x = 48 + column * (line.cellWidth! + 3) * 5.4;
          return (column ? marked(text(' | ', x - 16.2)) + '\n' : '') + marked(text(cell.text, x), cell.node);
        }).join('\n');
        if (line.bar) return marked(`0.45 0.52 0.52 RG 297 ${758 - row * 14} m 297 ${768 - row * 14} l S 0.12 0.28 0.30 rg ${(line.bar.negative ? 297 - line.bar.ratio * 240 : 297).toFixed(6)} ${760 - row * 14} ${(line.bar.ratio * 240).toFixed(6)} 6 re f`, line.node);
        return marked(text(line.text), line.node);
      }),
      '/Artifact << /Type /Pagination /Subtype /Footer >> BDC',
      '0.75 0.82 0.82 RG 48 62 m 547 62 l S',
      `BT /F1 9 Tf 0.30 0.35 0.35 rg 48 45 Td ${literal(`Engine v${captured.calculatorVersion} | Page ${index + 1} of ${pages.length}`)} Tj ET`,
      'EMC',
    ].join('\n');
    parentEntries.push(`${index} [${owners.map(id => `${id} 0 R`).join(' ')}]`);
    objects[streamId - 1] = `<< /Length ${commands.length} >>\nstream\n${commands}\nendstream`;
    objects[pageId - 1] = `<< /Type /Page /Parent ${pageTree} 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 ${bodyFont} 0 R /F2 ${headingFont} 0 R ${unicodeFont?`/F3 ${unicodeFont} 0 R`:''} >> >> /Contents ${streamId} 0 R /StructParents ${index} /Tabs /S >>`;
    return pageId;
  });
  objects[catalog - 1] = `<< /Type /Catalog /Pages ${pageTree} 0 R /Lang ${literal(language)} /MarkInfo << /Marked true >> /StructTreeRoot ${structureRoot} 0 R /ViewerPreferences << /DisplayDocTitle true >> >>`;
  objects[pageTree - 1] = `<< /Type /Pages /Count ${pages.length} /Kids [${pageIds.map(id => `${id} 0 R`).join(' ')}] >>`;
  const idTree = reserve();
  objects[idTree - 1] = `<< /Names [${nodes.filter(node => node.id).sort((a, b) => a.id! < b.id! ? -1 : 1).map(node => `${literal(node.id!)} ${node.objectId} 0 R`).join(' ')}] >>`;
  objects[structureRoot - 1] = `<< /Type /StructTreeRoot /K [${document.objectId} 0 R] /ParentTree ${parentTree} 0 R /IDTree ${idTree} 0 R /ParentTreeNextKey ${pages.length} >>`;
  objects[parentTree - 1] = `<< /Nums [${parentEntries.join(' ')}] >>`;
  for (const node of nodes) {
    objects[node.objectId! - 1] = `<< /Type /StructElem /S /${node.role} /P ${node.parent?.objectId ?? structureRoot} 0 R /K [${node.children.map(child => `${child.objectId} 0 R`).concat(node.content).join(' ')}]${node.attributes ? ` /A << ${node.attributes} >>` : ''}${node.id ? ` /ID ${literal(node.id)}` : ''}${node.alt ? ` /Alt ${literal(printable(node.alt))}` : ''} >>`;
  }
  // PDF 1.7 supports table Headers/Scope attributes and pagination artifact subtypes.
  let pdf = '%PDF-1.7\n';
  const offsets = [0];
  objects.forEach((object, index) => { offsets.push(pdf.length); pdf += `${index + 1} 0 obj\n${object}\nendobj\n`; });
  const xref = pdf.length;
  pdf += `xref\n0 ${offsets.length}\n0000000000 65535 f \n${offsets.slice(1).map(offset => `${String(offset).padStart(10, '0')} 00000 n \n`).join('')}trailer\n<< /Size ${offsets.length} /Root ${catalog} 0 R /Info ${info} 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return new TextEncoder().encode(pdf);
}
