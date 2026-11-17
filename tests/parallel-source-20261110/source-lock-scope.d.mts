import type {BigIntStats} from 'node:fs';
export interface SourceLockReport {removed:string[];preserved:{lock:string;reason:string}[]}
export interface SourceLockScope {readonly env:Readonly<NodeJS.ProcessEnv>;readonly owned:boolean;cleanup():SourceLockReport}
export function ensureOwnedSourceScope(env?:NodeJS.ProcessEnv):SourceLockScope;
export function reapOwnedSourceLocks(scope:SourceLockScope):SourceLockReport;
export function registerOwnedSourceLock(scope:SourceLockScope,lock:string,ownerStats:BigIntStats):object;
export function forgetOwnedSourceLock(scope:SourceLockScope,token:object):void;
