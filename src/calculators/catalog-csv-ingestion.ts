import type { MasterCatalogRow } from "./catalog-reconciliation";

/** Parse the three-column master catalog CSV without external dependencies. */
export function parseMasterCatalogCsv(csv: string): readonly MasterCatalogRow[] {
  const records: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  let endedQuote = false;
  const source = csv.replace(/^\uFEFF/, "");
  for (let i = 0; i < source.length; i++) {
    const char = source[i];
    if (quoted) {
      if (char === '"' && source[i + 1] === '"') { field += '"'; i++; }
      else if (char === '"') { quoted = false; endedQuote = true; }
      else field += char;
    } else if (char === '"' && field === "" && !endedQuote) {
      quoted = true;
    } else if (char === ",") {
      row.push(field); field = ""; endedQuote = false;
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && source[i + 1] === "\n") i++;
      row.push(field); field = ""; endedQuote = false;
      if (row.some((value) => value !== "")) records.push(row);
      row = [];
    } else if (endedQuote || char === '"') {
      throw new Error("Malformed CSV quoting");
    } else field += char;
  }
  if (quoted) throw new Error("Unterminated CSV quote");
  if (row.length || field !== "") { row.push(field); if (row.some((value) => value !== "")) records.push(row); }
  const [header, ...body] = records;
  if (!header || header.length !== 3 || header.join(",").toLowerCase() !== "master_id,domain,title") {
    throw new Error("Expected master_id,domain,title CSV header");
  }
  const ids = new Set<number>();
  return body.map((values, index) => {
    if (values.length !== 3) throw new Error(`Invalid column count at row ${index + 2}`);
    const [rawId, domain, title] = values;
    if (!/^[1-9][0-9]*$/.test(rawId)) throw new Error(`Invalid master ID at row ${index + 2}`);
    const masterId = Number(rawId);
    if (!Number.isSafeInteger(masterId) || ids.has(masterId)) throw new Error(`Duplicate or unsafe master ID: ${rawId}`);
    if (!domain.trim() || !title.trim()) throw new Error(`Empty domain or title at row ${index + 2}`);
    ids.add(masterId);
    return { masterId, domain, title };
  });
}
