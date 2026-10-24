import {describe, expect, it} from 'vitest';
import {runCalculator} from '../engine';
import {cidrCalculator} from '../technology-computing/catalog-batch-1';
import {cidrResult} from './cidr-adapter';
import {cidrPresentation} from './cidr-presentation';
import {rendererTrustSurface} from './renderer-trust-surface';
describe('CIDR Final renderer contract', () => {
 it.each([[0,4294967296],[24,256],[31,2],[32,1]])('preserves total IPv4 addresses at /%i', (prefixLength,value) => {
  const output=runCalculator(cidrCalculator,{prefixLength}).output;
  const result=cidrResult(output);
  expect(result.primaryResult).toEqual({id:'result',label:'CIDR addresses',value,unit:'addresses'});
  expect(result.methodology).toContain('total IPv4 addresses');
  for(const step of output.steps) expect(result.methodology).toContain(step);
  expect(result.sources).toEqual(cidrCalculator.sources);
  expect(rendererTrustSurface(result)?.sources).toEqual(cidrCalculator.sources);
 });
 it('preserves reviewed identity and essential scalar capabilities', () => {
  expect(cidrCalculator).toMatchObject({id:'technology.cidr',slug:'cidr-calculator',version:1,reviewStatus:'reviewed',riskClass:'standard'});
  expect(cidrPresentation).toEqual({id:'standard.technology-cidr',domain:'technology-computing',family:'simple-scalar',level:'essential',supportedVisualizations:[],supportsSchedule:false,supportsGoalSolver:false,supportsScenarios:false,supportsSensitivity:false});
 });
});
