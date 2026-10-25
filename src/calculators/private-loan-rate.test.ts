import {expect,it} from 'vitest';
import {solvePrivateLoanRate} from './private-loan-rate';
it('solves independently derived zero-rate and one-period interest cases',()=>{expect(solvePrivateLoanRate(1200,400,3)).toBe(0);expect(solvePrivateLoanRate(100,101,1)).toBeCloseTo(12,7);expect(solvePrivateLoanRate(100,110,1)).toBeCloseTo(120,7);});
it('rejects infeasible payments and invalid periods instead of returning a false rate',()=>{expect(()=>solvePrivateLoanRate(100,40,2)).toThrow();expect(()=>solvePrivateLoanRate(100,200,1)).toThrow();expect(()=>solvePrivateLoanRate(100,101,1.5)).toThrow();expect(()=>solvePrivateLoanRate(Infinity,101,1)).toThrow();});
it('does not accept infeasible tiny payments through an absolute currency tolerance',()=>{expect(()=>solvePrivateLoanRate(1e-20,1e-22,1)).toThrow();expect(solvePrivateLoanRate(1e-20,1.01e-20,1)).toBeCloseTo(12,7);expect(()=>solvePrivateLoanRate(Number.MIN_VALUE,Number.MIN_VALUE,1200)).toThrow();});
