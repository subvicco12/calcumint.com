/** Types describe the runtime proof; they grant no source, certification or publication authority. */
export function assertNamedApplicationSuccessor(
 file:string,
 recordedSHA256:string,
 currentBytes:Buffer,
 read?:(path:string)=>Buffer,
 git?:(args:string[])=>Buffer
):{file:string;recordedApplicationGit:string;currentApplicationGit:string;historicalEvidenceOnly:true};
