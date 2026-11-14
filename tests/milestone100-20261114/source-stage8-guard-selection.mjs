/** Only explicitly captured Stage8 guards advance; inherited legacy rows retain their own evolution. */
export function selectStage8GuardSuccessor(capture,path){
 if(!capture.sourceStage8.guardPaths.includes(path))return undefined;
 return capture.currentSources.find(row=>row.path===path);
}
