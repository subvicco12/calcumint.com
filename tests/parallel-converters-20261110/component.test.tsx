// @vitest-environment jsdom
import React from 'react';
import {it,expect,vi} from 'vitest';
import {render,fireEvent,screen,cleanup} from '@testing-library/react';
import {ConverterWorkedExamples} from '../../src/components/converter-cohort-20261110-examples';
it('shows method and units, and only loads a draft after an explicit accessible action',()=>{
 const onUse=vi.fn();render(<ConverterWorkedExamples slug="temperature-converter" onUse={onUse}/>);
 expect(screen.getByText('32 f → 0 c')).toBeTruthy();expect(screen.getByText(/pair-specific affine/)).toBeTruthy();expect(onUse).not.toHaveBeenCalled();
 fireEvent.click(screen.getByRole('button',{name:'Use worked example 1'}));expect(onUse).toHaveBeenCalledWith({value:'32',fromUnit:'f',toUnit:'c'});cleanup();
});
