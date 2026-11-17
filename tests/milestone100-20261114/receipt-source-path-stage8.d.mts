export type CapturedSourceBinding=Readonly<{path:string;sha256:string}>;
export function verifyCapturedSource(binding:CapturedSourceBinding,read?:(path:string)=>Promise<Buffer>):Promise<string>;
export function verifyCapturedCurrentCaller(binding:CapturedSourceBinding,read?:(path:string)=>Buffer,git?:(args:string[])=>Buffer):string;
