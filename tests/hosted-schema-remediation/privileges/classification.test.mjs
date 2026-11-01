import { test } from 'node:test';
import assert from 'node:assert/strict';
import { objectEffect, compareGrant, proposalGate } from './classification.mjs';
test('missing or partial catalogs cannot establish absent effects', () => {
  assert.equal(objectEffect(undefined,'x'),'UNKNOWN');
  assert.equal(objectEffect({status:'UNKNOWN',rows:[]},'x'),'UNKNOWN');
  assert.equal(objectEffect({status:'PARTIAL',rows:[]},'x'),'UNKNOWN');
  assert.equal(objectEffect({status:'COMPLETE',rows:[]},'x'),'ABSENT_EFFECT');
  assert.equal(objectEffect({status:'COMPLETE',rows:[{id:'x'}]},'x'),'PRESENT_EFFECT_IDENTITY_UNKNOWN');
});
test('model differences never establish intended privilege and absent entries are unknown', () => {
  assert.equal(compareGrant({allowed:true},{allowed:false}),'DIFFERENT_EFFECTIVE_GRANT_NOT_APPROVAL');
  assert.equal(compareGrant({allowed:false},{allowed:false}),'SAME_EFFECTIVE_GRANT');
  assert.equal(compareGrant({allowed:true},undefined),'UNKNOWN');
});
test('review eligibility rejects stale bytes, incomplete evidence and provider objects', () => {
  const expectedHashes={descriptor:'a'.repeat(64),source:'b'.repeat(64)};
  const args={expectedHashes,actualHashes:{...expectedHashes},complete:true,providerOwned:false,requirementReviewed:true};
  assert.equal(proposalGate(args),'REVIEWABLE_OFFLINE_ONLY');
  assert.equal(proposalGate({...args,actualHashes:{descriptor:'a'.repeat(64)}}),'BLOCKED_SOURCE_DRIFT');
  assert.equal(proposalGate({...args,complete:false}),'BLOCKED');
  assert.equal(proposalGate({...args,requirementReviewed:false}),'BLOCKED');
  assert.equal(proposalGate({...args,expectedHashes:{}}),'BLOCKED');
  assert.equal(proposalGate({...args,providerOwned:true}),'EXCLUDED_PROVIDER_OWNERSHIP');
});
