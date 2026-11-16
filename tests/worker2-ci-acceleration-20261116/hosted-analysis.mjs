import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
export function analyzeHostedUnit(text) {
  const clean = text.replace(/\x1b\[[0-9;]*[A-Za-z]/g, '');
  const files = [];
  for (const line of clean.split('\n')) {
    const row = /([✓❯])\s+(src\/\S+\.test\.tsx?)\s+\(.*?\)\s+(\d+)ms/.exec(line);
    if (row) files.push({ status: row[1] === '✓' ? 'passed' : 'failed', path: row[2], milliseconds: Number(row[3]) });
  }
  return { observedCompletedOuterFiles: files.length, passed: files.filter(x => x.status === 'passed').length,
    failed: files.filter(x => x.status === 'failed').length,
    summedOuterBodyMilliseconds: files.reduce((total, row) => total + row.milliseconds, 0),
    cancellationObserved: clean.includes('The operation was canceled.'),
    fullSuiteCompletionEstablished: false,
    largestOuterFiles: [...files].sort((a, b) => b.milliseconds - a.milliseconds).slice(0, 15) };
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (!process.argv[2]) throw new Error('Provide the retained hosted unit log');
  console.log(JSON.stringify(analyzeHostedUnit(readFileSync(process.argv[2], 'utf8')), null, 2));
}
