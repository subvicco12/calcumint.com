/** Current R4 authority and unchanged separately executed historical R3 proof. */
import {readFileSync} from 'node:fs';
import {verifyCurrentNextFiveSource,appRef} from '../../next-five-20261110/source/current-proof.mjs';
import * as retained from '../../next-five-20261110/source/retained-r3-stage.mjs';
export const priorStageRef=retained.priorStageRef,callerAppRef=appRef,contextAppRef=appRef,stageCapturePath=retained.stageCapturePath,newCallerDependencies=retained.newCallerDependencies,stageVerificationPaths=retained.stageVerificationPaths,stageGit=retained.stageGit,parseStageRows=retained.parseStageRows,priorStageRead=retained.priorStageRead;
export function verifyNextCallerStage(rows,read=readFileSync,git=stageGit){return verifyCurrentNextFiveSource(read,git,rows);}
