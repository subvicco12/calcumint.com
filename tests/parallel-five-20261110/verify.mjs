import {verifyComposition} from './verify-composition.mjs';
console.log((await verifyComposition(process.argv[2])).summary);
