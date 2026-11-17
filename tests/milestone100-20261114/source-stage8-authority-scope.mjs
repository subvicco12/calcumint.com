/** Synchronous invocation-local observation witness; no source verdict survives its callback. */
import assert from 'node:assert/strict';
import {lstatSync,realpathSync} from 'node:fs';
import {resolve} from 'node:path';
import {createSourceStage8ObservationInput,sourceStage8HistoricalView} from './source-stage8.mjs';
import {verifyParallelAuthority} from '../parallel-source-20261110/authority.mjs';
const witnesses=new WeakMap();let activeScope=null;
const headArgs=Object.freeze(['rev-parse','--verify','HEAD^{commit}']),statusArgs=Object.freeze(['status','--porcelain=v1','--untracked-files=all']);
function stateOf(actual){const head=actual.git([...headArgs]),status=actual.git([...statusArgs]);assert(Buffer.isBuffer(head)&&Buffer.isBuffer(status),'Raw actual source state must be binary');return{head:Buffer.from(head),status:Buffer.from(status)};}
function sameState(actual,before){const after=stateOf(actual);assert(after.head.equals(before.head),'Actual HEAD moved during authority scope');assert(after.status.equals(before.status),'Actual status changed during authority scope');}
function deny(scope,error){if(scope)scope.poison??=error;throw error;}
export function withActualAuthorityWitness(input,run){
 if(activeScope)return deny(activeScope,new Error('Nested authority scopes are forbidden'));
 assert.equal(arguments.length,2,'Only the fixed source input and synchronous callback are supported');
 assert.equal(typeof run,'function');
 const view=sourceStage8HistoricalView(input.git);assert(view,'Registered source capability required');assert.equal(input.read,view.historicalInput.read,'Historical source reader capability differs');assert.equal(input.root,view.historicalInput.root,'Source scope root differs');
 const before=stateOf(view.actualInput),observed=createSourceStage8ObservationInput(input),scope={input:{read:input.read,git:input.git,root:input.root},view,actual:view.actualInput,before,collector:observed.collector,active:false,poison:null};
 const token=Object.freeze({}),failures=[];let result;activeScope=scope;
 try{
  // This is the unchanged full verifier, replacing the caller's original invocation.
  assert.equal(verifyParallelAuthority(observed.input.read,observed.input.git),true);
  if(scope.poison)throw scope.poison;observed.collector.seal();sameState(scope.actual,before);scope.active=true;witnesses.set(token,scope);
  result=run(token);
  assert(!(result&&(typeof result==='object'||typeof result==='function')&&typeof result.then==='function'),'Authority scope callback must be synchronous');
 }catch(error){failures.push(error);}
 finally{
  scope.active=false;witnesses.delete(token);
  try{observed.collector.assertHealthy();sameState(scope.actual,before);}catch(error){failures.push(error);}
  if(scope.poison)failures.push(scope.poison);activeScope=null;
 }
 const unique=[...new Set(failures)];if(unique.length===1)throw unique[0];if(unique.length>1)throw new AggregateError(unique,'Authority scope failed: '+unique.map(error=>error.message).join('; '));return result;
}
export function replayActualAuthorityWitness(token,input){
 const scope=witnesses.get(token);
 if(!scope||!scope.active)return deny(activeScope,new Error('Unknown or expired authority witness'));
 try{
  if(scope.poison)throw scope.poison;
  assert.equal(input.read,scope.input.read,'Authority witness reader differs');assert.equal(input.git,scope.input.git,'Authority witness Git differs');assert.equal(input.root,scope.input.root,'Authority witness root differs');
  assert.equal(sourceStage8HistoricalView(input.git),scope.view,'Authority witness source view differs');assert.equal(scope.view.actualInput,scope.actual,'Authority witness actual provider differs');
  sameState(scope.actual,scope.before);
  for(const path of scope.collector.readPaths()){
   assert.equal(typeof path,'string');assert(path&&!path.startsWith('/')&&!path.split('/').some(part=>part==='..'||part==='.'||part===''),'Only normalized declared source paths may replay');
   const target=resolve(scope.actual.root,path),stat=lstatSync(target);assert(stat.isFile()&&!stat.isSymbolicLink(),'Regular current authority source required');assert.equal(realpathSync(target),target,'Redirected current authority source');
  }
  scope.collector.replay();sameState(scope.actual,scope.before);
 }catch(error){return deny(scope,error);}
}
