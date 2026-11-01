import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
test('narrowed review candidate is bound and cannot activate',async()=>{
 const c=JSON.parse(await readFile('docs/owner-p0/privileges.json','utf8'));
 for(const [p,h] of Object.entries(c.sourceBindings))assert.equal(createHash('sha256').update(await readFile(p)).digest('hex'),h,p);
 assert.equal(c.activation,false);assert.equal(c.policyApproval,false);
 const sql=await readFile('tests/owner-p0/privileges/review-only.sql','utf8');
 assert(sql.indexOf('BEGIN;')<sql.indexOf('activation is not authorized'));
 assert(sql.indexOf('activation is not authorized')<sql.indexOf('REVOKE ALL'));
 assert.doesNotMatch(sql,/GRANT UPDATE \(display_name\)|GRANT SELECT ON TABLE|ALTER\s+(ROLE|DEFAULT|POLICY)|OWNER TO/i);
 assert.match(sql,/Unexpected inherited caller SELECT/);
});
