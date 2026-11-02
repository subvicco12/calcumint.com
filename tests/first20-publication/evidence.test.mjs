import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {project,verifyPackage} from '../../scripts/first20-publication/evidence.mjs';
const root='docs/first20-publication/';
const fixture=()=>['input/publication-readiness-register-44.json','input/requirement-dispositions-1100.json','input/reviewer-and-source-requests-44.json','input/ranked-review-cohorts.json','wave1-numerical.json','browser.json'].map(p=>JSON.parse(fs.readFileSync(root+p)));
test('keeps exact20 tuples,500 obligations and no approval while binding new evidence',()=>{verifyPackage();const r=project(...fixture());assert.equal(r.length,20);assert(r.every(x=>x.requirements.length===25&&!x.publicationEligible&&x.requirements.every(q=>!q.fullCriterionSatisfied&&q.formalDecision===null)));});
for(const [name,mutate] of [
 ['reorderedwave',d=>d[3].wave1.reverse()],['changedversion',d=>d[0].rows.find(r=>r.masterId===209).version=2],['missingrequirement',d=>d[1].entries.pop()],['inventedeligibility',d=>d[0].rows.find(r=>r.masterId===209).publicationEligible=true],['missingbrowserproof',d=>d[5].journeys.pop()],['wrongreviewerbinding',d=>d[2].rows.find(r=>r.masterId===209).engineId='other'],['promotedstatus',d=>d[1].entries.find(r=>r.masterId===209).retainedStatus='VERIFIED'],['wrongplan',d=>d[5].journeys[0].plan='other'],['tamperedoutput',d=>d[5].journeys[0].output.result++],['falselayout',d=>d[5].journeys[0].noHorizontalOverflow=false],['missingexport',d=>d[5].journeys.find(r=>r.plan==='pro').jsonExportAndReplayExecuted=false],['wrongboundary',d=>d[5].journeys[0].boundaryResult=999],['falsewitness',d=>d[4].evaluations.find(r=>r.masterId===209&&r.accepted).numericalPass=false]
])test('rejects '+name,()=>{const d=fixture();mutate(d);assert.throws(()=>project(...d));});
