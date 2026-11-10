export function readRuntimeEvidenceFile(path:string):Buffer;
export function readRuntimeEvidenceFile(path:string,encoding:'utf8'):string;
export function retainedRuntimeBytes(path:string,read?:(path:string)=>Buffer,git?:(args:string[])=>Buffer):Buffer;
export function verifyCurrentRuntimeContext(read?:(path:string)=>Buffer,git?:(args:string[])=>Buffer):void;
