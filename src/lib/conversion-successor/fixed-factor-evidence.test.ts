import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {it,expect} from 'vitest';
const directory='docs/converter-methodology-20261109/';
const json=(name:string)=>JSON.parse(readFileSync(name,'utf8'));
const hash=(name:string)=>createHash('sha256').update(readFileSync(name)).digest('hex');
it('binds the reviewed private implementation and independent witnesses without allocating a registered version',()=>{
 const pins=json(directory+'source-pins.json');
 expect(pins.sourceCommit).toBe('8db467dd0dddbd50e7c38a7bb0215736bb3657dd');
 expect(pins.sources['src/lib/conversion-successor/fixed-factor-private.ts'].sha256).toBe('b86d00832c5d9f5329e247c90a11f1463f7a8b8afb57cbbb09df99afff123e28');
 for(const [path,binding] of Object.entries(pins.sources) as [string,{sha256:string;gitBlob:string}][]){expect(hash(path)).toBe(binding.sha256);expect(binding.gitBlob).toMatch(/^[a-f0-9]{40}$/);}
 expect(pins.registeredVersionAllocated).toBe(false);expect(pins.canonicalAdoptionAuthorized).toBe(false);
});
it('supplements four technical facts while preserving every one of the540 individual dispositions',()=>{
 const delta=json(directory+'requirements-delta.json'),parent=json(delta.parentLedger);
 expect(hash(delta.parentLedger)).toBe(delta.parentLedgerSHA256);expect(parent.rows).toHaveLength(540);
 const counts:Record<string,number>={...Object.fromEntries(Object.keys(parent.counts).map(key=>[key,0]))};
 for(const [index,row] of parent.rows.entries()){expect(row.masterId).toBe(index+1);counts[row.disposition]++;}
 expect(counts).toEqual(parent.counts);expect(delta.counts).toEqual(counts);expect(Object.values(counts).reduce((a,b)=>a+b,0)).toBe(540);
 expect(delta.rows.map((row:{masterId:number})=>row.masterId)).toEqual([424,429,437,439]);
 for(const row of delta.rows){expect(row.retainedDisposition).toBe(parent.rows[row.masterId-1].disposition);expect(row.fullCanonicalEngineeringCompleteEstablished).toBe(false);expect(row.certificationGranted).toBe(false);expect(row.publicationEligibleEstablished).toBe(false);}
 for(const key of ['newFullEngineeringComplete','newCanonicalAcceptances','newCertifications','newPublicationEligible','authorityBlockersResolved'])expect(delta[key]).toBe(0);
 expect(delta.releaseHold).toBe(true);
});
it('retains unsigned reviewer and held SQL evidence without claiming new hosted or operational acceptance',()=>{
 const current=json(directory+'440-operator-continuation.json'),packet=json(current.reviewerPacket);
 expect(hash(current.reviewerPacket)).toBe(current.reviewerPacketSHA256);
 expect(Object.values(packet.goNoGoFields).every(value=>value===null)).toBe(true);
 for(const [path,binding] of Object.entries(current.heldSQL) as [string,{sha256:string}][])expect(hash(path)).toBe(binding.sha256);
 expect(current.actualCompetentReviewerEstablished).toBe(false);expect(current.certificationGo).toBe('NO_GO');expect(current.publicationGo).toBe('NO_GO');expect(current.newProductionEvidenceClaimed).toBe(false);expect(current.productionChanges).toBe(false);expect(current.releaseHold).toBe(true);
});
