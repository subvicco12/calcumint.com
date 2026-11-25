import assert from 'node:assert/strict';
import {lengthConverter} from '@/calculators/conversion/catalog-batch-1';
import {unitConversionCalculator} from '@/calculators/core/unit-conversion';
import {energyConverter,powerConverter} from '@/calculators/conversion/catalog-batch-2';
import {forceConverter} from '@/calculators/conversion/catalog-batch-3';
import {displayFinalValue} from '@/calculators/final-framework/renderer-display';

const overlap=[
 {value:1,fromUnit:'mi',toUnit:'km'},
 {value:1,fromUnit:'mm',toUnit:'mi'},
 {value:1e-8,fromUnit:'mm',toUnit:'km'},
].map(input=>({input,specialized:lengthConverter.calculate(input,{}).result,general:unitConversionCalculator.calculate(input,{}).result}));
assert.equal(overlap[0].specialized,overlap[0].general);
assert.notEqual(overlap[1].specialized,overlap[1].general);
assert.equal(overlap[2].general,0);
assert(overlap[2].specialized>0);
const energy=energyConverter.calculate({value:1,fromUnit:'cal',toUnit:'j'},{}).result;
const horsepower=powerConverter.calculate({value:1,fromUnit:'hp_mech',toUnit:'w'},{}).result;
const force=forceConverter.calculate({value:1,fromUnit:'lbf',toUnit:'n'},{}).result;
assert.equal(energy,4.184);
assert.equal(horsepower,Number('745.69987158227022'));
assert.equal(force,Number('4.4482216152605'));
const display=displayFinalValue(force,'N');
assert.equal(display,'4.45 N');
console.log(JSON.stringify({overlap,energy,horsepower,force:{native:force,sharedRenderer:display}},null,2));
