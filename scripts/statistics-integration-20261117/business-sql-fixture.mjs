import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {startBusinessPredecessor as start44,unhold} from '../milestone100-20261114/business-sql-fixture.mjs';
export {unhold};
export async function startBusinessPredecessor(){
 const db=await start44();
 try{const raw=await readFile('docs/milestone100-20261114/business-held-successor.sql','utf8');await assert.rejects(db.sql(raw),/UNAPPLIED_MILESTONE100/);await db.sql(unhold(raw));const construction=await readFile('docs/construction-qualification-20261116/held-business-successor.sql','utf8');await assert.rejects(db.sql(construction),/UNAPPLIED_CONSTRUCTION/);await db.sql(unhold(construction));const previous=await readFile('docs/coordinator-worker3-20261117/business/held-successor.sql','utf8');await assert.rejects(db.sql(previous),/UNAPPLIED_NEXT_ENGINEERING/);await db.sql(unhold(previous));return db;}catch(e){await db.close();throw e;}
}
