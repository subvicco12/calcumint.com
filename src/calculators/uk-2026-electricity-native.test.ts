import {execFileSync} from 'node:child_process';
import {it,expect} from 'vitest';
import binding from '../../docs/authority485/native-source-binding.json';
it('reproduces native SHA/CRC,cells,formats,units,dates and missing-vs-zero without float conversion',()=>{expect(execFileSync('python3',['scripts/verify-uk-2026-electricity-source.py','--check'],{encoding:'utf8'})).toContain('PASS native workbook');});
it('retains stored binary tails separately from the published5decimal factor',()=>{expect(binding.factor).toMatchObject({value:'0.13096',rawStoredValue:'0.13095999999999999',nativeNumberFormat:'0.00000'});expect(binding.nativeFullCells.E25.rawValue).toBe(binding.nativeFlatCells.J.rawValue);expect(binding.missingValueChecks.missing.rawValue).toBeNull();expect(binding.missingValueChecks.genuineZero.rawValue).toBe('0');});
