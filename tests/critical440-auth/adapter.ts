export {saveHistoryAtomically,readAccountEntitlements} from '../../src/lib/account-persistence';
export {validateHistoricalCalculationSnapshot,readPersistedCalculationSnapshot} from '../../src/lib/persisted-calculation';
export {verifyRegisteredSnapshot} from '../../src/lib/registered-snapshot-verification';
import {publication20Definitions} from '../../src/lib/publication20';
import {runCalculator} from '../../src/calculators/engine';
export function generate(catalogId:number,input:unknown){const entry=publication20Definitions.find(x=>x.catalogId===catalogId);if(!entry)throw Error('Unknown exact ID');const def=entry.definition;if(catalogId===440&&(def.id!=='conversion.frequency'||def.slug!=='frequency-converter'||def.version!==1))throw Error('Exact #440 engine binding mismatch');const run=runCalculator(def,input);return {calculatorSlug:def.slug,calculatorVersion:def.version,input:run.input,output:run.output};}
