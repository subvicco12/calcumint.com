import {it,expect} from 'vitest';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {candidateBindings} from './bindings';
it('binds every private candidate to exact approved source bytes and original baseline tuple',()=>{const files={235:'235-graphing-calculator',251:'251-function-plotter-2d',275:'275-volume-calculator',276:'276-slope-calculator',282:'282-standard-deviation-calculator',283:'283-variance-calculator'};for(const [id,file]of Object.entries(files)){const bytes=readFileSync(`docs/full-six/input/contracts/${file}.json`);const contract=JSON.parse(bytes.toString());const b=candidateBindings[id as keyof typeof candidateBindings];expect(b.contractSHA256).toBe(createHash('sha256').update(bytes).digest('hex'));expect(b.engineId).toBe(contract.identity.engineId);expect(b.baselineVersion).toBe(contract.identity.baselineImmutableVersion);}});

it("freezes contract and version bindings at runtime",()=>{expect(Object.isFrozen(candidateBindings)).toBe(true);expect(Object.values(candidateBindings).every(Object.isFrozen)).toBe(true);});
