import {expect,it} from 'vitest';import {createCalculationSnapshot} from './calculation-snapshot';import {captureScenario,scenarioSetPayload,serializeScenarioSetCsv,scenarioFields} from './scenario-set';
const a=createCalculationSnapshot({calculatorSlug:'sip-calculator',calculatorVersion:1,input:{payment:0},output:{value:-.00001,rows:[{period:1,value:0}]}});
it('captures immutable complete A/B/C snapshots without changing raw values/order',()=>{let rows=captureScenario([], 'A',a,'=assumption');rows=captureScenario(rows,'C',a,'third');rows=captureScenario(rows,'B',a,'second');const payload=scenarioSetPayload(rows);expect(payload.schemaVersion).toBe(1);expect(payload.baseline).toBe('A');expect(payload.scenarios.map(x=>x.slot)).toEqual(['A','B','C']);expect(payload.scenarios[0].output).toEqual(a.output);expect(Object.isFrozen(payload.scenarios[0].output)).toBe(true);expect(JSON.parse(JSON.stringify(payload)).scenarios[0].input).toEqual(a.input);expect(serializeScenarioSetCsv(rows)).toContain('-0.00001');expect(scenarioFields(rows,'output')).toEqual(['value','rows']);});
it('rejects missing baseline, invalid replacement and mixed calculator/revision without mutating previous captures',()=>{expect(()=>captureScenario([],'B',a,'')).toThrow();const rows=captureScenario([],'A',a,'');expect(()=>captureScenario(rows,'B',{...a,calculatorVersion:2},'')).toThrow();expect(()=>captureScenario(rows,'A',{...a,output:{value:Infinity}},'')).toThrow();expect(rows[0].snapshot.output).toEqual(a.output);});
it('preserves nested data and formula-safe CSV annotations using the existing serialization contract',()=>{const rows=captureScenario([],'A',a,'=HYPERLINK("x")\nnext');const csv=serializeScenarioSetCsv(rows);expect(csv).toContain('HYPERLINK');expect(csv).toContain('period');expect(scenarioSetPayload(rows).scenarios[0].notes).toBe('=HYPERLINK("x")\nnext');});

it('retains every authoritative period in full exports without truncation',()=>{const rows=Array.from({length:1200},(_,period)=>({period:period+1,value:period===1199?1e-12:period}));const snapshot=createCalculationSnapshot({...a,output:{value:1e-12,rows}});const captures=captureScenario([],'A',snapshot,'');const payload=scenarioSetPayload(captures);expect(payload.scenarios[0].output.rows).toEqual(rows);expect(serializeScenarioSetCsv(captures)).toContain('1200');});

it('freezes version-bound display metadata separately from raw result snapshots',()=>{const metadata={schemaVersion:1 as const,calculatorSlug:a.calculatorSlug,calculatorVersion:1,inputs:{},outputs:{value:{label:'Original label',unit:'kg'}}};const rows=captureScenario([],'A',a,'',metadata);metadata.outputs.value.label='Changed caller label';expect(rows[0].displayMetadata!.outputs.value.label).toBe('Original label');expect(Object.isFrozen(rows[0].displayMetadata!.outputs.value)).toBe(true);expect(rows[0].snapshot.output).toEqual(a.output);});

it('preserves distinct scenario display contexts in JSON and CSV without modifying authoritative raw results',()=>{
 const base=createCalculationSnapshot({calculatorSlug:'percentage-of-value-calculator',calculatorVersion:1,input:{percentage:20,value:250},output:{result:50}});
 const next=createCalculationSnapshot({...base,input:{percentage:30,value:250},output:{result:75}});
 const metadata=(unit:string)=>({schemaVersion:1 as const,calculatorSlug:base.calculatorSlug,calculatorVersion:1,inputs:{value:{label:'Base amount',unit}},outputs:{result:{label:'Computed amount',unit}}});
 let captures=captureScenario([],'A',base,'baseline',metadata('USD'));
 captures=captureScenario(captures,'B',next,'alternative',metadata('EUR'));
 const payload=scenarioSetPayload(captures);
 expect(payload.scenarios.map(row=>row.output.result)).toEqual([50,75]);
 expect(payload.scenarios.map(row=>row.displayMetadata?.outputs.result.unit)).toEqual(['USD','EUR']);
 expect(serializeScenarioSetCsv(captures)).toContain('EUR');
 expect(serializeScenarioSetCsv(captures)).toContain('USD');
 expect(captures[0].snapshot.output.result).toBe(50);
});

it('reconciles CSV and JSON exports from the same validated scenario payload',()=>{
 const baseline=createCalculationSnapshot({calculatorSlug:'percentage-of-value-calculator',calculatorVersion:1,input:{percentage:20,value:250},output:{result:50}});
 const alternative=createCalculationSnapshot({...baseline,input:{percentage:30,value:250},output:{result:75}});
 let rows=captureScenario([],'A',baseline,'baseline');
 rows=captureScenario(rows,'B',alternative,'alternative');
 const payload=scenarioSetPayload(rows);
 const csv=serializeScenarioSetCsv(rows);
 expect(payload.scenarios.map(row=>row.output.result)).toEqual([50,75]);
 expect(csv).toContain('percentage-of-value-calculator');
 expect(csv).toContain('baseline');
 expect(csv).toContain('alternative');
 expect(csv).toContain('50');
 expect(csv).toContain('75');
 expect(JSON.stringify(payload)).not.toContain('differenceFromBaseline');
 expect(csv).not.toContain('differenceFromBaseline');
});

it('round-trips the complete scenario array from CSV into the same JSON evidence payload',()=>{
 const baseline=createCalculationSnapshot({calculatorSlug:'percentage-of-value-calculator',calculatorVersion:1,input:{percentage:20,value:250},output:{result:50,nested:{periods:[1,2],zero:-0}}});
 const alternative=createCalculationSnapshot({...baseline,input:{percentage:30,value:250},output:{result:75,nested:{periods:[3,4],zero:0}}});
 let captures=captureScenario([],'A',baseline,'=SUM(A1:A2)');
 captures=captureScenario(captures,'B',alternative,'line one\\nline two');
 const expected=scenarioSetPayload(captures);
 const csv=serializeScenarioSetCsv(captures);
 // The shared serializer uses quoted RFC-style cells, doubling embedded quotes.
 // Decode the single output/scenarios cell without a lossy substring comparison.
 const records:string[][]=[];let row:string[]=[];let cell='';let quoted=false;
 for(let i=0;i<csv.length;i++){
  const char=csv[i];
  if(char==='"'&&quoted&&csv[i+1]==='"'){cell+='"';i++;continue;}
  if(char==='"'){quoted=!quoted;continue;}
  if(char===','&&!quoted){row.push(cell);cell='';continue;}
  if(char==='\n'&&!quoted){row.push(cell);records.push(row);row=[];cell='';continue;}
  cell+=char;
 }
 row.push(cell);records.push(row);
 expect(records[0]).toEqual(['section','field','value']);
 const evidence=records.find(record=>record[0]==='output'&&record[1]==='scenarios');
 expect(evidence).toBeDefined();
 expect(JSON.parse(evidence![2])).toEqual(JSON.parse(JSON.stringify(expected.scenarios)));
 expect(records.find(record=>record[0]==='input'&&record[1]==='calculatorSlug')?.[2]).toBe(expected.calculatorSlug);
 expect(records.find(record=>record[0]==='input'&&record[1]==='calculatorVersion')?.[2]).toBe(String(expected.calculatorVersion));
 expect(records.find(record=>record[0]==='input'&&record[1]==='baseline')?.[2]).toBe('A');
 expect(expected.scenarios[0].notes).toBe('=SUM(A1:A2)');
 expect(csv).not.toContain('differenceFromBaseline');
});

it('preserves scenario slot order, multiline notes and metadata through the complete CSV evidence cell',()=>{
 const base=createCalculationSnapshot({calculatorSlug:'percentage-of-value-calculator',calculatorVersion:1,input:{percentage:20,value:250},output:{result:50}});
 const meta={schemaVersion:1 as const,calculatorSlug:base.calculatorSlug,calculatorVersion:1,inputs:{},outputs:{result:{label:'Amount',unit:'USD'}}};
 let captures=captureScenario([],'A',base,'first\nsecond',meta);
 captures=captureScenario(captures,'C',base,'=HYPERLINK("example")',meta);
 captures=captureScenario(captures,'B',base,'middle',meta);
 const expected=scenarioSetPayload(captures);
 const csv=serializeScenarioSetCsv(captures);
 // The serializer quotes each CSV cell and doubles embedded quotation marks.
 const match=csv.match(/"output","scenarios","((?:[^"]|"")*)"$/);
 expect(match).not.toBeNull();
 const encoded=match![1].replaceAll('""','"');
 expect(JSON.parse(encoded)).toEqual(JSON.parse(JSON.stringify(expected.scenarios)));
 expect(expected.scenarios.map(row=>row.slot)).toEqual(['A','B','C']);
 expect(expected.scenarios[0].notes).toBe('first\nsecond');
 expect(expected.scenarios[2].notes).toBe('=HYPERLINK("example")');
 expect(expected.scenarios[2].displayMetadata?.outputs.result.unit).toBe('USD');
});

it('keeps captured export evidence unchanged when a scenario slot is replaced after a prior export',()=>{
 const baseline=createCalculationSnapshot({calculatorSlug:'percentage-of-value-calculator',calculatorVersion:1,input:{percentage:20,value:250},output:{result:50}});
 const oldAlternative=createCalculationSnapshot({...baseline,input:{percentage:30,value:250},output:{result:75}});
 const newAlternative=createCalculationSnapshot({...baseline,input:{percentage:40,value:250},output:{result:100}});
 let captures=captureScenario([],'A',baseline,'original baseline');
 captures=captureScenario(captures,'B',oldAlternative,'old alternative');
 const priorPayload=scenarioSetPayload(captures);
 const priorCsv=serializeScenarioSetCsv(captures);
 const replaced=captureScenario(captures,'B',newAlternative,'revised alternative');
 expect(priorPayload.scenarios.map(row=>row.output.result)).toEqual([50,75]);
 expect(serializeScenarioSetCsv(captures)).toBe(priorCsv);
 expect(scenarioSetPayload(replaced).scenarios.map(row=>row.output.result)).toEqual([50,100]);
 expect(scenarioSetPayload(replaced).scenarios[1].notes).toBe('revised alternative');
 expect(replaced[0].snapshot).toEqual(captures[0].snapshot);
 expect(Object.isFrozen(priorPayload.scenarios[1].output)).toBe(true);
});
