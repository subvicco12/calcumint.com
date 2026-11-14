import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {startGoTrueFixture} from '../gotrue-runtime/fixture.mjs';
import {initializeFullSchema} from '../gotrue-full-schema/schema.mjs';
export const sqlFiles=['docs/native440/quota-readiness-wrapper.sql','docs/native440-remediation/embed-metering.sql','docs/completion-native-20261112/embed-successor.sql','docs/first-five-native-20261109/embed-metering-proposal.sql','docs/first-five-native-20261109/jobs-webhooks-proposal.sql','docs/first-five-native-20261109/embed-integrity-successor.sql','docs/next-cohort-native-20261110/contract-successor.sql','docs/parallel-five-20261110/native/contract-successor.sql','docs/technology-final-two-20261111/native/contract-successor.sql','docs/completion-first-20261112/automation/contract-successor.sql','docs/first-five-full-contract-20261109/sharing/review-only-sharing.sql','docs/next-cohort-sharing-20261110/review-only-sharing.sql','docs/parallel-five-20261110/sharing/contract-successor.sql','docs/technology-final-two-20261111/sharing/contract-successor.sql','docs/completion-sharing-20261112/contract-successor.sql'];
export const unhold=s=>s.replace(/DO (\$[a-z_]*\$) BEGIN\s*RAISE EXCEPTION '[A-Z_0-9]+';\s*END \1;/,'-- isolated disposable fixture only');
export async function startBusinessPredecessor(){
 for(const key of ['DATABASE_URL','SUPABASE_DB_URL','PGHOST','PGDATABASE','PGPORT','PGUSER','PGPASSWORD'])assert(!process.env[key],'External connection refused '+key);
 const db=await startGoTrueFixture({initializeSchema:initializeFullSchema});
 try{for(const file of [...sqlFiles,'docs/completion-wave-20261113/held-business-successor.sql']){
 const raw=await readFile(file,'utf8');assert.match(raw,/RAISE EXCEPTION 'UNAPPLIED/);await assert.rejects(db.sql(raw),/UNAPPLIED/);const candidate=unhold(raw);assert.notEqual(candidate,raw);await db.sql(candidate);
 }return db;}catch(error){await db.close();throw error;}
}
