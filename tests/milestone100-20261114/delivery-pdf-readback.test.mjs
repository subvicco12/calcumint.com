import test from 'node:test';
import assert from 'node:assert/strict';
import {assertPdfSnapshotReadback} from '../../scripts/milestone100-20261114/delivery-pdf-readback.mjs';
test('PDF readback binds exact nested values to input/output paths',()=>{
 const snapshot={input:{x:2},output:{root:1,steps:['Start bracket [0, 2]']}};
 const text='input["x"] = 2\noutput["root"] = 1\noutput["steps"][0] = "Start\n bracket [0, 2]"';
 assertPdfSnapshotReadback(text,snapshot);
 assert.throws(()=>assertPdfSnapshotReadback(text.replace('output["root"] = 1','output["other"] = 1'),snapshot),/root/);
 assert.throws(()=>assertPdfSnapshotReadback(text.replace('Start','Wrong'),snapshot),/steps/);
});
