import {copyCalculationData,createCalculationSnapshot,type CalculationSnapshot} from './calculation-snapshot';
import {serializeCalculationCsv} from './calculation-export';
export type ScenarioSlot='A'|'B'|'C';
export type CapturedScenario=Readonly<{slot:ScenarioSlot;notes:string;snapshot:CalculationSnapshot}>;
const slots:readonly ScenarioSlot[]=['A','B','C'];
export function captureScenario(previous:readonly CapturedScenario[],slot:ScenarioSlot,current:CalculationSnapshot,notes:string):readonly CapturedScenario[]{
 if(!slots.includes(slot)||typeof notes!=='string'||notes.length>1200)throw new Error('Invalid scenario annotation');
 const snapshot=createCalculationSnapshot(current);
 if(slot!=='A'&&!previous.some(row=>row.slot==='A'))throw new Error('Capture baseline A first');
 if(previous.some(row=>row.snapshot.calculatorSlug!==snapshot.calculatorSlug||row.snapshot.calculatorVersion!==snapshot.calculatorVersion))throw new Error('Scenario identity mismatch');
 return Object.freeze(slots.flatMap(id=>id===slot?[Object.freeze({slot,notes,snapshot})]:previous.filter(row=>row.slot===id)));
}
export function scenarioSetPayload(rows:readonly CapturedScenario[]){
 if(!rows.length||rows[0].slot!=='A')throw new Error('Capture baseline A first');
 let verified:readonly CapturedScenario[]=[];
 for(const row of rows){if(verified.some(existing=>existing.slot===row.slot))throw new Error('Duplicate scenario slot');verified=captureScenario(verified,row.slot,row.snapshot,row.notes);}
 const baseline=verified[0].snapshot;
 const {input,output}=copyCalculationData({schemaVersion:1,calculatorSlug:baseline.calculatorSlug,calculatorVersion:baseline.calculatorVersion,baseline:'A'},{scenarios:verified.map(({slot,notes,snapshot})=>({slot,notes,input:snapshot.input,output:snapshot.output}))});
 return Object.freeze({...input,...output}) as Readonly<{schemaVersion:1;calculatorSlug:string;calculatorVersion:number;baseline:'A';scenarios:readonly {slot:ScenarioSlot;notes:string;input:Record<string,unknown>;output:Record<string,unknown>}[]}>;
}
export function serializeScenarioSetCsv(rows:readonly CapturedScenario[]){
 const {scenarios,...identity}=scenarioSetPayload(rows);
 return serializeCalculationCsv(identity,{scenarios});
}
export function scenarioFields(rows:readonly CapturedScenario[],field:'input'|'output'):readonly string[]{
 return Object.freeze([...new Set(rows.flatMap(row=>Object.keys(row.snapshot[field])))]);
}
