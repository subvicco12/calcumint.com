/** Exact finite supplemental graph extension; executable lineage tail remains byte-identical. */
import assert from 'node:assert/strict';
export const sourceStage7GraphOwner = 'src/components/calculator-interactive.tsx';
const pattern = /const bindings=(\[[\s\S]*?\n\]);/;
const short = record => ({ path: record.path, ref: record.ref, blob: record.blob, sha256: record.sha256 });
export function extendStage7Lineage(previous, records) {
  const match = pattern.exec(previous); assert(match, 'Exact predecessor bindings required');
  const rows = JSON.parse(match[1]);
  const owner = rows.find(row => row.path === sourceStage7GraphOwner); assert(owner);
  const bound = new Set();
  for (const row of rows) {
    const current = records.get(row.path)?.current;
    if (current) {
      row.intermediateSources ??= [];
      row.intermediateSources.push({ ref: row.successorRef, blob: row.successorBlob, sha256: row.successorSHA256 });
      Object.assign(row, { successorRef: current.ref, successorBlob: current.blob, successorSHA256: current.sha256 });
      bound.add(row.path);
    }
    if (row.supplementalSources) row.supplementalSources = row.supplementalSources.map(dep => {
      if (!records.has(dep.path)) return dep;
      bound.add(dep.path); return short(records.get(dep.path).current);
    });
  }
  owner.supplementalSources ??= [];
  for (const [path, row] of records) if (!bound.has(path)) owner.supplementalSources.push(short(row.current));
  return previous.replace(pattern, 'const bindings=' + JSON.stringify(rows, null, 2) + ';');
}
export function verifyStage7Lineage({ previous, current, records }) {
  assert.equal(current, extendStage7Lineage(previous, records), 'Only exact Stage7 source rows may extend the retained lineage graph');
  return true;
}
