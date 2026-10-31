import {readFile} from 'node:fs/promises';
import {compareDescriptors} from './schema-descriptor.mjs';
if(process.argv.length!==4)throw Error('Usage: node tests/batch16-auth/compare-schema.mjs <model-descriptor.json> <authorized-capture-descriptor.json>');
const values=await Promise.all(process.argv.slice(2).map(p=>readFile(p,'utf8').then(JSON.parse)));
const result=compareDescriptors(...values);console.log(JSON.stringify(result,null,2));if(!result.equal)process.exitCode=2;
