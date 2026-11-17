/** Explicit current UI succession; retained source decisions and old proof stay immutable. */
import {callerPaths as retainedPaths,verifyCallerSuccessor as verifyRetainedCallerSuccessor} from './caller-successor-retained.mjs';
import {businessCallerPaths,verifyCurrentBusinessCaller} from '../publication-workflows-20261109/business-caller-successor.mjs';
export {verifyRetainedCallerSuccessor};
export const callerPaths=Object.freeze([...new Set([...retainedPaths,...businessCallerPaths])]);
export function verifyCallerSuccessor(path,bytes,claimedHistoricalHash,read,git){
 if(businessCallerPaths.includes(path))return verifyCurrentBusinessCaller(path,bytes,claimedHistoricalHash,read,git);
 return verifyRetainedCallerSuccessor(path,bytes,claimedHistoricalHash);
}
