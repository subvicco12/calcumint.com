import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {describe,expect,it} from 'vitest';
import manifest from '../../data/catalog/cloud-batch03-2026-10-28/manifest.json';
import {sourceBoundProfiles,profileSourceBindings} from './source-bound-profiles';

describe('source profile provenance guard',()=>{
 it.each(manifest.sources)('retains exact committed source record bytes for $id',source=>{
  const actual=createHash('sha256').update(readFileSync(source.path)).digest('hex');
  expect(actual).toBe(source.recordSHA256);
  expect(source.extractedTextSHA256).toMatch(/^[0-9a-f]{64}$/);
  expect(source.publisherBodySHA256).toBeNull();
  expect(source.normativeVersion).toBeNull();
 });
 it('binds every private profile to captured official evidence with no acceptance promotion',()=>{
  expect(manifest.canonicalAcceptance).toBe(false);expect(manifest.releaseHold).toBe(true);
  for(const d of sourceBoundProfiles){
   expect(d.reviewStatus).toBe('draft');expect(d.version).toBe(1);
   const bindings=profileSourceBindings[d.id];expect(bindings.length).toBe(d.sources.length);
   for(const b of bindings)expect(b.sha256).toBe(manifest.sources.find(s=>s.id===b.id)!.extractedTextSHA256);
  }
 });
});
