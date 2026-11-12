/** Type declaration only; runtime authority remains the independently pinned policy module. */
export const factoryCapturePath: string;
export const factoryPolicy: Readonly<{
 captureSHA256:string;
 predecessorRef:string;
 codeRef:string;
 paths:readonly string[];
 ancestry:readonly string[];
}>;
