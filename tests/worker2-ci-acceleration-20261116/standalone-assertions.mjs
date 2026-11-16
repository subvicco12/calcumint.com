import assert from 'node:assert/strict';
export const cases = [];
export function it(title, run) { cases.push({ title, run }); }
// Advisory execution only. Actual Vitest runs retain their original deadlines.
export function expect(value) {
  return { toBe: wanted => assert.equal(value, wanted), toEqual: wanted => assert.deepEqual(value, wanted),
    toHaveLength: length => assert.equal(value.length, length), toBeGreaterThan: bound => assert(value > bound),
    toContain: wanted => assert(value.includes(wanted)),
    not: { toBe: unwanted => assert.notEqual(value, unwanted) } };
}
