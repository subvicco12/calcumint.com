export const testOnlySuccessorPaths:readonly string[];
export function exactTestOnlyTransformation(file:string,source:string):string;
export function assertTestOnlySuccessor(file:string,recordedSHA256:string,currentBytes:Buffer,git?:(args:string[])=>Buffer):Promise<{file:string;baselineGit:string;successorGit:string;baselineSHA256:string;successorSHA256:string;testOnly:boolean}>;

export function exactRetainedWrapperTransformation(file:string,source:string):Promise<string>;
