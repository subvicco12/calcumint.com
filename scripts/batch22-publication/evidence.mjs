/** Additive evidence; no authority promotion or lifecycle execution. */
import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const dir='docs/full-product-batch22/';
const files=['docs/full-product-batch21/readiness-delta-540.json',dir+'six-eligibility-matrix.json',dir+'live-interface-audit.json',dir+'preflight.json',dir+'hosted-candidate-state.json'];
const buffers=await Promise.all(files.map(f=>readFile(f)));const [prior,six,audit,preflight,hosted]=buffers.map(b=>JSON.parse(b));
assert.equal(prior.rows.length,540);assert.equal(hosted.rows.length,6);assert(hosted.rows.every(r=>!r.catalog_record_exists&&r.qa_rows===0&&r.source_rows===0&&!r.reviewer_assigned));
assert.equal(audit.softwareGaps.previouslyMissingAccountControls.length,11);assert.equal(audit.softwareGaps.missingAccountControlCount,0);assert.equal(audit.summary.physicsExactExportReplayJourneys,22);assert(audit.rows.every(r=>r.accountControlsPresent===4&&r.journeys.length===2));
assert.equal(audit.rows.length,43);assert.equal(new Set(audit.rows.map(r=>r.slug)).size,43);
const output={baseline:'5450378577fd8a5919e439a0d02044ac11dbfcd6',kind:'ADDITIVE_PUBLICATION_READINESS_NOT_ACCEPTANCE',releaseHold:true,productionWrites:false,canonicalPromotion:false,summary:{...Object.fromEntries(Object.entries(prior.summary).filter(([key])=>!['demonstratedRouteDefectsFixed','accountWorkflowRoutesAdded','sixCandidatesImproved'].includes(key))),newlyEstablishedPublicationEligible:0,remainingPublicInterfacesAudited:43,publicInterfaceCoverage:209,accountWorkflowGapsClosedThisBatch:11,exactReplayBindingsAdded:11},rows:prior.rows.map(row=>({...row,batch22:{sixCandidatePacket:[235,251,275,276,282,283].includes(row.masterId)?dir+'six-evidence-packets.json':null,requirementDispositionUnchanged:true,publicationEligibleEstablished:false}})),eligibilityMatrix:dir+'six-eligibility-matrix.json',interfaceAudit:dir+'live-interface-audit.json',negativePreflight:dir+'preflight.json',orderedAuthorizedReleaseWave:[],sourceHashes:Object.fromEntries(files.map((f,i)=>[f,createHash('sha256').update(buffers[i]).digest('hex')])),limits:['209 is the authenticated public engine count, not approved canonical acceptance.','Interface checks use local actual-source fixtures, not authenticated production journeys.','All authority, qualified review, source approval and lifecycle requirements remain intact.']};
assert.equal(six.decisions.length,6);assert(six.decisions.every(d=>d.eligible===false));assert.equal(six.eligibleCount,0);void preflight;
const file=dir+'publication-readiness-540.json',text=JSON.stringify(output,null,2)+'\n';
if(process.argv.includes('--check'))assert.equal(await readFile(file,'utf8'),text);else await writeFile(file,text);
console.log(JSON.stringify(output.summary));
