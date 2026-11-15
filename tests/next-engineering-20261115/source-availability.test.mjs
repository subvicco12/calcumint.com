import test from 'node:test';import assert from 'node:assert/strict';import {fetchSourceLineage} from '../../scripts/fetch-source-lineage.mjs';
test('all retained Stage10 authority pins are explicitly available in a fresh shallow fetch',()=>{
 const refs=new Set();fetchSourceLineage(args=>{if(args[0]==='fetch'){args.slice(4).forEach(ref=>refs.add(ref));return Buffer.alloc(0);}const ref=args[2].slice(0,40);if(!refs.has(ref))throw Error('Missing shallow source');return Buffer.from(ref);});
 for(const ref of ['31a5322591af546b732096008dea8408cca23f9b','7e65c1fe521116d247688b8f11edd4bab4af6f4e','2b74b7a5c81bbae7625451df4f7f082b5452093b'])assert([...refs].some(value=>value.startsWith(ref)),'Retained authority pin missing: '+ref);
});
