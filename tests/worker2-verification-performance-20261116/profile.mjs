import assert from 'node:assert/strict';
import { fixture, sourceRef, sourcePath, kernelSourceSHA256 } from './fixture.mjs';
const repetitions = 6, pairs = 4, samples = [];
for (let pair = 0; pair < pairs; pair++) {
  const f = fixture();
  try {
    const sample = { pair, order: pair % 2 ? ['reuse', 'fresh'] : ['fresh', 'reuse'] };
    for (const mode of sample.order) {
      const kernel = f.makeKernel(mode);
      sample[mode] = f.profile(() => {
        for (let i = 0; i < repetitions; i++) { assert.equal(kernel(f.input()), f.head); f.objects(); }
      });
    }
    samples.push(sample);
  } finally { f.close(); }
}
const median = values => { const sorted = [...values].sort((a, b) => a - b); return (sorted[1] + sorted[2]) / 2; };
console.log(JSON.stringify({ result: 'NO_SAFE_OPTIMIZATION', hypothesis: 'reuse native status/HEAD/index observations between boundaries',
  sourceRef, sourcePath, kernelSourceSHA256, runtime: process.version, repetitions, pairs,
  medianMilliseconds: { fresh: median(samples.map(s => s.fresh.milliseconds)), reuse: median(samples.map(s => s.reuse.milliseconds)) },
  safety: 'Rejected: ignored-source and transient index-flag counterexamples break equivalence.',
  scope: 'Disposable native observation kernel only; not full API/source/CI acceptance. No deadline gain claimed.', samples }, null, 2));
