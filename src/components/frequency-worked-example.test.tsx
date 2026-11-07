// @vitest-environment jsdom
import {expect,it} from 'vitest';
import {render,screen} from '@testing-library/react';
import {frequencyConverter} from '@/calculators/conversion/catalog-batch-3';
import {FrequencyWorkedExample} from './frequency-worked-example';
it('renders the unchanged v1 engine example with explicit inputs, formula and independently expected result',()=>{
 const before=JSON.stringify(frequencyConverter.examples);
 render(<FrequencyWorkedExample/>);
 expect(screen.getByText('Input: 2.4 GHz → MHz')).toBeTruthy();
 expect(screen.getByText('Result: 2400 MHz')).toBeTruthy();
 expect(screen.getByText('GHz denotes 10^9 Hz; MHz denotes 10^6 Hz. The source-to-target factor for this example is 1000.')).toBeTruthy();
 expect(screen.getByText('Substitution: 2.4 × 1000 = 2400 MHz')).toBeTruthy();
 expect(screen.getByText(frequencyConverter.formulas[0].expression)).toBeTruthy();
 expect(screen.getByText('Calculation engine: conversion.frequency, version 1.')).toBeTruthy();
 expect(JSON.stringify(frequencyConverter.examples)).toBe(before);
});
