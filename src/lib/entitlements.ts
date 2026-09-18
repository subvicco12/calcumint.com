export type CalcuMintPlan="free"|"pro"|"business";
export type PlanEntitlements={
 ads:boolean; historyLimit:number|null; favoritesLimit:number|null; projects:boolean; scenarios:boolean; exports:boolean; aiExplanations:boolean; businessStudio:boolean; api:boolean;
};
const ENTITLEMENTS:Record<CalcuMintPlan,PlanEntitlements>={
 free:{ads:true,historyLimit:20,favoritesLimit:10,projects:false,scenarios:false,exports:false,aiExplanations:false,businessStudio:false,api:false},
 pro:{ads:false,historyLimit:null,favoritesLimit:null,projects:true,scenarios:true,exports:true,aiExplanations:true,businessStudio:false,api:false},
 business:{ads:false,historyLimit:null,favoritesLimit:null,projects:true,scenarios:true,exports:true,aiExplanations:true,businessStudio:true,api:true}
};
export function normalizePlan(value:unknown):CalcuMintPlan{return value==="pro"||value==="business"?value:"free"}
export function getPlanEntitlements(value:unknown):PlanEntitlements{return ENTITLEMENTS[normalizePlan(value)]}
export function hasEntitlement(value:unknown,key:keyof PlanEntitlements):boolean{const v=getPlanEntitlements(value)[key];return typeof v==="boolean"?v:true}
