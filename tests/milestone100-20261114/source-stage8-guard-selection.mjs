/** Only explicitly captured Stage8 guards advance; inherited legacy rows retain their own evolution. */
export function selectStage8GuardSuccessor(capture,path){
 const owned=[...capture.sourceStage8.guardPaths,...(capture.sourceStage8V6?.guardPaths??[]),...(capture.sourceStage8V7?.guardPaths??[]),...(capture.sourceStage8V8?.guardPaths??[]),...(capture.sourceStage8V9?.guardPaths??[]),...(capture.sourceStage8V10?.guardPaths??[]),...(capture.sourceStage8V11?.guardPaths??[]),...(capture.sourceStage8V12?.guardPaths??[]),...(capture.sourceStage8V13?.guardPaths??[]),...(capture.sourceStage8V14?.guardPaths??[]),...(capture.sourceStage8V15?.guardPaths??[]),...(capture.sourceStage8V16?.guardPaths??[])];
 if(!owned.includes(path))return undefined;
 return capture.currentSources.find(row=>row.path===path);
}
