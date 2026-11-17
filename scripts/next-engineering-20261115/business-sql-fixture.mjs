import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {startBusinessPredecessor as start44,unhold} from '../milestone100-20261114/business-sql-fixture.mjs';
export {unhold};
export async function startBusinessPredecessor(){
 const db=await start44();
 try{const raw=await readFile('docs/milestone100-20261114/business-held-successor.sql','utf8');await assert.rejects(db.sql(raw),/UNAPPLIED_MILESTONE100/);await db.sql(unhold(raw));return db;}catch(e){await db.close();throw e;}
}
