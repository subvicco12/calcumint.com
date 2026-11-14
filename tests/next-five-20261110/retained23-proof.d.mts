export const RETAINED23_COMMIT: '23f2860c16310385f6c37f7a2bc3c86890631c98';
export type Retained23Verifier='auth'|'ui'|'native'|'canonicalVerify'|'canonicalTests';
export type Retained23Context={label:'RETAINED23';commit:typeof RETAINED23_COMMIT;root:string;read:(path:string)=>Buffer;runVerifier:(key:Retained23Verifier)=>string};
export function withRetained23Proof<T>(callback:(context:Retained23Context)=>T|Promise<T>):Promise<T>;
