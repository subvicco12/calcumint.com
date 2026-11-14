/** Only explicitly captured Stage8 guards advance; inherited legacy rows retain their own evolution. */
export function selectStage8GuardSuccessor(capture,path){
 const owned=[...capture.sourceStage8.guardPaths,...(capture.sourceStage8V6?.guardPaths??[]),...(capture.sourceStage8V7?.guardPaths??[])];
 if(!owned.includes(path))return undefined;
 return capture.currentSources.find(row=>row.path===path);
}
